# Backend Architecture

## Overview

Node.js/Express REST API for client management, following a **SOLID** layered architecture:

```
HTTP Request
    │
    ▼
server.js              ─ Entry point, middleware, route mounting
    │
    ▼
clientRoutes.js        ─ Route definitions (REST endpoints)
    │
    ▼
clientController.js    ─ Request/response handling
    │
    ▼
clientService.js       ─ Business logic & validation
    │
    ▼
client.js (Model)      ─ Data access layer (Prisma ORM)
    │
    ▼
prismaClient.js        ─ Prisma client singleton
    │
    ▼
MySQL (MariaDB)        ─ Database
```

---

## Layer Details

### 1. Entry Point — `server.js`

```js
import express from 'express';
import cors from 'cors';
import clientRoutes from './src/routes/clientRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/clients', clientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running firmly on port ${PORT}`));
```

- Creates Express app
- Enables **CORS** (cross-origin requests from frontend)
- Parses JSON request bodies
- Mounts all client routes under `/api/clients`
- Listens on port `5000` (or `PORT` from `.env`)

### 2. Routes — `clientRoutes.js`

Wires HTTP methods + paths to controller methods:

| Method | Path               | Controller method | Action       |
|--------|--------------------|-------------------|--------------|
| POST   | `/api/clients`     | `create`          | Create client |
| GET    | `/api/clients`     | `getAll`          | List all      |
| GET    | `/api/clients/:id` | `getById`         | Get one       |
| PUT    | `/api/clients/:id` | `update`          | Update        |
| DELETE | `/api/clients/:id` | `delete`          | Delete        |

Dependency injection wiring:
```js
const client = new Client();                              // model
const clientService = new ClientService(client);          // service ← model
const clientController = new ClientController(clientService); // controller ← service
```

### 3. Controller — `clientController.js`

- Receives `req`/`res`
- Delegates work to the service layer
- Returns appropriate HTTP status codes:
  - `201` — Created
  - `200` — Success
  - `400` — Bad request (validation error)
  - `404` — Not found
  - `500` — Server error

### 4. Service — `clientService.js`

Business logic layer:
- `createClient` — validates that `name` and `phone` are provided
- `getAllClients` — returns all clients
- `getClientById` — throws if not found
- `updateClient` — checks existence first, then updates
- `deleteClient` — checks existence first, then deletes

### 5. Model — `client.js`

Data access layer using Prisma ORM:
- `create` → `prisma.client.create({ data })`
- `getAll` → `prisma.client.findMany()`
- `getById` → `prisma.client.findUnique({ where: { id: Number(id) } })`
- `update` → `prisma.client.update({ where: { id: Number(id) }, data })`
- `delete` → `prisma.client.delete({ where: { id: Number(id) } })`

### 6. Prisma Config — `prismaClient.js`

```js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });
export default prisma;
```

- Loads `.env` environment variables
- Creates a Prisma client with MariaDB adapter
- Single shared instance exported as singleton

---

## Database Schema — `prisma/schema.prisma`

```prisma
datasource db {
  provider = "mysql"
}

generator client {
  provider = "prisma-client-js"
}

model Client {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  phone       String
  createdAt   DateTime @default(now())
}
```

- **id** — Auto-incrementing primary key
- **name** — Required string
- **description** — Optional string
- **phone** — Required string
- **createdAt** — Auto-set on creation

---

## Environment — `.env`

```
DATABASE_URL="mysql://root:Mehdyboss2004@localhost:3306/mern_db"
PORT=5000
```

---

## Dependencies — `package.json`

| Package                  | Purpose                    |
|--------------------------|----------------------------|
| `express` ^5.2.1         | Web framework              |
| `cors` ^2.8.6            | Cross-origin support       |
| `@prisma/client` ^7.8.0  | Prisma ORM client          |
| `@prisma/adapter-mariadb` ^7.8.0 | MariaDB adapter for Prisma |
| `mariadb` ^3.5.3         | MariaDB driver             |

**Dev:**
| Package        | Purpose               |
|----------------|-----------------------|
| `prisma` ^7.8.0 | Prisma CLI (migrations, generate) |
| `nodemon` ^3.1.14 | Auto-restart on file changes |

---

## Scripts

```bash
npm run dev    # Start with nodemon (auto-reload)
node server.js # Start production
```

---

## Request Flow Example

```
POST /api/clients  { "name": "John", "phone": "123", "description": "..." }
    │
    ▼
express.json() → parses body
    │
    ▼
Router matches POST /
    │
    ▼
clientController.create(req, res)
    │
    ▼
clientService.createClient(data)
    │  validates name + phone required
    ▼
client model → prisma.client.create({ data })
    │
    ▼
MySQL INSERT → returns new client
    │
    ▼
res.status(201).json(client)
```
