# Backend Architecture

## Overview

Node.js/Express REST API for client management, following a **SOLID** layered architecture:

```
HTTP Request
    │
    ├── /api/auth/* ──────────────────────────────┐
    │       │                                      │
    │       ▼                                      │
    │  authRoutes.js                               │
    │       │                                      │
    │       ▼                                      │
    │  authController.js  ── JWT ──► token         │
    │       │                                      │
    │       ▼                                      │
    │  prismaClient.js                             │
    │       │                                      │
    │       ▼                                      │
    │  MySQL (Admin table)                         │
    │                                              │
    └──────────────────────────────────────────────┘
                                                   
    ├── /api/clients/* ───────────────────────────┐
    │       │                                      │
    │       ▼                                      │
    │  clientRoutes.js                             │
    │       │                                      │
    │  authMiddleware.js  ◄── JWT verification     │
    │       │                                      │
    │       ▼                                      │
    │  clientController.js                         │
    │       │                                      │
    │       ▼                                      │
    │  clientService.js                            │
    │       │                                      │
    │       ▼                                      │
    │  client.js (Model)                           │
    │       │                                      │
    │       ▼                                      │
    │  prismaClient.js                             │
    │       │                                      │
    │       ▼                                      │
    │  MySQL (Client table)                        │
    │                                              │
    └──────────────────────────────────────────────┘

server.js ─── mounts both route groups + middleware
```

---

## Layer Details

### 1. Entry Point — `server.js`

```js
import express from 'express';
import cors from 'cors';
import clientRoutes from './src/routes/clientRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running firmly on port ${PORT}`));
```

- Creates Express app
- Enables **CORS** (cross-origin requests from frontend)
- Parses JSON request bodies
- Mounts client CRUD routes under `/api/clients`
- Mounts authentication routes under `/api/auth`
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

### 6. Auth Routes — `authRoutes.js`

Defines two public authentication endpoints (no JWT required):

| Method | Path                 | Controller method | Action                |
|--------|----------------------|-------------------|-----------------------|
| POST   | `/api/auth/register` | `register`        | Create a new admin    |
| POST   | `/api/auth/login`    | `login`           | Authenticate & get JWT |

```js
router.post('/register', register);
router.post('/login', login);
```

### 7. Auth Controller — `authController.js`

Handles admin registration and login using bcrypt + JWT.

**Register flow:**
1. Checks if the email is already taken (`prisma.admin.findUnique`)
2. Hashes the password with bcrypt (salt rounds = 10)
3. Creates the admin record in MySQL
4. Returns `201` on success

**Login flow:**
1. Finds the admin by email (`prisma.admin.findUnique`)
2. Compares the provided password with the stored hash (`bcrypt.compare`)
3. If valid, signs a JWT containing `{ adminId }` with a 24-hour expiry
4. Returns the token to the client

```js
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ error: "Invalid email or password!" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid email or password!" });

  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: "Login successful!", token });
};
```

### 8. Auth Middleware — `authMiddleware.js`

Protects client CRUD routes by verifying the JWT on every request:

```js
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: "Access denied!" });

  const decoded = jwt.verify(token, JWT_SECRET);
  req.adminId = decoded.adminId;
  next();
};
```

- Expects `Authorization: Bearer <token>` header
- Returns `403` if no token, `401` if token is invalid/expired
- Attaches `adminId` to the request for downstream use

### 9. Prisma Config — `prismaClient.js`

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

model Admin {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}

model Client {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  phone       String
  createdAt   DateTime @default(now())
}
```

### Admin model
| Field    | Type     | Notes                    |
|----------|----------|--------------------------|
| `id`     | Int      | Primary key, auto-increment |
| `email`  | String   | Unique, used for login   |
| `password` | String | Stores bcrypt hash, never plain text |

### Client model
| Field         | Type     | Notes                        |
|---------------|----------|------------------------------|
| `id`          | Int      | Primary key, auto-increment  |
| `name`        | String   | Required                     |
| `description` | String?  | Optional                     |
| `phone`       | String   | Required                     |
| `createdAt`   | DateTime | Auto-set on creation         |

---

### 10. Migration Config — `prisma.config.ts`

Prisma v7 moved the connection URL out of `schema.prisma` and into a standalone config file evaluated by the CLI:

```ts
import { defineConfig } from 'prisma/config'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '.env')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      let value = trimmed.slice(eqIndex + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {}
}

loadEnv()

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
```

**Why this is needed:**

- Prisma v7 no longer supports `url = env("...")` inside `schema.prisma` for migrations.
- The CLI reads `prisma.config.ts` to know which database to connect to when running `prisma migrate dev`.
- The `loadEnv()` helper is necessary because Prisma v7's config evaluator does **not** auto-load `.env` files — we parse it manually with Node's `fs` module to make `DATABASE_URL` available on `process.env` before passing it to `defineConfig`.

**How to generate a migration:**

```bash
npx prisma migrate dev --name <migration_name>
```

---

## Environment — `.env`

```
DATABASE_URL="mysql://root:Mehdyboss2004@localhost:3306/mern_db"
PORT=5000
```

The `JWT_SECRET` is optional — if not set, the auth controller falls back to `'super_secret_key_123'`.

---

## Dependencies — `package.json`

| Package                  | Purpose                    |
|--------------------------|----------------------------|
| `express` ^5.2.1         | Web framework              |
| `cors` ^2.8.6            | Cross-origin support       |
| `bcrypt` ^6.0.0          | Password hashing           |
| `jsonwebtoken` ^9.0.3    | JWT signing & verification |
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
npm run dev           # Start with nodemon (auto-reload)
node server.js        # Start production
npx prisma db seed    # Seed the database with default admin
npx prisma migrate dev --name <name>  # Create & apply a migration
npx prisma generate   # Regenerate Prisma client after schema changes
```

---

## Seed Script — `prisma/seed.js`

Creates the first admin account so the login page can be used:

- **Email:** `admin@smartrecruit.com`
- **Password:** `SuperSecretAdminPassword123`

```js
const hashedPassword = await bcrypt.hash(plainPassword, 10);
await prisma.admin.create({
  data: { email: adminEmail, password: hashedPassword },
});
```

Run with: `npx prisma db seed`

---

## Request Flow Examples

### Client CRUD (protected)

```
POST /api/clients  { "name": "John", "phone": "123", "description": "..." }
Header: Authorization: Bearer <token>
    │
    ▼
express.json() → parses body
    │
    ▼
Router matches POST /
    │
    ▼
authMiddleware.verifyToken  ◄── decodes JWT, sets req.adminId
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

### Authentication (public)

```
POST /api/auth/login  { "email": "admin@...", "password": "..." }
    │
    ▼
express.json() → parses body
    │
    ▼
Router matches POST /login
    │
    ▼
authController.login(req, res)
    │
    ├── prisma.admin.findUnique({ where: { email } })
    │     → 401 if not found
    │
    ├── bcrypt.compare(password, admin.password)
    │     → 401 if mismatch
    │
    └── jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' })
          │
          ▼
    res.json({ token })
```

```
POST /api/auth/register  { "email": "...", "password": "..." }
    │
    ▼
authController.register(req, res)
    │
    ├── prisma.admin.findUnique({ where: { email } })
    │     → 400 if already exists
    │
    ├── bcrypt.hash(password, 10)
    │
    └── prisma.admin.create({ data: { email, password: hash } })
          │
          ▼
    res.status(201).json({ message: "Admin created!" })
```
