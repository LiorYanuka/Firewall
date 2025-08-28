# Firewall Project

Minimal REST API for managing firewall rules (IP, URL, Port) using Node.js, Express, PostgreSQL, and Drizzle ORM.

## Setup

- Node 18+
- PostgreSQL
- Create `.env` with:

```
ENV=dev
PORT=3000
DATABASE_URI_DEV=postgres://user:pass@host:5432/db
DATABASE_URI_PROD=postgres://user:pass@host:5432/db
DB_CONNECTION_INTERVAL=1000
```

## Install

```
npm install
```

## Drizzle

```
npm run db:generate
npm run db:migrate
```

## Run

```
npm run dev
```

## API

- Rules endpoints:
  - POST `/:type` (type: ip|url|port) { values: [], mode: "whitelist"|"blacklist" }
  - DELETE `/:type` (type: ip|url|port) { values: [], mode: "whitelist"|"blacklist" }
- Rules overview and toggling:
  - GET `/rules`
  - PATCH `/rules` { ips|urls|ports: { values: [], active: boolean } }

## Notes

- Drizzle config reads DB URL from `src/config/env.ts` via `drizzle.config.ts`.
- Prefer Drizzle migrations over manual SQL scripts.
