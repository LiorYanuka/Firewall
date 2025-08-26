import express, { Request, Response } from "express"
import { query } from "../db";
import { validateRules } from "../services/validationService"
import { insertRules } from "../services/sqlCommandsService"


export const addPort = async (req: Request, res: Response) => {
    const { values, mode } = req.body ?? {};

    try {
        await insertRules(values, "port", mode);
        res.status(200).json({ message: "Port rules added successfully" });
    } 
    catch (e) {
        console.error("Failed to insert port rules:", e);
        res.status(500).json({ error: "Failed to insert port rules" });
    }
};


export const removePort = async(req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};
        const cleaned = validateRules(req.body, "port");

        try {
            for (const port of cleaned) {
                await query("DELETE FROM port_rules WHERE port = $1 AND mode = $2",[port, mode]
            );}
            console.log("Port Deleted");
        } 
        catch (e) {
            console.error("Port Delete failed:", e);
        }
    
        return res.status(201).json({ type: "port", mode, values: cleaned, status: "success" });
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};

