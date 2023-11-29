import express from "express";
import { loginUser } from "../controllers/authController.js";
import {
  createAccessCode,
  getAccessCode,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/code", authMiddleware, createAccessCode);
router.get("/code", authMiddleware, getAccessCode);

export default router;
