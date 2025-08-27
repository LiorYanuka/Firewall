import express, { Request, Response } from "express"
import { db } from "../db";
import { ipRules, urlRules, portRules } from "../schema";
import { and, eq, inArray } from "drizzle-orm";

export const getRules = async (req: Request, res: Response) => {
    try {
        const [ipB, ipW, urlB, urlW, portB, portW] = await Promise.all([
            db.select({ id: ipRules.id, ip: ipRules.ip }).from(ipRules).where(eq(ipRules.mode, "blacklist")),
            db.select({ id: ipRules.id, ip: ipRules.ip }).from(ipRules).where(eq(ipRules.mode, "whitelist")),
            db.select({ id: urlRules.id, url: urlRules.url }).from(urlRules).where(eq(urlRules.mode, "blacklist")),
            db.select({ id: urlRules.id, url: urlRules.url }).from(urlRules).where(eq(urlRules.mode, "whitelist")),
            db.select({ id: portRules.id, port: portRules.port }).from(portRules).where(eq(portRules.mode, "blacklist")),
            db.select({ id: portRules.id, port: portRules.port }).from(portRules).where(eq(portRules.mode, "whitelist")),
        ]);

        return res.status(200).json({ ip: { blacklist: ipB, whitelist: ipW }, url: { blacklist: urlB, whitelist: urlW }, port: { blacklist: portB, whitelist: portW } });
    } 
    catch (e) {
        console.error("Retrieve rules failed:", e);
        return res.status(500).json({ error: "Failed to retrieve rules" });
    }
};

export const updateRules = async(req: Request, res: Response) => {
    const { ips, urls, ports } = req.body ?? {};

    try {
        const updatedIPs: { id: number; ip: string; active: boolean }[] = [];
        if (ips?.values?.length) {
            for (const ip of ips.values as string[]) {
                const rows = await db.update(ipRules).set({ active: Boolean(ips.active) }).where(eq(ipRules.ip, ip)).returning({ id: ipRules.id, ip: ipRules.ip, active: ipRules.active });
                if (rows.length) updatedIPs.push(rows[0]);
            }
        }

        const updatedURLs: { id: number; url: string; active: boolean }[] = [];
        if (urls?.values?.length) {
            for (const url of urls.values as string[]) {
                const rows = await db.update(urlRules).set({ active: Boolean(urls.active) }).where(eq(urlRules.url, url)).returning({ id: urlRules.id, url: urlRules.url, active: urlRules.active });
                if (rows.length) updatedURLs.push(rows[0]);
            }
        }

        const updatedPorts: { id: number; port: number; active: boolean }[] = [];
        if (ports?.values?.length) {
            for (const port of ports.values as number[]) {
                const rows = await db.update(portRules).set({ active: Boolean(ports.active) }).where(eq(portRules.port, port)).returning({ id: portRules.id, port: portRules.port, active: portRules.active });
                if (rows.length) updatedPorts.push(rows[0]);
            }
        }

        return res.status(201).json({ updated: [...updatedIPs, ...updatedURLs, ...updatedPorts]});
    } 
    catch (e) {
        console.error("Updates failed:", e);
        return res.status(500).json({ error: "Failed to update rules" });
    }
};

