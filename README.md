# Firewall Management System

A comprehensive firewall management application with Node.js/Express backend and Next.js frontend for managing firewall rules (IP, URL, Port) with PostgreSQL and Drizzle ORM.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd Firewall

# Install dependencies
npm run install:all

# Create environment files
# Backend (.env)
echo "ENV=dev
PORT=3000
DATABASE_URI_DEV=postgres://user:password@localhost:5432/firewall_dev
DATABASE_URI_PROD=postgres://user:password@localhost:5432/firewall_prod
DB_CONNECTION_INTERVAL=1000" > Backend/.env

# Frontend (.env.local)
echo "ENV=dev
PORT=3001
SERVER_URL=http://localhost:3000
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_SERVER_URL=http://localhost:3000" > Frontend/my-app/.env.local

# Start both servers
npm run dev
```

**Access**: Frontend (http://localhost:3001) | Backend API (http://localhost:3000)

## 🔧 Environment Setup

### Backend (.env)

```bash
ENV=dev
PORT=3000
DATABASE_URI_DEV=postgres://user:password@localhost:5432/firewall_dev
DATABASE_URI_PROD=postgres://user:password@localhost:5432/firewall_prod
DB_CONNECTION_INTERVAL=1000
```

### Frontend (.env.local)

```bash
ENV=dev
PORT=3001
SERVER_URL=http://localhost:3000  # used on the server side (Next.js)
NEXT_PUBLIC_ENV=dev               # used in the browser
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## 🌐 API Endpoints

| Method | Endpoint                                    | Description        |
| ------ | ------------------------------------------- | ------------------ |
| POST   | `/api/firewall/:type` (`ip`\|`url`\|`port`) | Add rules          |
| DELETE | `/api/firewall/:type` (`ip`\|`url`\|`port`) | Remove rules       |
| GET    | `/api/firewall/rules`                       | Get all rules      |
| PATCH  | `/api/firewall/rules`                       | Update rule status |

**Body Format**: `{ values: string[], mode: "whitelist"|"blacklist" }`

## 🎯 Features

### Backend

- Environment config with Zod validation
- Winston logging with console override
- PostgreSQL + Drizzle ORM
- Comprehensive testing with Jest
- Full TypeScript implementation

### Frontend

- Next.js 15 with App Router
- Responsive Tailwind CSS UI
- Firewall rules management (add/view/toggle/delete)
- Real-time validation and feedback
- Client & server logging

## 📁 Project Structure

```
Firewall/
├── Backend/          # Node.js + Express + PostgreSQL
├── Frontend/my-app/  # Next.js + React + TypeScript
└── README.md
```

## 🔍 Commands

```bash
npm run dev          # Start both servers
npm run build        # Build both apps
npm run test         # Run backend tests
npm run install:all  # Install all dependencies

# Backend database utilities (run inside Backend/ or via npm --workspace)
npm run -w Backend db:generate  # Generate Drizzle migrations
npm run -w Backend db:migrate   # Apply migrations
npm run -w Backend db:seed      # Seed mock data
```

## 🛡️ Security & Logging

- **Input Validation**: Zod schemas for all inputs
- **Type Safety**: Full TypeScript implementation
- **Logging**: Winston with environment-aware levels
- **Database**: Parameterized queries with Drizzle ORM

## 📄 License

MIT License - **Lior Yanuka**
