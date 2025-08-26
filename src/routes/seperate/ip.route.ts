import express, { Request, Response } from "express"
import { addIP, removeIP } from "../../controllers/seperate/ip.controller"

const router = express.Router();

router.post('/add', addIP);
router.delete('/remove', removeIP);

export default router;