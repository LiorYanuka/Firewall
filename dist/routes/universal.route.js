"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const universal_controller_1 = require("../controllers/universal.controller");
const router = express_1.default.Router();
router.post("/:type", universal_controller_1.addRules);
router.delete("/:type", universal_controller_1.removeRules);
exports.default = router;
