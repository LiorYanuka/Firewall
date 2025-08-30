import { Request, Response, NextFunction } from "express";
import { loggingService } from "../services/logging.service";
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

  loggingService.appError({
    error: message,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(status).json({ error: message });
}
