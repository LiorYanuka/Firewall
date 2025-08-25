import express, { Request, Response } from "express"
import { query } from "../db";


export const addPort = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};

        // Checking validity
        if (!Array.isArray(values) || !values.length) return res.status(400).json({ error: "`values` must be a non-empty array" });
        if (mode !== "whitelist" && mode !== "blacklist") return res.status(400).json({ error: "`mode` must be 'whitelist' or 'blacklist'" });

        const cleaned = values.filter(v => typeof v === "number"); // Filter numbers
        if (!Array.isArray(cleaned) || !cleaned.length) return res.status(400).json({ error: "Cleaned array is empty" });

        try {
            for (const port of cleaned) {
                await query("INSERT INTO port_rules (port, mode) VALUES ($1, $2) ON CONFLICT (port, mode) DO NOTHING",[port, mode]
            );}
            console.log("Port Inserted");
        } 
        catch (e) {
            console.error("Port Insert failed:", e);
        }
    
        return res.status(201).json({ type: "port", mode, values: cleaned, status: "success" });
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const removePort = async(req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};

        // Checking validity
        if (!Array.isArray(values) || !values.length) return res.status(400).json({ error: "`values` must be a non-empty array" });
        if (mode !== "whitelist" && mode !== "blacklist") return res.status(400).json({ error: "`mode` must be 'whitelist' or 'blacklist'" });

        const cleaned = values.filter(v => typeof v === "number"); // Filter numbers
        if (!Array.isArray(cleaned) || !cleaned.length) return res.status(400).json({ error: "Cleaned array is empty" });

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

