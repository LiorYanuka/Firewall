"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logging_service_1 = require("../services/logging.service");
const validation_middleware_1 = require("./validation.middleware");
const constants_1 = require("../types/constants");
function errorHandler(err, req, res, _next) {
    if (err instanceof validation_middleware_1.ValidationError) {
        const errorResponse = {
            error: err.message,
            details: err.details,
        };
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json(errorResponse);
    }
    const apiError = err;
    const status = apiError?.status && Number.isInteger(apiError.status)
        ? apiError.status
        : constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = apiError?.message ?? "Internal Server Error";
    logging_service_1.loggingService.appError({
        error: message,
        method: req.method,
        url: req.originalUrl,
    });
    res.status(status).json({ error: message });
}
