import { Menu } from "../model/menuModel.js";
import { Set } from "../model/setModel.js";

// Create menu product
export const createMenuProduct = async (req, res) => {
  try {
    const newProduct = new Menu(req.body);
    await newProduct.save();
    await newProduct.populate("product");

    const productsCount = await Menu.countDocuments();
    const lastPage = Math.ceil(productsCount / 10);

    res.status(201).json({ product: newProduct, lastPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get menu products
export const getMenuProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const productsCount = await Menu.countDocuments();

    const totalPages = Math.ceil(productsCount / limit);

    const products = await Menu.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("product");

    res.status(200).json({ products, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get menu products for user
export const getMenuProductsForUser = async (req, res) => {
  try {
    const products = await Menu.find().populate("product");

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update menu product
export const updateMenuProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Menu.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("product");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Base Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete menu product
export const deleteMenuProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Menu.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Base product not found" });
    }

    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// PRODUCTS SET FUNCTIONS
// Create menu set
export const createMenuSet = async (req, res) => {
  try {
    const newSet = new Set(req.body);
    await newSet.save();
    await newSet.populate("products.product");

    const setsCount = await Set.countDocuments();
    const lastPage = Math.ceil(setsCount / 10);

    res.status(201).json({ set: newSet, lastPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get menu sets
export const getMenuSets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const setsCount = await Set.countDocuments();

    const totalPages = Math.ceil(setsCount / limit);

    const sets = await Set.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("products.product");

    res.status(200).json({ sets, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get menu sets for user
export const getMenuSetsForUser = async (req, res) => {
  try {
    const sets = await Set.find().populate("products.product");

    res.status(200).json(sets);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update menu set
export const updateMenuSet = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedSet = await Set.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("products.product");

    if (!updatedSet) {
      return res.status(404).json({ message: "Set not found" });
    }

    res.status(200).json(updatedSet);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete menu set
export const deleteMenuSet = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSet = await Set.findByIdAndDelete(id);

    if (!deletedSet) {
      return res.status(404).json({ message: "Set not found" });
    }

    res.status(200).json(deletedSet);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
