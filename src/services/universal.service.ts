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
      await db
        .insert(ipRules)
        .values((values as string[]).map((ip) => ({ ip, mode })))
        .onConflictDoNothing({ target: [ipRules.ip] });
    },
    remove: async (values, mode) => {
      await db
        .delete(ipRules)
        .where(
          and(inArray(ipRules.ip, values as string[]), eq(ipRules.mode, mode))
        );
    },
  },
  url: {
    insert: async (values, mode) => {
      await db
        .insert(urlRules)
        .values((values as string[]).map((url) => ({ url, mode })))
        .onConflictDoNothing({ target: [urlRules.url] });
    },
    remove: async (values, mode) => {
      await db
        .delete(urlRules)
        .where(
          and(
            inArray(urlRules.url, values as string[]),
            eq(urlRules.mode, mode)
          )
        );
    },
  },
  port: {
    insert: async (values, mode) => {
      await db
        .insert(portRules)
        .values((values as number[]).map((port) => ({ port, mode })))
        .onConflictDoNothing({ target: [portRules.port] });
    },
    remove: async (values, mode) => {
      await db
        .delete(portRules)
        .where(
          and(
            inArray(portRules.port, values as number[]),
            eq(portRules.mode, mode)
          )
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

  console.log(
    `${rule.toUpperCase()} ${action.toUpperCase()} completed for ${
      cleaned.length
    } item(s).`
  );
};
