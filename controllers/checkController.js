import { Check } from "../model/checkModel.js";

// Create check
export const createCheck = async (req, res) => {
  try {
    const newCheck = new Check(req.body);
    await newCheck.save();

    const checksCount = await Check.countDocuments();
    const lastPage = Math.ceil(checksCount / 10);

    res.status(201).json({ check: newCheck, lastPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get checks
export const getChecks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const checksCount = await Check.countDocuments();

    const totalPages = Math.ceil(checksCount / limit);

    const checks = await Check.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ checks, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update check
export const updateCheck = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCheck = await Check.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCheck) {
      return res.status(404).json({ message: "check not found" });
    }

    res.status(200).json(updatedCheck);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete check
export const deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCheck = await Check.findByIdAndDelete(id);

    if (!deletedCheck) {
      return res.status(404).json({ message: "check not found" });
    }

    res.status(200).json(deletedCheck);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
