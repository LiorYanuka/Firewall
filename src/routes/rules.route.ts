import express, { Request, Response } from "express"
import { getRules, updateRules } from "../controller/rules.controller"

const router = express.Router();

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
router.get('/retrieve', getRules);

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
router.patch('/toggle', updateRules);

export default router;