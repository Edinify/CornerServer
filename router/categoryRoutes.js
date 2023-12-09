import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesProduct,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.get("/", authMiddleware, getCategories);
router.get("/product", authMiddleware, getCategoriesProduct);
router.patch("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
