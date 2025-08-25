import express, { Request, Response } from "express"
import { addPort, removePort } from "../controller/port.controller"

const router = express.Router();

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
router.post('/add', addPort);

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
router.delete('/remove', removePort);

export default router;