import express, { Request, Response } from "express";
import {
  addPort,
  removePort,
} from "../../controllers/seperate/port.controller";

const router = express.Router();

router.post("/add", addPort);
router.delete("/remove", removePort);

export default router;
