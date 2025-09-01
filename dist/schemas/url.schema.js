"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRules = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.urlRules = (0, pg_core_1.pgTable)("url_rules", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    url: (0, pg_core_1.text)("url").notNull(),
    mode: (0, pg_core_1.text)("mode").notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("success"),
    active: (0, pg_core_1.boolean)("active").notNull().default(true),
}, (t) => ({
    uq: (0, pg_core_1.unique)().on(t.url),
}));
