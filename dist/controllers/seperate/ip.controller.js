"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeIP = exports.addIP = void 0;
const universal_service_1 = require("../../services/universal.service");
const addIP = async (req, res) => {
    const { values, mode } = req.body ?? {};
    try {
        await (0, universal_service_1.processRules)(values, "ip", mode, "insert");
        res.status(200).json({ message: "IP rules inserted successfully" });
    }
    catch (e) {
        console.error("Failed to insert IP rules:", e);
        res.status(500).json({ error: "Failed to insert IP rules" });
    }
};
exports.addIP = addIP;
const removeIP = async (req, res) => {
    const { values, mode } = req.body ?? {};
    try {
        await (0, universal_service_1.processRules)(values, "ip", mode, "delete");
        res.status(200).json({ message: "IP rules deleted successfully" });
    }
    catch (e) {
        console.error("Failed to insert IP rules:", e);
        res.status(500).json({ error: "Failed to delete IP rules" });
    }
};
exports.removeIP = removeIP;
