import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { ValidationError } from "./validation.middleware";
import { HTTP_STATUS } from "../types/constants";
import { ApiError, ErrorResponse } from "../types/rules";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ValidationError) {
    logger.warn(`Validation failed: ${err.message}`, {
      stack: err.stack,
      details: err.details,
      method: req.method,
      url: req.originalUrl,
      body: req.body,
    });
    const errorResponse: ErrorResponse = {
      error: err.message,
      details: err.details,
    };
    return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse);
  }

  const apiError = err as ApiError;
  const status =
    apiError?.status && Number.isInteger(apiError.status)
      ? apiError.status
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = apiError?.message ?? "Internal Server Error";

  logger.error("Unhandled error", {
    status,
    message,
    stack: apiError?.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  res.status(status).json({ error: message });
}
