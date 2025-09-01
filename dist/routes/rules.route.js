"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rules_controller_1 = require("../controllers/rules.controller");
const router = express_1.default.Router();
router.get("/rules", rules_controller_1.getRules);
router.patch("/rules", rules_controller_1.updateRules);
exports.default = router;
