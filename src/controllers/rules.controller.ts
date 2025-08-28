import { Request, Response } from "express";
import { getAllRules, updateRuleActiveStatus } from "../services/rules.service";
import { RuleType, UpdatedRule, ErrorResponse } from "../types/rules";
import { HTTP_STATUS } from "../types/constants";

export const getRules = async (_req: Request, res: Response) => {
  try {
    const rules = await getAllRules();
    res.status(HTTP_STATUS.OK).json(rules);
  } catch (err) {
    const errorResponse: ErrorResponse = { error: "Failed to fetch rules" };
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};

export const updateRules = async (req: Request, res: Response) => {
  const { ips, urls, ports } = req.body ?? {};
  const updates: Record<
    string,
    { values: (string | number)[]; active: boolean }
  > = {
    ip: ips,
    url: urls,
    port: ports,
  };

  try {
    const updated: UpdatedRule[] = [];

    for (const type of Object.keys(updates) as RuleType[]) {
      const data = updates[type];
      if (!data?.values?.length) continue;

      const rows = await updateRuleActiveStatus(
        type,
        data.values,
        Boolean(data.active)
      );
      updated.push(...rows);
    }

    res.status(HTTP_STATUS.CREATED).json({ updated });
  } catch (err) {
    const errorResponse: ErrorResponse = { error: "Failed to update rules" };
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};
