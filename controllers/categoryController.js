import { Category } from "../model/categoryModel.js";

// Create category
export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const regexName = new RegExp(name, "i");

    const checkCategory = await Category.findOne({
      name: { $regex: regexName },
    });

    if (checkCategory) {
      return res.status(409).json({
        key: "category-already-exists",
        message: "category already exists",
      });
    }

    const newCategory = new Category(req.body);
    await newCategory.save();

    const categoriesCount = await Category.countDocuments();
    const lastPage = Math.ceil(categoriesCount / 10);

    res.status(201).json({ category: newCategory, lastPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const categoriesCount = await Category.countDocuments();

    const totalPages = Math.ceil(categoriesCount / limit);

    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ categories, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};


// Get categories
export const getCategoriesProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const categoriesCount = await Category.countDocuments();

    const categories = await Category.find()

    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const regexName = new RegExp(name, "i");

    const checkCategory = await Category.findOne({
      name: { $regex: regexName },
      _id: { $ne: id },
    });

    if (checkCategory) {
      return res.status(409).json({
        key: "category-already-exists",
        message: "category already exists",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "category not found" });
    }

    res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};


