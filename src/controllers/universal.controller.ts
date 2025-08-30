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

  await processRules(values, type, mode, action);

  const verb = action === "insert" ? "inserted" : "deleted";
  const response: RuleResponse = {
    message: `${type.toUpperCase()} rules ${verb} successfully`,
  };

  res.status(HTTP_STATUS.OK).json(response);
};

export const addRules = handle("insert");
export const removeRules = handle("delete");
