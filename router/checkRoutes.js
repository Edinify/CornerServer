import express from "express";
import {
  createCheck,
  getCheck,
  getChecks,
  updateCheck,
} from "../controllers/checkController.js";

const router = express.Router();

router.post("/", createCheck);
router.get("/", getChecks);
router.get("/:id", getCheck);
router.patch("/:id", updateCheck);

export default router;
