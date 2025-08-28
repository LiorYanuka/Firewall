import { Request, Response } from "express";
import { processRules } from "../services/sqlCommandsService";
import { RuleType, ModeType, ActionType } from "../types/rules";
import logger from "../config/logger";
import { ValidationError } from "../middleware/validationMiddleware";


const isRuleType = (t: string): t is RuleType => t === "ip" || t === "url" || t === "port";

const handle = (action: ActionType) => async (req: Request, res: Response) => {
    const { type } = req.params as { type: string };
    const { values, mode } = (req.body ?? {}) as { values: unknown[]; mode: ModeType };

    if (!isRuleType(type)) {
        return res.status(400).json({ error: "Invalid type. Use 'ip' | 'url' | 'port'." });
    }

    try {
        await processRules(values, type, mode, action);
        const verb = action === "insert" ? "inserted" : "deleted";
        res.status(200).json({ message: `${type.toUpperCase()} rules ${verb} successfully` });
    } catch (e: any) {
        if (e instanceof ValidationError) {
            logger.warn(`Validation failed for ${type} ${action}: ${e.message}`, { details: e.details });
            return res.status(400).json({ error: e.message, details: e.details ?? undefined })
        }
        const errMsg = action === "insert" ? "insert" : "delete";
        logger.error(`Failed to ${errMsg} ${type} rules:`, { error: e?.message ?? String(e) });
        res.status(500).json({ error: `Failed to ${errMsg} ${type} rules` });
    }
};

export const addRules = handle("insert");
export const removeRules = handle("delete");