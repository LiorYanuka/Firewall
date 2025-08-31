export type RuleType = "port" | "url" | "ip";
export type ActionType = "insert" | "delete";
export type ModeType = "whitelist" | "blacklist";

// Drizzle table interface for type safety
export interface RuleTable {
  id: any;
  mode: any;
  status: any;
  active: any;
  [key: string]: any; // For dynamic column access
}

// Type for Drizzle table instances
export type DrizzleTable = any; // Using any for now since Drizzle types are complex

// Rule map entry interface
export interface RuleMapEntry {
  table: DrizzleTable;
  column: string;
}

// Updated rule interface for return types
export interface UpdatedRule {
  id: number;
  [key: string]: string | number | boolean;
}

// API error interface
export interface ApiError {
  status?: number;
  message?: string;
  stack?: string;
  details?: unknown;
}

// Request body interface for rule operations
export interface RuleRequestBody {
  values: unknown[];
  mode: ModeType;
}

// Response interface for rule operations
export interface RuleResponse {
  message: string;
}

// Error response interface
export interface ErrorResponse {
  error: string;
  details?: unknown;
}
