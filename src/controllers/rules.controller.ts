import express, { Request, Response } from "express"
import { query } from "../db";


export const getRules = async (req: Request, res: Response) => {
    try {
        try {
            // IP rules
            const ipB = await query("SELECT id, ip FROM ip_rules WHERE mode = 'blacklist'");
            const ipW = await query("SELECT id, ip FROM ip_rules WHERE mode = 'whitelist'");
            console.log("Got IPs");

            // URL rules
            const urlB = await query("SELECT id, url FROM url_rules WHERE mode = 'blacklist'");
            const urlW = await query("SELECT id, url FROM url_rules WHERE mode = 'whitelist'");
            console.log("Got URLs");

            // Port rules
            const portB = await query("SELECT id, port FROM port_rules WHERE mode = 'blacklist'");
            const portW = await query("SELECT id, port FROM port_rules WHERE mode = 'whitelist'");
            console.log("Got Ports");
            
            // JSON
            return res.status(200).json({
                ips: {
                    blacklist: ipB.rows,
                    whitelist: ipW.rows
                },
                urls: {
                    blacklist: urlB.rows,
                    whitelist: urlW.rows
                },
                ports: {
                    blacklist: portB.rows,
                    whitelist: portW.rows
                }
            });
        } 
        catch (e) {
            console.error("Failed retrieving rules:", e);
            return res.status(500).json({ error: "Failed retrieving rules" });
        }
    } 
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const updateRules = async(req: Request, res: Response) => {
    const { ips, urls, ports } = req.body ?? {};

    try {
        const updatedIPs = [];

        if (ips?.values?.length) {
            for (const ip of ips.values) {
                const result = await query(
                    "UPDATE ip_rules SET active = $1 WHERE ip = $2::inet RETURNING id, ip, active",
                    [ips.active, ip]
                );
    
                if (result.rows.length) {
                    updatedIPs.push(result.rows[0]);
                }
            }
            console.log("IP Updated");
        }

        const updatedURLs = [];

        if (urls?.values?.length) {
            for (const url of urls.values) {
                const result = await query(
                    "UPDATE url_rules SET active = $1 WHERE url = $2 RETURNING id, url, active",
                    [urls.active, url]
                );

                if (result.rows.length) {
                    updatedURLs.push(result.rows[0]);
                }
            }
        }
        console.log("URL Updated");

        const updatedPorts = [];

        if (ports?.values?.length) {
            for (const port of ports.values) {
                const result = await query(
                    "UPDATE port_rules SET active = $1 WHERE port = $2 RETURNING id, port, active",
                    [ports.active, port]
                );

                if (result.rows.length) {
                    updatedPorts.push(result.rows[0]);
                }
            }
        }
        console.log("Port Updated");
        
        return res.status(201).json({ updated: [...updatedIPs, ...updatedURLs, ...updatedPorts]});
    } 
    catch (e) {
        console.error("Updates failed:", e);
    }
};

