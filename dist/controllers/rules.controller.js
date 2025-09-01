"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRules = exports.getRules = void 0;
const rules_service_1 = require("../services/rules.service");
const constants_1 = require("../types/constants");
const getRules = async (_req, res) => {
    const rules = await (0, rules_service_1.getAllRules)();
    res.status(constants_1.HTTP_STATUS.OK).json(rules);
};
exports.getRules = getRules;
const updateRules = async (req, res) => {
    const { ips, urls, ports } = req.body ?? {};
    const updates = {
        ip: ips,
        url: urls,
        port: ports,
    };
    const updated = [];
    for (const type of Object.keys(updates)) {
        const data = updates[type];
        if (!data?.values?.length)
            continue;
        const rows = await (0, rules_service_1.updateRuleActiveStatus)(type, data.values, Boolean(data.active));
        updated.push(...rows);
    }
    res.status(constants_1.HTTP_STATUS.CREATED).json({ updated });
};
exports.updateRules = updateRules;
