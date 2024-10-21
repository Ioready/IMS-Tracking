import express from "express";
import { getDashboard } from "../controllers/mainController.js";

const router = express.Router();

router.post("/dashboard", getDashboard);

export default router;
