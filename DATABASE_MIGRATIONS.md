# Database Migrations Guide

This guide explains how to update database table structures in the backend using Prisma.

## Overview

The backend uses Prisma as the ORM with the following migration workflow:
1. Edit the Prisma schema
2. Generate migrations
3. Apply migrations to the database

## Step-by-Step Process

### 1. Edit Prisma Schema

Modify `backend/prisma/schema.prisma` to add, remove, or change fields in your models:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  // Add new field:
  avatar    String?
  // Change existing field:
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}
```

### 2. Generate and Apply Migration

Navigate to the backend directory and run:

```bash
cd backend
npm run prisma:migrate
```

This command will:
- Prompt you to name your migration (e.g., "add_user_avatar")
- Generate a new migration file in `prisma/migrations/`
- Apply the migration to your database
- Update the Prisma client

### 3. Alternative: Development Push (Quick Prototyping)

For rapid development without creating migration files:

```bash
cd backend
npm run prisma:push
```

⚠️ **Warning**: Only use `prisma:push` in development. Always use migrations for production.

## Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `prisma:migrate` | `prisma migrate dev` | Create and apply migrations |
| `prisma:push` | `prisma db push` | Push schema changes directly |
| `prisma:generate` | `prisma generate` | Regenerate Prisma client |
| `prisma:seed` | `ts-node prisma/seed.ts` | Seed database with initial data |

## Useful Commands

### Check Migration Status
```bash
cd backend
npx prisma migrate status
```

### View Database
```bash
cd backend
npx prisma studio
```

### Reset Database (Development Only)
```bash
cd backend
npx prisma migrate reset
```

### Deploy Migrations (Production)
```bash
cd backend
npx prisma migrate deploy
```

## Migration Best Practices

1. **Always create migrations for production changes**
2. **Test migrations on a copy of production data**
3. **Review generated migration files before applying**
4. **Use descriptive migration names**
5. **Never edit existing migration files**
6. **Backup database before major changes**

## Common Schema Changes

### Adding a Field
```prisma
model User {
  // existing fields...
  newField String? // Optional field
  requiredField String @default("default_value") // Required with default
}
```

### Removing a Field
```prisma
model User {
  // Remove the field from the model
  // Prisma will generate a migration to drop the column
}
```

### Changing Field Type
```prisma
model User {
  id String @id @default(cuid()) // Changed from Int to String
}
```

### Adding Relations
```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

## Troubleshooting

### Migration Conflicts
If you encounter conflicts, you may need to:
1. Resolve the conflict manually
2. Reset migrations in development: `npx prisma migrate reset`
3. Create a new migration: `npm run prisma:migrate`

### Schema Validation Errors
- Check for typos in field names and types
- Ensure required fields have defaults or are nullable
- Verify relation syntax is correct

### Database Connection Issues
- Check database connection string in `.env`
- Ensure database server is running
- Verify database permissions