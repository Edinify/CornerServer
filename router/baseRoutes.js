import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createBaseProduct,
  deleteBaseProduct,
  getBaseProducts,
  getBaseProductsByCategoryId,
  updateBaseProduct,
} from "../controllers/baseController.js";

const router = express.Router();

router.post("/", authMiddleware, createBaseProduct);
router.get("/", authMiddleware, getBaseProducts);
router.get("/list", authMiddleware, getBaseProductsByCategoryId);
router.patch("/:id", authMiddleware, updateBaseProduct);
router.delete("/:id", authMiddleware, deleteBaseProduct);

export default router;
