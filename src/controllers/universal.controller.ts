import { Request, Response } from "express";
import { processRules } from "../services/universal.service";
import {
  RuleType,
  ModeType,
  ActionType,
  RuleRequestBody,
  RuleResponse,
  ErrorResponse,
  ApiError,
} from "../types/rules";
import logger from "../config/logger";
import { ValidationError } from "../middleware/validation.middleware";
import { HTTP_STATUS } from "../types/constants";

const isRuleType = (t: string): t is RuleType =>
  t === "ip" || t === "url" || t === "port";

const handle = (action: ActionType) => async (req: Request, res: Response) => {
  const { type } = req.params as { type: string };
  const { values, mode } = (req.body ?? {}) as RuleRequestBody;

  if (!isRuleType(type)) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: "Invalid type. Use 'ip' | 'url' | 'port'." });
  }

  try {
    await processRules(values, type, mode, action);
    logger.info(`${type.toUpperCase()} rules ${action} completed`, {
      valuesCount: values?.length ?? 0,
      mode,
    });

    const verb = action === "insert" ? "inserted" : "deleted";
    const response: RuleResponse = {
      message: `${type.toUpperCase()} rules ${verb} successfully`,
    };
    res.status(HTTP_STATUS.OK).json(response);
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      logger.warn(`Validation failed for ${type} ${action}: ${e.message}`, {
        details: e.details,
      });
      const errorResponse: ErrorResponse = {
        error: e.message,
        details: e.details ?? undefined,
      };
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse);
    }
    const errMsg = action === "insert" ? "insert" : "delete";
    const error = e as ApiError;
    logger.error(`Failed to ${errMsg} ${type} rules:`, {
      error: error?.message ?? String(e),
    });
    const errorResponse: ErrorResponse = {
      error: `Failed to ${errMsg} ${type} rules`,
    };
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};

export const addRules = handle("insert");
export const removeRules = handle("delete");
