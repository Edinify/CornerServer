import { Check } from "../model/checkModel.js";
import { Table } from "../model/tableModel.js";

// Create table
export const createTable = async (req, res) => {
  const { tableNumber } = req.body;
  try {
    const checkTable = await Table.findOne({
      tableNumber: tableNumber,
    });

    if (checkTable) {
      return res.status(409).json({
        key: "table-already-exists",
        message: "this number table already exists",
      });
    }

    const newTable = new Table(req.body);
    await newTable.save();

    const tablesCount = await Table.countDocuments();
    const lastPage = Math.ceil(tablesCount / 10);

    res.status(201).json({ table: newTable, lastPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tables
export const getTables = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const tablesCount = await Table.countDocuments();

    const totalPages = Math.ceil(tablesCount / limit);

    const tables = await Table.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ tables, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get tables for user
export const getTablesForUser = async (req, res) => {
  try {
    const tables = await Table.find();

    const checkedTables = await Promise.all(
      tables.map(async (table) => {
        const checkTable = await Check.findOne({
          status: "open",
          "table._id": table.id,
        });

        return { ...table.toObject(), checkId: checkTable?._id || null };
      })
    );

    console.log(checkedTables);

    res.status(200).json(checkedTables);
  } catch (err) {
    return res.status(500).json({ message: { error: err.message } });
  }
};

// Update Table
export const updateTable = async (req, res) => {
  const { id } = req.params;
  const { tableNumber } = req.body;

  try {
    const checkTable = await Table.findOne({
      tableNumber: tableNumber,
      _id: { $ne: id },
    });

    if (checkTable) {
      return res.status(409).json({
        key: "table-already-exists",
        message: "this number table already exists",
      });
    }

    const updatedTable = await Table.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTable) {
      return res.status(404).json({ message: "category not found" });
    }

    res.status(200).json(updatedTable);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete table
export const deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return res.status(404).json({ message: "table not found" });
    }

    res.status(200).json(deletedTable);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
