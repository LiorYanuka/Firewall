import express, { Request, Response } from "express"
import { query } from "../db";


// 1. Create new ip in whitelist
export const addIP = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};

        // Checking validity
        if (!Array.isArray(values) || !values.length) return res.status(400).json({ error: "`values` must be a non-empty array" });
        if (mode !== "whitelist" && mode !== "blacklist") return res.status(400).json({ error: "`mode` must be 'whitelist' or 'blacklist'" });

        const cleaned = values.filter(v => typeof v === "string").map(v => v.trim()).filter(Boolean); // Filter strings, trim whitespaces, remove empty
        if (!Array.isArray(cleaned) || !cleaned.length) return res.status(400).json({ error: "Cleaned array is empty" });

        try {
            for (const ip of cleaned) {
                await query("INSERT INTO ip_rules (ip, mode) VALUES ($1::inet, $2) ON CONFLICT (ip, mode) DO NOTHING",[ip, mode]
            );}
            console.log("Inserted");
        } 
        catch (e) {
            console.error("Insert failed:", e);
        }
    
        return res.status(201).json({ type: "ip", mode, values: cleaned, status: "success" });
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// 1. Remove ip from whitelist
export const removeIP = async(req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};

        // Checking validity
        if (!Array.isArray(values) || !values.length) return res.status(400).json({ error: "`values` must be a non-empty array" });
        if (mode !== "whitelist" && mode !== "blacklist") return res.status(400).json({ error: "`mode` must be 'whitelist' or 'blacklist'" });

        const cleaned = values.filter(v => typeof v === "string").map(v => v.trim()).filter(Boolean); // Filter strings, trim whitespaces, remove empty
        if (!Array.isArray(cleaned) || !cleaned.length) return res.status(400).json({ error: "Cleaned array is empty" });

        try {
            for (const ip of cleaned) {
                await query("DELETE FROM ip_rules WHERE ip = $1::inet AND mode = $2",[ip, mode]
            );}
            console.log("Deleted");
        } 
        catch (e) {
            console.error("Delete failed:", e);
        }
    
        return res.status(201).json({ type: "ip", mode, values: cleaned, status: "success" });
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};

