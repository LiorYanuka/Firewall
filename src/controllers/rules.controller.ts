import { Request, Response } from "express";
import { getAllRules, updateRuleActiveStatus } from "../services/rules.service";
import { RuleType, UpdatedRule, ErrorResponse } from "../types/rules";
import { HTTP_STATUS } from "../types/constants";
import { loggingService } from "../services/logging.service";

export const getRules = async (_req: Request, res: Response) => {
  const rules = await getAllRules();
  res.status(HTTP_STATUS.OK).json(rules);
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
};
