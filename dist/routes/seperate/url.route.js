"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_controller_1 = require("../../controllers/seperate/url.controller");
const router = express_1.default.Router();
router.post("/add", url_controller_1.addURL);
router.delete("/remove", url_controller_1.removeURL);
exports.default = router;
