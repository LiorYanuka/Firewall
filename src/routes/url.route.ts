import express, { Request, Response } from "express"
import { addURL, removeURL } from "../controller/url.controller"

const router = express.Router();

router.post('/add', addURL);
router.delete('/remove', removeURL);

export default router;