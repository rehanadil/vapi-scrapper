FROM node:18-bullseye-slim

# Install PostgreSQL client and OpenSSL
RUN apt-get update && apt-get install -y postgresql-client openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev dependencies for build
RUN npm ci

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Generate Prisma client for linux platform before copying source
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies but keep production ones
RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
