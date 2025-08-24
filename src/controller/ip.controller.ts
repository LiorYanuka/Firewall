import express, { Request, Response } from "express"
import { query } from "../db";


// 1. Create new ip in whitelist
export const addIP = (req: Request, res: Response) => {
    res.send("Add IP wl");
};

// 1. Remove ip from whitelist
export const removeIP = (req: Request, res: Response) => {
    res.send("Remove IP wl");
};

// request - {'values': ['1.1.1.1', '2.2.2.2'], 'mode': 'blacklist'}
// response - {'type': 'ip', 'mode': 'blacklist', 'values': ['1.1.1.1', '2.2.2.2'], 'status': 'success'}