import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createMenuProduct,
  deleteMenuProduct,
  getMenuProducts,
  updateMenuProduct,
} from "../controllers/menuController.js";

const router = express.Router();

router.post("/", authMiddleware, createMenuProduct);
router.get("/", authMiddleware, getMenuProducts);
router.patch("/:id", authMiddleware, updateMenuProduct);
router.delete("/:id", authMiddleware, deleteMenuProduct);

export default router;
