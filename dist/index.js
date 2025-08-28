"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const env_1 = require("./config/env");
require("./config/logger");
server_1.default.listen(env_1.config.port, () => {
    console.log(`Server is running on localhost:${env_1.config.port} in ${env_1.config.env} mode`);
});
