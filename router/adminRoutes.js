import express from "express";
import { getAdmin } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getAdmin);

export default router;
