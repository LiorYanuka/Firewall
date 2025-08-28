"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import ipRoutes from "./routes/seperate/ip.route"
// import urlRoutes from "./routes/seperate/url.route"
// import portRoutes from "./routes/seperate/port.route"
const rules_route_1 = __importDefault(require("./routes/rules.route"));
const universal_route_1 = __importDefault(require("./routes/universal.route"));
const logger_1 = __importDefault(require("./config/logger"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server is running just fine!");
});
// app.use('/api/firewall/ip', ipRoutes);
// app.use('/api/firewall/url', urlRoutes);
// app.use('/api/firewall/port', portRoutes);
app.use('/api/firewall', rules_route_1.default);
app.use('/api/firewall', universal_route_1.default);
app.use((err, req, res, _next) => {
    const status = err?.status && Number.isInteger(err.status) ? err.status : 500;
    const message = err?.message ?? "Internal Server Error";
    logger_1.default.error("Unhandled error", { status, message, stack: err?.stack });
    res.status(status).json({ error: message });
});
exports.default = app;
