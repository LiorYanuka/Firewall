import express, { Request, Response } from "express"
import { addPort, removePort } from "../controller/port.controller"

const router = express.Router();

router.post('/add', addPort);
router.delete('/remove', removePort);

export default router;