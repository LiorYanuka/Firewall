"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeURL = exports.addURL = void 0;
const universal_service_1 = require("../../services/universal.service");
const addURL = async (req, res) => {
    const { values, mode } = req.body ?? {};
    try {
        await (0, universal_service_1.processRules)(values, "url", mode, "insert");
        res.status(200).json({ message: "URL rules inserted successfully" });
    }
    catch (e) {
        console.error("Failed to insert URL rules:", e);
        res.status(500).json({ error: "Failed to insert URL rules" });
    }
};
exports.addURL = addURL;
const removeURL = async (req, res) => {
    const { values, mode } = req.body ?? {};
    try {
        await (0, universal_service_1.processRules)(values, "url", mode, "delete");
        res.status(200).json({ message: "URL rules deleted successfully" });
    }
    catch (e) {
        console.error("Failed to insert URL rules:", e);
        res.status(500).json({ error: "Failed to delete URL rules" });
    }
};
exports.removeURL = removeURL;
