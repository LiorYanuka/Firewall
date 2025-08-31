import { validateRules } from "../middleware/validation.middleware";
import { RuleType, ActionType, ModeType } from "../types/rules";
import { database } from "../db";
import { ipRules } from "../schemas/ip.schema";
import { urlRules } from "../schemas/url.schema";
import { portRules } from "../schemas/port.schema";
import { and, eq, inArray } from "drizzle-orm";

const db = database.db;

type Handler = {
  insert: (values: unknown[], mode: ModeType) => Promise<void>;
  remove: (values: unknown[], mode: ModeType) => Promise<void>;
};

const handlers: Record<RuleType, Handler> = {
  ip: {
    insert: async (values, mode) => {
      const ipValues = values as string[];
      await db
        .insert(ipRules)
        .values(ipValues.map((ip) => ({ ip, mode })))
        .onConflictDoNothing({ target: [ipRules.ip] });
    },
    remove: async (values, mode) => {
      const ipValues = values as string[];
      await db
        .delete(ipRules)
        .where(and(inArray(ipRules.ip, ipValues), eq(ipRules.mode, mode)));
    },
  },
  url: {
    insert: async (values, mode) => {
      const urlValues = values as string[];
      await db
        .insert(urlRules)
        .values(urlValues.map((url) => ({ url, mode })))
        .onConflictDoNothing({ target: [urlRules.url] });
    },
    remove: async (values, mode) => {
      const urlValues = values as string[];
      await db
        .delete(urlRules)
        .where(and(inArray(urlRules.url, urlValues), eq(urlRules.mode, mode)));
    },
  },
  port: {
    insert: async (values, mode) => {
      const portValues = values as number[];
      await db
        .insert(portRules)
        .values(portValues.map((port) => ({ port, mode })))
        .onConflictDoNothing({ target: [portRules.port] });
    },
    remove: async (values, mode) => {
      const portValues = values as number[];
      await db
        .delete(portRules)
        .where(
          and(inArray(portRules.port, portValues), eq(portRules.mode, mode))
        );
    },
  },
};

export const processRules = async (
  data: unknown,
  rule: RuleType,
  mode: ModeType,
  action: ActionType
) => {
  const cleaned = validateRules({ values: data, mode }, rule);
  const handler = handlers[rule];

  if (action === "insert") {
    await handler.insert(cleaned, mode);
  } else {
    await handler.remove(cleaned, mode);
  }
};
