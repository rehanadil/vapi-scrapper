# Backend Development Guide

## How to Create New Endpoints

### 1. Adding to Existing Controller (Easiest)

Navigate to any existing controller in `src/`:
- `src/assistants/assistants.controller.ts`
- `src/admin/admin.controller.ts` 
- `src/users/users.controller.ts`
- `src/auth/auth.controller.ts`

Add new methods to the controller class:

```typescript
@Get('your-endpoint')
@ApiOperation({ summary: 'Description of your endpoint' })
@ApiResponse({ status: 200, description: 'Success response description' })
async yourMethod(@Request() req) {
    // Your logic here
    return { message: 'Your response' };
}

@Post('your-endpoint')
async yourPostMethod(@Request() req, @Body() data: YourDto) {
    // Your logic here
    return this.yourService.someMethod(req.user.id, data);
}
```

### 2. Creating New Controller

If you need a completely new feature:

1. Create new folder: `src/your-feature/`
2. Create files:
   - `your-feature.controller.ts`
   - `your-feature.service.ts` 
   - `your-feature.module.ts`
   - `dto/your-dto.ts` (if needed)

3. Add module to `src/app.module.ts` imports array

### 3. HTTP Methods Available

- `@Get('path')` - GET requests
- `@Post('path')` - POST requests  
- `@Put('path')` - PUT requests
- `@Delete('path')` - DELETE requests
- `@Patch('path')` - PATCH requests

### 4. Common Decorators

- `@UseGuards(JwtAuthGuard)` - Require authentication
- `@Request() req` - Access request object (includes req.user)
- `@Body() data: YourDto` - Access request body
- `@Param('id') id: string` - Access URL parameters
- `@Query('filter') filter: string` - Access query parameters

### 5. Response Structure

Always return consistent JSON:
```typescript
return { 
    success: true,
    data: yourData,
    message: 'Operation successful' 
};
```

## How to Run the Backend

### 1. Development Mode (Hot Reload)
```bash
cd backend
npm run start:dev
```
Server runs at `http://localhost:3001`

### 2. Production Mode
```bash
cd backend
npm run build
npm run start:prod
```

### 3. Debug Mode
```bash
cd backend
npm run start:debug
```

### 4. Watch for File Changes
The `start:dev` command automatically restarts when you save files.

## Database Operations

### 1. After Schema Changes
```bash
cd backend
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

### 2. Reset Database
```bash
cd backend
npx prisma migrate reset
```

### 3. View Database
```bash
cd backend
npx prisma studio
```

## Testing Your Endpoints

### 1. Using curl
```bash
# GET request
curl http://localhost:3001/assistants

# POST request with auth
curl -X POST http://localhost:3001/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Test", "modelType": "GPT-4"}'
```

### 2. Using Postman/Insomnia
- Import the API from `http://localhost:3001/api` (Swagger docs)
- Set Authorization header: `Bearer YOUR_JWT_TOKEN`

### 3. Frontend Integration
Update frontend services in `frontend/src/services/` to call your new endpoints.

## Project Structure

```
backend/src/
├── app.module.ts          # Main app module
├── main.ts               # App entry point
├── auth/                 # Authentication
├── users/                # User management
├── assistants/           # Assistant management
├── admin/               # Admin functionality
├── metrics/             # Metrics/analytics
└── prisma/              # Database service
```

## Environment Variables

Located in `backend/.env`:
- `DATABASE_URL` - Database connection
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 3001)

## Common Commands

```bash
# Install dependencies
npm install

# Generate Prisma client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Seed database
npx prisma db seed

# Run tests
npm run test

# Check types
npm run build
```

## Authentication

Most endpoints require authentication. Users must:
1. Login via `/auth/login` 
2. Include JWT token in headers: `Authorization: Bearer TOKEN`

Access user info in controllers via `@Request() req` then `req.user.id`.

## Troubleshooting

- **Port already in use**: Change PORT in `.env` or kill process on port 3001
- **Database connection**: Check `DATABASE_URL` in `.env`
- **TypeScript errors**: Run `npm run build` to see detailed errors
- **Prisma errors**: Run `npx prisma generate` after schema changes