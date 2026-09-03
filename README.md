# postgres

A small Node.js + TypeScript + Express project for learning how to work with **PostgreSQL** using the [`pg`](https://www.npmjs.com/package/pg) driver — covering raw connections, parameterized queries, transactions, table relationships, and joins.

## Overview

This repo is a hands-on playground built up commit by commit while learning PostgreSQL fundamentals from a Node/TypeScript backend:

- Connecting to a Postgres database with the `pg` client
- Writing raw SQL queries (`CREATE TABLE`, `INSERT`, `UPDATE`)
- Safely inserting data using parameterized queries (protecting against SQL injection)
- Modeling relationships between tables (`users` ↔ `address` via a foreign key)
- Wrapping multi-step writes in a transaction (`BEGIN` / `COMMIT`)
- Querying related data across tables with `JOIN`

## Tech Stack

- **Node.js** with **TypeScript** (ESM, `nodenext` module resolution)
- **Express 5** — HTTP server / routing
- **pg** — PostgreSQL client for Node.js
- **nodemon** — auto-restart during development

## Project Structure

```
postgres/
├── src/
│   └── index.ts        # Express app, DB connection, routes, and SQL logic
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore
```

## Database Schema

Two related tables are created via raw SQL in `index.ts`:

**users**
| Column     | Type                        |
|------------|-----------------------------|
| id         | SERIAL PRIMARY KEY          |
| username   | VARCHAR(50) UNIQUE NOT NULL |
| email      | VARCHAR(255) UNIQUE NOT NULL|
| password   | VARCHAR(255) NOT NULL       |
| created_at | TIMESTAMP WITH TIME ZONE    |

**address**
| Column   | Type        |
|----------|-------------|
| city     | VARCHAR(30) |
| state    | VARCHAR(30) |
| country  | VARCHAR(30) |
| street   | VARCHAR(50) |
| pincode  | VARCHAR(6)  |
| user_id  | INT (FK → users.id) |

## API Endpoints

| Method | Route       | Description                                                   |
|--------|-------------|-----------------------------------------------------------------|
| POST   | `/user`     | Creates a user and their address inside a single DB transaction |
| GET    | `/metadata` | Joins `users` and `address` to fetch a user's full profile      |

### `POST /user`

Inserts a new row into `users`, then uses the generated `id` to insert a linked row into `address`. Both inserts run inside a `BEGIN` / `COMMIT` transaction so that either both succeed or neither does.

**Request body:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "India",
  "street": "MG Road",
  "pincode": "500001"
}
```

### `GET /metadata`

Runs an inner `JOIN` between `users` and `address` on `user_id` to return combined profile data.

## SQL Queries Used

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create address table
CREATE TABLE address (
    city VARCHAR(30),
    state VARCHAR(30),
    country VARCHAR(30),
    street VARCHAR(50),
    pincode VARCHAR(6),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Insert a user (parameterized, SQL-injection safe)
INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;

-- Insert an address linked to a user (parameterized)
INSERT INTO address (city, state, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5, $6);

-- Transaction wrapping the two inserts above
BEGIN;
COMMIT;

-- Join users and address to fetch a full profile
SELECT users.id, users.username, users.email, address.city, address.country, address.street, address.pincode
FROM users
JOIN address ON users.id = address.user_id
WHERE users.id = $1;
```

## Getting Started

### Prerequisites
- Node.js
- A PostgreSQL database (e.g. a local instance or a hosted service like Neon)

### Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

   Or, to install just the PostgreSQL driver:
   ```bash
   npm i pg
   ```

2. Set your database connection string as an environment variable rather than hardcoding it in source (see **Security Note** below). A typical setup uses [`dotenv`](https://www.npmjs.com/package/dotenv):
   ```bash
   npm install dotenv
   ```
   ```env
   # .env
   DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
   ```
   ```ts
   import "dotenv/config";
   const pgClient = new Client(process.env.DATABASE_URL);
   ```

3. Run in development mode (compiles TypeScript and restarts on changes):
   ```bash
   npm run dev
   ```

4. The server starts on **http://localhost:3000**.

## ⚠️ Security Note

The current version of `src/index.ts` has the PostgreSQL connection string (including credentials) hardcoded directly in the file, which is committed to a public repository. Because those credentials are already exposed in git history:

- **Rotate/reset the database password immediately** in your provider's dashboard (e.g. Neon).
- Move the connection string into an environment variable (e.g. `.env`, loaded via `dotenv`) and add `.env` to `.gitignore`.
- Consider scrubbing the old credentials from git history if the repo will stay public.

## Roadmap / Learning Notes

Based on the project's summary:
- [x] Connect to Postgres with `pg`
- [x] Basic `INSERT` / `UPDATE` queries
- [x] Parameterized queries to prevent SQL injection
- [x] Table relationships (foreign keys)
- [x] Transactions (`BEGIN` / `COMMIT`)
- [x] `JOIN` queries (inner, left, right, outer)

##
