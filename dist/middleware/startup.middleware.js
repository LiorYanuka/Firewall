"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggingMiddleware = requestLoggingMiddleware;
exports.setupServer = setupServer;
const env_1 = require("../config/env");
const logging_service_1 = require("../services/logging.service");
const db_1 = require("../db");
function requestLoggingMiddleware(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logging_service_1.loggingService.request({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
        });
    });
    next();
}
async function setupServer(app, options = {}) {
    const { port = env_1.config.port, env = env_1.config.env, enableRequestLogging = true, } = options;
    try {
        // Connect to database
        await db_1.database.connectWithRetry();
        // Start server
        app.listen(port, () => {
            logging_service_1.loggingService.serverStart(port, env);
        });
    }
    catch (error) {
        logging_service_1.loggingService.error("Failed to start server", { error: String(error) });
        process.exit(1);
    }
}
