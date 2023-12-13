import { Base } from "../model/baseModel.js";

// Create base product
export const createBaseProduct = async (req, res) => {
  const { productName } = req.body;
  try {
    const regexName = new RegExp(productName, "i");
    const checkProduct = await Base.findOne({
      productName: { $regex: regexName },
    });

    if (checkProduct) {
      return res.status(409).json({
        key: "product-already-exists",
        message: "product already exists",
      });
    }

    const newProduct = new Base(req.body);
    await newProduct.save();

    const productsCount = await Base.countDocuments();
    const lastPage = Math.ceil(productsCount / 10);

    res.status(201).json({ product: newProduct, lastPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get base products
export const getBaseProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  try {
    const productsCount = await Base.countDocuments();

    const totalPages = Math.ceil(productsCount / limit);

    const products = await Base.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category");

    res.status(200).json({ products, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

export const getBaseProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.query;
  try {
    const products = await Base.find({ category: categoryId });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

export const getAllBaseProducts = async (req, res) => {
  try {
    const products = await Base.find();

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update base product
export const updateBaseProduct = async (req, res) => {
  const { id } = req.params;
  const { productName } = req.body;

  try {
    const regexName = new RegExp(`^${productName.trim()}$`, "i");
    const checkProduct = await Base.findOne({
      _id: { $ne: id },
      productName: { $regex: regexName },
    });

    console.log(checkProduct);
    console.log(productName);

    if (checkProduct) {
      return res.status(409).json({
        key: "product-already-exists",
        message: "product already exists",
      });
    }

    const updatedProduct = await Base.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Base Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete base product
export const deleteBaseProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Base.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Base product not found" });
    }

    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
