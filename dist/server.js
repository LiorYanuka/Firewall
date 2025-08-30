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
const error_middleware_1 = require("./middleware/error.middleware");
const startup_middleware_1 = require("./middleware/startup.middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(startup_middleware_1.requestLoggingMiddleware);
// Routes
app.get("/", (_req, res) => {
    res.send("Server is running just fine!");
});
// app.use('/api/firewall/ip', ipRoutes);
// app.use('/api/firewall/url', urlRoutes);
// app.use('/api/firewall/port', portRoutes);
app.use("/api/firewall", rules_route_1.default);
app.use("/api/firewall", universal_route_1.default);
// Error handling
app.use(error_middleware_1.errorHandler);
exports.default = app;
