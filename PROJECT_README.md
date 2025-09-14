# Assistant Metrics Dashboard

A full-stack web application for tracking and analyzing AI assistant metrics with real-time analytics and beautiful visualizations.

## Features

-   🔐 **User Authentication** - Secure JWT-based authentication
-   🤖 **Assistant Management** - Create and manage multiple AI assistants
-   📊 **Metrics Tracking** - Log daily metrics including call count, minutes, costs
-   📈 **Analytics Dashboard** - Beautiful charts and rolling averages
-   ⚡ **Real-time Data** - TimescaleDB for efficient time-series data
-   🎨 **Modern UI** - Responsive design with Tailwind CSS

## Tech Stack

### Backend

-   **Framework**: NestJS with TypeScript
-   **Database**: PostgreSQL with TimescaleDB
-   **ORM**: Prisma
-   **Authentication**: JWT with Passport
-   **API Documentation**: Swagger/OpenAPI

### Frontend

-   **Framework**: React with TypeScript
-   **State Management**: React Query
-   **Routing**: React Router
-   **Charts**: Recharts
-   **Styling**: Tailwind CSS
-   **Date Handling**: date-fns

## Quick Start

### Prerequisites

-   Node.js 18+
-   Docker and Docker Compose
-   Git

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd rehan-vs
    ```

2. **Start all services**

    ```bash
    docker-compose up -d
    ```

3. **Access the application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:3001
    - API Documentation: http://localhost:3001/api

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**

    ```bash
    cd backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    # Edit .env with your database credentials
    ```

4. **Start PostgreSQL with TimescaleDB**

    ```bash
    docker run -d \
      --name timescaledb \
      -p 5432:5432 \
      -e POSTGRES_DB=assistant_metrics \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=password \
      timescale/timescaledb:latest-pg15
    ```

5. **Run database migrations**

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

6. **Set up TimescaleDB hypertable**

    ```bash
    # Connect to PostgreSQL and run:
    psql -h localhost -U postgres -d assistant_metrics -f prisma/timescale-setup.sql
    ```

7. **Seed the database**

    ```bash
    npm run prisma:seed
    ```

8. **Start the development server**
    ```bash
    npm run start:dev
    ```

#### Frontend Setup

1. **Navigate to frontend directory**

    ```bash
    cd frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**
    ```bash
    npm start
    ```

## API Endpoints

### Authentication

-   `POST /auth/register` - Register a new user
-   `POST /auth/login` - Login user

### Assistants

-   `GET /assistants` - Get all assistants for current user
-   `POST /assistants` - Create a new assistant
-   `GET /assistants/:id` - Get assistant by ID
-   `DELETE /assistants/:id` - Delete assistant

### Metrics

-   `POST /assistants/:id/metrics` - Log daily metrics
-   `GET /assistants/:id/metrics` - Get metrics with optional date filters
-   `GET /assistants/:id/metrics/rolling-avg` - Get rolling averages
-   `GET /assistants/:id/metrics/aggregated` - Get aggregated metrics
-   `GET /assistants/:id/metrics/daily-averages` - Get daily averages

## Database Schema

### Users

-   `id` - Primary key
-   `name` - User's full name
-   `email` - Unique email address
-   `password` - Hashed password
-   `createdAt` - Account creation timestamp

### Assistants

-   `id` - Primary key
-   `name` - Assistant name
-   `modelType` - Model type (GPT-4, Claude, etc.)
-   `userId` - Foreign key to users
-   `createdAt` - Creation timestamp

### Metrics (TimescaleDB Hypertable)

-   `id` - Primary key
-   `assistantId` - Foreign key to assistants
-   `date` - Date of metrics (partitioning key)
-   `callCount` - Number of calls made
-   `totalMinutes` - Total minutes of conversation
-   `avgCallCost` - Average cost per call
-   `totalCost` - Total cost for the day

## Sample Data

The seed script creates:

-   2 sample users
-   3 sample assistants
-   30 days of sample metrics for each assistant

**Test Credentials:**

-   Email: `john@example.com`
-   Password: `password123`

## Advanced Features

### TimescaleDB Integration

-   Efficient time-series data storage
-   Automatic partitioning by date
-   Optimized queries for time-based analytics
-   Rolling average calculations using window functions

### Rolling Averages

```sql
SELECT
  date,
  AVG(call_count) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as rolling_avg_calls
FROM metrics
WHERE assistant_id = $1
ORDER BY date DESC;
```

## Development

### Backend Development

```bash
cd backend
npm run start:dev  # Development with hot reload
npm run test       # Run tests
npm run lint       # Run linter
```

### Frontend Development

```bash
cd frontend
npm start          # Development server
npm test           # Run tests
npm run build      # Production build
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Browse data
npx prisma studio
```

## Deployment

### Production Environment Variables

**Backend (.env)**

```env
DATABASE_URL="postgresql://user:password@host:5432/assistant_metrics"
JWT_SECRET="your-production-secret-key"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://your-domain.com"
```

**Frontend (.env.production)**

```env
REACT_APP_API_URL="https://api.your-domain.com"
```

### Docker Production Deployment

```bash
# Build and start services
docker-compose -f docker-compose.yml up -d

# Scale services if needed
docker-compose up -d --scale backend=3
```

## Performance Considerations

### Database Optimization

-   TimescaleDB hypertables for efficient time-series storage
-   Proper indexing on date and assistantId columns
-   Regular data retention policies for old metrics

### Frontend Optimization

-   React Query for efficient data caching
-   Lazy loading of charts and components
-   Optimized bundle size with code splitting

### Backend Optimization

-   Connection pooling with Prisma
-   Request/response compression
-   Rate limiting for API endpoints

## Monitoring

### Health Checks

-   Database connectivity: `GET /health/db`
-   API status: `GET /health`
-   Frontend build status in Docker

### Metrics to Monitor

-   API response times
-   Database query performance
-   Active user sessions
-   Error rates and exceptions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the GitHub repository.
