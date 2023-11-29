import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getChartData, getFinance } from "../controllers/financeController.js";

const router = express.Router();

router.get("/result", authMiddleware, getFinance);
router.get("/chart", authMiddleware, getChartData);

export default router;
