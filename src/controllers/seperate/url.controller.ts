// This code is here in case of refactoring

import express, { Request, Response } from "express"
import { processRules } from "../../services/sqlCommandsService"


export const addURL = async (req: Request, res: Response) => {
    const { values, mode } = req.body ?? {};

    try {
        await processRules(values, "url", mode, "insert");
        res.status(200).json({ message: "URL rules inserted successfully" });
    } 
    catch (e) {
        console.error("Failed to insert URL rules:", e);
        res.status(500).json({ error: "Failed to insert URL rules" });
    }
};

export const removeURL = async(req: Request, res: Response) => {
    const { values, mode } = req.body ?? {};

    try {
        await processRules(values, "url", mode, "delete");
        res.status(200).json({ message: "URL rules deleted successfully" });
    } 
    catch (e) {
        console.error("Failed to insert URL rules:", e);
        res.status(500).json({ error: "Failed to delete URL rules" });
    }
};

