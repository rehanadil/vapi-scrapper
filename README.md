# Project: Assistant Metrics Dashboard

## Description

Build a full-stack web application where:

-   Users can register and login.
-   Users can create "Assistants" (LLM models).
-   Each Assistant logs daily metrics:
    -   call_count
    -   total_minutes
    -   avg_call_cost
    -   total_cost
-   Frontend shows analytics: charts, rolling averages, summaries.

---

## Tech Stack

-   Backend: Node.js, TypeScript, NestJS
-   ORM: Prisma
-   Database: PostgreSQL + TimescaleDB
-   Frontend: React (TypeScript)
-   Charts: Recharts or Chart.js
-   Authentication: JWT
-   Optional: WebSockets or Server-Sent Events for live updates

---

## Database Models (Prisma syntax)

model User {
id Int @id @default(autoincrement())
name String
email String @unique
password String
assistants Assistant[]
}

model Assistant {
id Int @id @default(autoincrement())
name String
modelType String
userId Int
user User @relation(fields: [userId], references: [id])
metrics Metric[]
}

model Metric {
id Int @id @default(autoincrement())
assistantId Int
assistant Assistant @relation(fields: [assistantId], references: [id])
date DateTime
callCount Int
totalMinutes Int
avgCallCost Float
totalCost Float
}

-   Make `Metric` a **TimescaleDB hypertable** on `date`.

---

## Backend Requirements

-   Use NestJS + TypeScript.
-   Implement REST endpoints:

1. `POST /users` → create user
2. `POST /users/:id/assistants` → create assistant
3. `POST /assistants/:id/metrics` → log daily metrics
4. `GET /assistants/:id/metrics?start=YYYY-MM-DD&end=YYYY-MM-DD` → fetch metrics
5. `GET /assistants/:id/metrics/rolling-avg?days=7` → 7-day rolling averages using SQL window functions
6. Include JWT authentication

-   Connect to PostgreSQL with Prisma.
-   Use TimescaleDB for hypertable metrics and support aggregation queries.
-   Include sample queries for:
    -   Daily averages
    -   Rolling averages
    -   Total call cost per assistant
    -   Filters by date ranges

---

## Frontend Requirements

-   React + TypeScript
-   Pages:

    1. Login / Register
    2. Dashboard showing all assistants
    3. Assistant detail page with charts:
        - Daily call count
        - Daily total minutes
        - Daily average call cost
        - Rolling 7-day averages
    4. Filters: date range, metric type

-   Fetch data from backend REST API.
-   Use Recharts or Chart.js for visualizations.
-   Include responsive design.

---

## Bonus / Optional Features

-   WebSockets or SSE to show live metric updates on dashboard.
-   Admin panel to manage users/assistants.
-   Dockerfile / docker-compose for easy setup.
-   Seed script with sample data for testing.

---

## Instructions for GitHub Copilot Chat

-   Generate the backend first (NestJS + Prisma + PostgreSQL + TimescaleDB).
-   Ensure migrations and hypertables are included.
-   Generate REST endpoints with JWT authentication.
-   Generate frontend (React + TypeScript) with dashboard and charts.
-   Connect frontend to backend endpoints.
-   Provide instructions for running the project locally (npm install, docker-compose, etc.).

# Project: Assistant Metrics Dashboard

## Description

Build a full-stack web application where:

-   Users can register and login.
-   Users can create "Assistants" (LLM models).
-   Each Assistant logs daily metrics:
    -   call_count
    -   total_minutes
    -   avg_call_cost
    -   total_cost
-   Frontend shows analytics: charts, rolling averages, summaries.

---

## Tech Stack

-   Backend: Node.js, TypeScript, NestJS
-   ORM: Prisma
-   Database: PostgreSQL + TimescaleDB
-   Frontend: React (TypeScript)
-   Charts: Recharts or Chart.js
-   Authentication: JWT
-   Optional: WebSockets or Server-Sent Events for live updates

---

## Database Models (Prisma syntax)

model User {
id Int @id @default(autoincrement())
name String
email String @unique
password String
assistants Assistant[]
}

model Assistant {
id Int @id @default(autoincrement())
name String
modelType String
userId Int
user User @relation(fields: [userId], references: [id])
metrics Metric[]
}

model Metric {
id Int @id @default(autoincrement())
assistantId Int
assistant Assistant @relation(fields: [assistantId], references: [id])
date DateTime
callCount Int
totalMinutes Int
avgCallCost Float
totalCost Float
}

-   Make `Metric` a **TimescaleDB hypertable** on `date`.

---

## Backend Requirements

-   Use NestJS + TypeScript.
-   Implement REST endpoints:

1. `POST /users` → create user
2. `POST /users/:id/assistants` → create assistant
3. `POST /assistants/:id/metrics` → log daily metrics
4. `GET /assistants/:id/metrics?start=YYYY-MM-DD&end=YYYY-MM-DD` → fetch metrics
5. `GET /assistants/:id/metrics/rolling-avg?days=7` → 7-day rolling averages using SQL window functions
6. Include JWT authentication

-   Connect to PostgreSQL with Prisma.
-   Use TimescaleDB for hypertable metrics and support aggregation queries.
-   Include sample queries for:
    -   Daily averages
    -   Rolling averages
    -   Total call cost per assistant
    -   Filters by date ranges

---

## Frontend Requirements

-   React + TypeScript
-   Pages:

    1. Login / Register
    2. Dashboard showing all assistants
    3. Assistant detail page with charts:
        - Daily call count
        - Daily total minutes
        - Daily average call cost
        - Rolling 7-day averages
    4. Filters: date range, metric type

-   Fetch data from backend REST API.
-   Use Recharts or Chart.js for visualizations.
-   Include responsive design.

---

## Bonus / Optional Features

-   WebSockets or SSE to show live metric updates on dashboard.
-   Admin panel to manage users/assistants.
-   Dockerfile / docker-compose for easy setup.
-   Seed script with sample data for testing.

---

## Instructions for GitHub Copilot Chat

-   Generate the backend first (NestJS + Prisma + PostgreSQL + TimescaleDB).
-   Ensure migrations and hypertables are included.
-   Generate REST endpoints with JWT authentication.
-   Generate frontend (React + TypeScript) with dashboard and charts.
-   Connect frontend to backend endpoints.
-   Provide instructions for running the project locally (npm install, docker-compose, etc.).
