import express, { Request, Response } from "express"
import { getRules, updateRules } from "../controller/rules.controller"

const router = express.Router();

router.get('/retrieve', getRules);
router.patch('/toggle', updateRules);

export default router;