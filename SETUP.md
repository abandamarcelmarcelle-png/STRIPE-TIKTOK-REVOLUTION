# Setup & Installation Guide

## Prerequisites

```bash
# Node.js 18+
node --version

# Python 3.9+
python --version

# Docker & Docker Compose
docker --version
docker-compose --version

# PostgreSQL 15+
psql --version

# Redis 7+
redis-cli --version
```

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/abandamarcelmarcelle-png/STRIPE-TIKTOK-REVOLUTION.git
cd STRIPE-TIKTOK-REVOLUTION
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your config
```

### 3. Docker Compose (All services)
```bash
docker-compose up -d

# Check services
docker-compose ps
```

### 4. Database Migrations
```bash
cd backend
npm install
npm run migrate
```

### 5. Frontend Development
```bash
cd frontend/web
npm install
npm run dev

# Open http://localhost:5173
```

### 6. Backend Development
```bash
cd backend
npm run dev

# API available at http://localhost:3001
```

## Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Load tests
npm run test:load
```

## API Documentation

Once running, access Swagger UI:
```
http://localhost:3001/api-docs
```
