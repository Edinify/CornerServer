import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createMenuProduct,
  createMenuSet,
  deleteMenuProduct,
  deleteMenuSet,
  getMenuProducts,
  getMenuProductsForUser,
  getMenuSets,
  getMenuSetsForUser,
  updateMenuProduct,
  updateMenuSet,
} from "../controllers/menuController.js";

const router = express.Router();

router.post("/", authMiddleware, createMenuProduct);
router.get("/", authMiddleware, getMenuProducts);
router.get("/all", getMenuProductsForUser);
router.patch("/:id", authMiddleware, updateMenuProduct);
router.delete("/:id", authMiddleware, deleteMenuProduct);

router.post("/set", authMiddleware, createMenuSet);
router.get("/set", authMiddleware, getMenuSets);
router.get("/set/all", getMenuSetsForUser);
router.patch("/set/:id", authMiddleware, updateMenuSet);
router.delete("/set/:id", authMiddleware, deleteMenuSet);

export default router;
