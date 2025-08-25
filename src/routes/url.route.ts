import express, { Request, Response } from "express"
import { addURL, removeURL } from "../controller/url.controller"

const router = express.Router();

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
router.post('/add', addURL);

// 1. Validate input
// 2. Fetch existing ip in whitelist
// 3. Check if ip exists in whitelist
router.delete('/remove', removeURL);

export default router;