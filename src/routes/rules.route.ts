import express, { Request, Response } from "express";
import { getRules, updateRules } from "../controllers/rules.controller";

const router = express.Router();

router.get("/rules", getRules);
router.patch("/rules", updateRules);

export default router;
