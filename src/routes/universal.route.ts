import express from "express";
import { addRules, removeRules } from "../controllers/universal.controller";

const router = express.Router();

router.post("/:type", addRules);
router.delete("/:type", removeRules);

export default router;
