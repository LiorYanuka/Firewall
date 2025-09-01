"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port_controller_1 = require("../../controllers/seperate/port.controller");
const router = express_1.default.Router();
router.post("/add", port_controller_1.addPort);
router.delete("/remove", port_controller_1.removePort);
exports.default = router;
