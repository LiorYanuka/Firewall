"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRules = exports.addRules = void 0;
const universal_service_1 = require("../services/universal.service");
const constants_1 = require("../types/constants");
const isRuleType = (t) => t === "ip" || t === "url" || t === "port";
const handle = (action) => async (req, res) => {
    const { type } = req.params;
    const { values, mode } = (req.body ?? {});
    if (!isRuleType(type)) {
        return res
            .status(constants_1.HTTP_STATUS.BAD_REQUEST)
            .json({ error: "Invalid type. Use 'ip' | 'url' | 'port'." });
    }
    await (0, universal_service_1.processRules)(values, type, mode, action);
    const verb = action === "insert" ? "inserted" : "deleted";
    const response = {
        message: `${type.toUpperCase()} rules ${verb} successfully`,
    };
    res.status(constants_1.HTTP_STATUS.OK).json(response);
};
exports.addRules = handle("insert");
exports.removeRules = handle("delete");
