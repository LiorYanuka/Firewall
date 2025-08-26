import express, { Request, Response } from "express"
import { query } from "../db";
import { validateRules } from "../services/validationService"
import { insertRules } from "../services/sqlCommandsService"


export const addURL = async (req: Request, res: Response) => {
    const { values, mode } = req.body ?? {};

    try {
        await insertRules(values, "url", mode);
        res.status(200).json({ message: "URL rules added successfully" });
    } 
    catch (e) {
        console.error("Failed to insert URL rules:", e);
        res.status(500).json({ error: "Failed to insert URL rules" });
    }
};

export const removeURL = async(req: Request, res: Response) => {
    try {
        const { values, mode } = req.body ?? {};
        const cleaned = validateRules(req.body, "url");

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

