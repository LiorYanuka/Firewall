export const PORT_CONSTANTS = {
  MIN_PORT: 1,
  MAX_PORT: 65535,
  MAX_PORT_EXCLUSIVE: 65536,
} as const;

export const ENVIRONMENTS = ["dev", "production"] as const;

export const APP_CONSTANTS = {
  SERVICE_NAME: "firewall-frontend",
} as const;


