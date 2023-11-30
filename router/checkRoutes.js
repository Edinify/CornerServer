import express from "express";
import {
  createCheck,
  getChecks,
  updateCheck,
} from "../controllers/checkController.js";

const router = express.Router();

router.post("/", createCheck);
router.post("/", getChecks);
router.patch("/:id", updateCheck);

export default router;
