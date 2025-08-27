import { validateRules } from "../middleware/validationMiddleware";
import { RuleType, ActionType, ModeType } from "../types/rules";
import { db } from "../db";
import { ipRules, urlRules, portRules } from "../schema";
import { and, eq, inArray } from "drizzle-orm";

export const processRules = async (
	data: any,
	rule: RuleType,
	mode: ModeType,
	action: ActionType
) => {
	const cleaned = validateRules({ values: data, mode }, rule);

	if (rule === "ip") {
		const ips = cleaned as string[];
		if (action === "insert") {
			await db.insert(ipRules).values(ips.map((ip) => ({ ip, mode }))).onConflictDoNothing({ target: [ipRules.ip, ipRules.mode] });
		} else {
			await db.delete(ipRules).where(and(inArray(ipRules.ip, ips), eq(ipRules.mode, mode)));
		}
	}

	if (rule === "url") {
		const urls = cleaned as string[];
		if (action === "insert") {
			await db.insert(urlRules).values(urls.map((url) => ({ url, mode }))).onConflictDoNothing({ target: [urlRules.url, urlRules.mode] });
		} else {
			await db.delete(urlRules).where(and(inArray(urlRules.url, urls), eq(urlRules.mode, mode)));
		}
	}

	if (rule === "port") {
		const ports = cleaned as number[];
		if (action === "insert") {
			await db.insert(portRules).values(ports.map((port) => ({ port, mode }))).onConflictDoNothing({ target: [portRules.port, portRules.mode] });
		} else {
			await db.delete(portRules).where(and(inArray(portRules.port, ports), eq(portRules.mode, mode)));
		}
	}

	console.log(`${rule.toUpperCase()} ${action.toUpperCase()} completed for ${cleaned.length} item(s).`);
};