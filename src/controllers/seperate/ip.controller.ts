import express, { Request, Response } from "express";
import { processRules } from "../../services/universal.service";

export const addIP = async (req: Request, res: Response) => {
  const { values, mode } = req.body ?? {};

  try {
    await processRules(values, "ip", mode, "insert");
    res.status(200).json({ message: "IP rules inserted successfully" });
  } catch (e) {
    console.error("Failed to insert IP rules:", e);
    res.status(500).json({ error: "Failed to insert IP rules" });
  }
};

export const removeIP = async (req: Request, res: Response) => {
  const { values, mode } = req.body ?? {};

  try {
    await processRules(values, "ip", mode, "delete");
    res.status(200).json({ message: "IP rules deleted successfully" });
  } catch (e) {
    console.error("Failed to insert IP rules:", e);
    res.status(500).json({ error: "Failed to delete IP rules" });
  }
};
