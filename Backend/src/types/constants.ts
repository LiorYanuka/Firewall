// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Port Constants
export const PORT_CONSTANTS = {
  MIN_PORT: 1,
  MAX_PORT: 65535,
  MAX_PORT_EXCLUSIVE: 65536,
} as const;

// Database Constants
export const DB_CONSTANTS = {
  MAX_RETRY_DELAY_MS: 16000,
  HEALTH_CHECK_QUERY: "SELECT 1",
} as const;

// Validation Constants
export const VALIDATION_CONSTANTS = {
  MIN_ARRAY_LENGTH: 1,
} as const;

// Mock Data Constants
export const MOCK_DATA_CONSTANTS = {
  DEFAULT_COUNT: 10,
  WHITELIST_MODULO: 2,
  BLACKLIST_MODULO: 2,
} as const;

// Array Index Constants (for rules service)
export const ARRAY_INDICES = {
  IP_BLACKLIST: 0,
  IP_WHITELIST: 1,
  URL_BLACKLIST: 2,
  URL_WHITELIST: 3,
  PORT_BLACKLIST: 4,
  PORT_WHITELIST: 5,
} as const;

// Process Exit Codes
export const EXIT_CODES = {
  ERROR: 1,
} as const;
