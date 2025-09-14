#!/bin/bash

echo "🚀 Assistant Metrics Dashboard Setup"
echo "===================================="
echo

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this script from the rehan-vs directory"
    exit 1
fi

echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
else
    echo "✅ Node.js $(node --version)"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
else
    echo "✅ npm $(npm --version)"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed or not running"
    echo "   You can still run manually with PostgreSQL"
else
    echo "✅ Docker available"
fi

echo
echo "🔨 Setting up the project..."

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo "Generating Prisma client..."
npx prisma generate

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

cd ..

echo
echo "✅ Setup complete!"
echo
echo "🐳 Next steps with Docker:"
echo "1. Make sure Docker Desktop is running"
echo "2. Run: docker-compose up -d"
echo "3. Visit: http://localhost:3000"
echo
echo "🔧 Or run manually:"
echo "1. Start PostgreSQL with TimescaleDB"
echo "2. In backend/: npm run start:dev"
echo "3. In frontend/: npm start"
echo
echo "🎯 Test credentials:"
echo "   Email: john@example.com"
echo "   Password: password123"
