"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePort = exports.addPort = void 0;
const universal_service_1 = require("../../services/universal.service");
const addPort = async (req, res) => {
    const { values, mode } = req.body ?? {};
    try {
        await (0, universal_service_1.processRules)(values, "port", mode, "insert");
        res.status(200).json({ message: "Port rules inserted successfully" });
    }
    catch (e) {
        console.error("Failed to insert port rules:", e);
        res.status(500).json({ error: "Failed to insert port rules" });
    }
};
exports.addPort = addPort;
const removePort = async (req, res) => {
    const { values, mode } = req.body ?? {};
    try {
        await (0, universal_service_1.processRules)(values, "port", mode, "delete");
        res.status(200).json({ message: "Port rules deleted successfully" });
    }
    catch (e) {
        console.error("Failed to delete port rules:", e);
        res.status(500).json({ error: "Failed to delete port rules" });
    }
};
exports.removePort = removePort;
