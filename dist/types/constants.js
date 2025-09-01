"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXIT_CODES = exports.ARRAY_INDICES = exports.MOCK_DATA_CONSTANTS = exports.VALIDATION_CONSTANTS = exports.DB_CONSTANTS = exports.PORT_CONSTANTS = exports.HTTP_STATUS = void 0;
// HTTP Status Codes
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
};
// Port Constants
exports.PORT_CONSTANTS = {
    MIN_PORT: 1,
    MAX_PORT: 65535,
    MAX_PORT_EXCLUSIVE: 65536,
};
// Database Constants
exports.DB_CONSTANTS = {
    MAX_RETRY_DELAY_MS: 16000,
    HEALTH_CHECK_QUERY: "SELECT 1",
};
// Validation Constants
exports.VALIDATION_CONSTANTS = {
    MIN_ARRAY_LENGTH: 1,
};
// Mock Data Constants
exports.MOCK_DATA_CONSTANTS = {
    DEFAULT_COUNT: 10,
    WHITELIST_MODULO: 2,
    BLACKLIST_MODULO: 2,
};
// Array Index Constants (for rules service)
exports.ARRAY_INDICES = {
    IP_BLACKLIST: 0,
    IP_WHITELIST: 1,
    URL_BLACKLIST: 2,
    URL_WHITELIST: 3,
    PORT_BLACKLIST: 4,
    PORT_WHITELIST: 5,
};
// Process Exit Codes
exports.EXIT_CODES = {
    ERROR: 1,
};
