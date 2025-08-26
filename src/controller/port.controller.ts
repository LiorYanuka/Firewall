import express, { Request, Response } from "express"
import { processRules } from "../services/sqlCommandsService"


export const addPort = async (req: Request, res: Response) => {
    const { values, mode } = req.body ?? {};

    try {
        await processRules(values, "port", mode, "insert");
        res.status(200).json({ message: "Port rules inserted successfully" });
    } 
    catch (e) {
        console.error("Failed to insert port rules:", e);
        res.status(500).json({ error: "Failed to insert port rules" });
    }
};

export const removePort = async(req: Request, res: Response) => {
    const { values, mode } = req.body ?? {};

    try {
        await processRules(values, "port", mode, "delete");
        res.status(200).json({ message: "Port rules deleted successfully" });
    } 
    catch (e) {
        console.error("Failed to delete port rules:", e);
        res.status(500).json({ error: "Failed to delete port rules" });
    }
};

