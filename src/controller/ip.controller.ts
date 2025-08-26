import express, { Request, Response } from "express"
import { query } from "../db";
import { validateRules } from "../services/validationService"
import { insertRules } from "../services/sqlCommandsService"


export const addIP = async (req: Request, res: Response) => {
    const { values, mode } = req.body ?? {};

    try {
        await insertRules(values, "ip", mode);
        res.status(200).json({ message: "IP rules added successfully" });
    } 
    catch (e) {
        console.error("Failed to insert IP rules:", e);
        res.status(500).json({ error: "Failed to insert IP rules" });
    }
};

export const removeIP = async(req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};
        const cleaned = validateRules(req.body, "ip");

        try {
            for (const ip of cleaned) {
                await query("DELETE FROM ip_rules WHERE ip = $1::inet AND mode = $2",[ip, mode]
            );}
            console.log("IP Deleted");
        } 
        catch (e) {
            console.error("IP Delete failed:", e);
        }
    
        return res.status(201).json({ type: "ip", mode, values: cleaned, status: "success" });
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};

