"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ip_controller_1 = require("../../controllers/seperate/ip.controller");
const router = express_1.default.Router();
router.post("/add", ip_controller_1.addIP);
router.delete("/remove", ip_controller_1.removeIP);
exports.default = router;
