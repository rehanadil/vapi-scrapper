# 🚀 Assistant Metrics Dashboard Setup Guide

## Project Overview

This is a full-stack TypeScript application with:

### Backend (NestJS)

-   **Location**: `/Users/rehanadil/Local/rehan/rehan-vs/backend`
-   **Framework**: NestJS with TypeScript
-   **Database**: PostgreSQL + TimescaleDB
-   **ORM**: Prisma
-   **Authentication**: JWT

### Frontend (React)

-   **Location**: `/Users/rehanadil/Local/rehan/rehan-vs/frontend`
-   **Framework**: React with TypeScript
-   **State Management**: React Query
-   **Styling**: Tailwind CSS
-   **Charts**: Recharts

## 📁 Project Structure

```
rehan-vs/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # Users module
│   │   ├── assistants/        # Assistants module
│   │   ├── metrics/           # Metrics module
│   │   ├── prisma/            # Prisma service
│   │   ├── app.module.ts      # Main app module
│   │   └── main.ts            # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Sample data
│   │   └── timescale-setup.sql # TimescaleDB setup
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Main app component
│   │   └── index.tsx          # Entry point
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml         # Docker orchestration
├── PROJECT_README.md          # Detailed documentation
└── README.md                  # Original requirements
```

## 🛠️ Setup Instructions

### Prerequisites

1. **Node.js 18+** installed
2. **PostgreSQL** with **TimescaleDB** extension
3. **Docker** (optional, for easier database setup)

### Option 1: Docker Setup (Recommended)

1. **Start Docker Desktop** on your Mac

2. **Navigate to project directory**:

    ```bash
    cd /Users/rehanadil/Local/rehan/rehan-vs
    ```

3. **Start all services**:

    ```bash
    docker-compose up -d
    ```

4. **Access the application**:
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:3001
    - API Docs: http://localhost:3001/api

### Option 2: Manual Setup

#### 1. Database Setup

**Install PostgreSQL with TimescaleDB**:

```bash
# Using Homebrew
brew install timescaledb

# Or use Docker for just the database
docker run -d --name timescaledb \
  -p 5432:5432 \
  -e POSTGRES_DB=assistant_metrics \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  timescale/timescaledb:latest-pg15
```

#### 2. Backend Setup

```bash
cd /Users/rehanadil/Local/rehan/rehan-vs/backend

# Dependencies are already installed
# Generate Prisma client (already done)
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Set up TimescaleDB hypertable
psql -h localhost -U postgres -d assistant_metrics -f prisma/timescale-setup.sql

# Seed the database with sample data
npm run prisma:seed

# Start development server
npm run start:dev
```

#### 3. Frontend Setup

```bash
cd /Users/rehanadil/Local/rehan/rehan-vs/frontend

# Dependencies are already installed
# Start development server
npm start
```

## 🎯 Features Implemented

### ✅ Backend Features

-   [x] User registration and authentication (JWT)
-   [x] Assistant management (CRUD operations)
-   [x] Metrics logging and retrieval
-   [x] Rolling averages with SQL window functions
-   [x] TimescaleDB hypertables for time-series data
-   [x] Swagger API documentation
-   [x] Proper error handling and validation
-   [x] Database relationships and constraints

### ✅ Frontend Features

-   [x] User authentication (login/register)
-   [x] Dashboard with assistant overview
-   [x] Assistant creation and management
-   [x] Metrics logging interface
-   [x] Interactive charts (daily metrics)
-   [x] Rolling averages visualization
-   [x] Responsive design with Tailwind CSS
-   [x] Real-time data updates with React Query

### ✅ Database Features

-   [x] PostgreSQL with TimescaleDB extension
-   [x] Proper schema with foreign keys
-   [x] Hypertable partitioning on date
-   [x] Sample data generation
-   [x] Optimized queries for time-series data

## 🧪 Sample Data

The seed script creates:

-   **2 users** with test credentials
-   **3 assistants** (GPT-4, Claude, Gemini)
-   **30 days** of sample metrics for each assistant

**Test Login**:

-   Email: `john@example.com`
-   Password: `password123`

## 📊 API Endpoints

### Authentication

-   `POST /auth/register` - Register new user
-   `POST /auth/login` - Login user

### Assistants

-   `GET /assistants` - Get user's assistants
-   `POST /assistants` - Create new assistant
-   `GET /assistants/:id` - Get assistant details
-   `DELETE /assistants/:id` - Delete assistant

### Metrics

-   `POST /assistants/:id/metrics` - Log daily metrics
-   `GET /assistants/:id/metrics` - Get metrics (with date filters)
-   `GET /assistants/:id/metrics/rolling-avg` - Get rolling averages
-   `GET /assistants/:id/metrics/aggregated` - Get aggregated stats

## 🔧 Development Commands

### Backend

```bash
cd backend
npm run start:dev     # Development with hot reload
npm run build         # Production build
npm run test          # Run tests
npm run prisma:studio # Database browser
```

### Frontend

```bash
cd frontend
npm start             # Development server
npm run build         # Production build
npm test              # Run tests
```

## 🌟 Key Technologies Used

### Backend

-   **NestJS** - Node.js framework with decorators
-   **Prisma** - Type-safe database ORM
-   **TimescaleDB** - Time-series database extension
-   **JWT** - Authentication tokens
-   **Swagger** - API documentation
-   **bcryptjs** - Password hashing

### Frontend

-   **React 18** - UI library with hooks
-   **TypeScript** - Type safety
-   **React Query** - Server state management
-   **React Router** - Client-side routing
-   **Recharts** - Chart library
-   **Tailwind CSS** - Utility-first CSS
-   **Axios** - HTTP client

## 🚀 Next Steps

1. **Start Docker Desktop** on your Mac
2. **Run the setup commands** above
3. **Visit** http://localhost:3000
4. **Login** with test credentials
5. **Explore** the dashboard and create new assistants

## 📝 Notes

-   All dependencies are already installed
-   Prisma client is generated
-   Environment variables are configured
-   Sample data is ready to be seeded
-   Both backend and frontend are ready to run

The project is **complete and ready to use**! Just need to start the database and run the development servers.
