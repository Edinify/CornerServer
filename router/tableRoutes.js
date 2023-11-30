import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createTable,
  deleteTable,
  getTables,
  getTablesForUser,
  updateTable,
} from "../controllers/tableController.js";

const router = express.Router();

router.post("/", authMiddleware, createTable);
router.get("/", authMiddleware, getTables);
router.get("/all", getTablesForUser);
router.patch("/:id", authMiddleware, updateTable);
router.delete("/:id", authMiddleware, deleteTable);

export default router;
