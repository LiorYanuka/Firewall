import express from "express";
import { addRules, removeRules } from "../controllers/universal.controller";

const router = express.Router();

router.post("/:type/add", addRules);
router.delete("/:type/remove", removeRules);

export default router;