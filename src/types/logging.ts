// Log levels
export type LogLevel = "error" | "warn" | "info" | "debug";

// Log context for structured logging
export interface LogContext {
  [key: string]: unknown;
}

// Request logging context
export interface RequestLogContext extends LogContext {
  method: string;
  url: string;
  status?: number;
  duration?: string;
  userAgent?: string;
  ip?: string;
  contentLength?: string;
}

// Database operation context
export interface DatabaseLogContext extends LogContext {
  operation: "connect" | "query" | "insert" | "update" | "delete" | "select";
  table?: string;
  attempt?: number;
  count?: number;
  error?: string;
  retryIn?: string;
}

// Rule operation context
export interface RuleLogContext extends LogContext {
  type: "ip" | "url" | "port";
  action: "insert" | "delete" | "update" | "retrieve";
  mode?: "whitelist" | "blacklist";
  count?: number;
  values?: unknown[];
  status?: "success" | "failed";
}

// Validation context
export interface ValidationLogContext extends LogContext {
  rule: "ip" | "url" | "port";
  dataType?: string;
  isArray?: boolean;
  validatedCount?: number;
  errors?: unknown;
}

// Error context
export interface ErrorLogContext extends LogContext {
  error: string;
  stack?: string;
  details?: unknown;
  method?: string;
  url?: string;
  body?: unknown;
}

// Logging service interface
export interface ILoggingService {
  error(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;

  // Specialized logging methods
  request(context: RequestLogContext): void;
  database(context: DatabaseLogContext): void;
  rule(context: RuleLogContext): void;
  validation(context: ValidationLogContext): void;
  appError(context: ErrorLogContext): void;
}
