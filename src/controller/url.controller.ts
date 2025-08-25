import express, { Request, Response } from "express"
import { query } from "../db";


export const addURL = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};

        // Checking validity
        if (!Array.isArray(values) || !values.length) return res.status(400).json({ error: "`values` must be a non-empty array" });
        if (mode !== "whitelist" && mode !== "blacklist") return res.status(400).json({ error: "`mode` must be 'whitelist' or 'blacklist'" });

        const cleaned = values.filter(v => typeof v === "string").map(v => v.trim().toLowerCase()).filter(Boolean); // Filter strings, trim whitespaces, remove empty
        if (!Array.isArray(cleaned) || !cleaned.length) return res.status(400).json({ error: "Cleaned array is empty" });

        try {
            for (const url of cleaned) {
                await query("INSERT INTO url_rules (url, mode) VALUES ($1, $2) ON CONFLICT (url, mode) DO NOTHING",[url, mode]
            );}
            console.log("URL Inserted");
        } 
        catch (e) {
            console.error("URL Insert failed:", e);
        }
    
        return res.status(201).json({ type: "url", mode, values: cleaned, status: "success" });
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const removeURL = async(req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};

        // Checking validity
        if (!Array.isArray(values) || !values.length) return res.status(400).json({ error: "`values` must be a non-empty array" });
        if (mode !== "whitelist" && mode !== "blacklist") return res.status(400).json({ error: "`mode` must be 'whitelist' or 'blacklist'" });

        const cleaned = values.filter(v => typeof v === "string").map(v => v.trim().toLowerCase()).filter(Boolean); // Filter strings, trim whitespaces, remove empty
        if (!Array.isArray(cleaned) || !cleaned.length) return res.status(400).json({ error: "Cleaned array is empty" });

        try {
            for (const url of cleaned) {
                await query("DELETE FROM url_rules WHERE url = $1 AND mode = $2",[url, mode]
            );}
            console.log("URL Deleted");
        } 
        catch (e) {
            console.error("URL Delete failed:", e);
        }
    
        return res.status(201).json({ type: "url", mode, values: cleaned, status: "success" });
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};

