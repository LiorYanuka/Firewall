import express, { Request, Response } from "express"
import { addIP, removeIP } from "../controller/ip.controller"

const router = express.Router();

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
// 4. Add to whitelist
router.post('/add', addIP);

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
// 4. Remove from whitelist
router.delete('/remove', removeIP);

export default router;