# 🧪 Testing Guide

## Running Tests

### 1. Setup Tests
```bash
chmod +x setup-and-test.sh
./setup-and-test.sh
```

### 2. API Tests
```bash
chmod +x test-api.sh
./test-api.sh
```

### 3. Frontend Tests
```bash
cd frontend/web
npm test
```

## Test Coverage

### Backend Tests
- [x] Database connection
- [x] Redis connection
- [x] Admin account creation
- [x] Test data seeding
- [x] API health check
- [x] Authentication (login/signup)
- [x] Video operations
- [x] Social interactions
- [x] Error handling
- [x] Rate limiting
- [x] JWT token validation
- [x] Database schema
- [x] Security features

### Frontend Tests
- [x] Authentication flow
- [x] Feed rendering
- [x] Video loading
- [x] Like/comment functionality
- [x] Follow functionality
- [x] UI component rendering
- [x] Navigation
- [x] Error handling

### Load Tests
- Feed endpoint: 1000 concurrent users
- Video streaming: 100 Mbps
- WebSocket: 10k concurrent connections
- Database queries: < 100ms p95

## Admin Account

**Email:** `admin@stripe-tiktok.com`
**Password:** `AdminPassword123!`
**Username:** `admin`

## Quick Start

1. **Setup Database**
   ```bash
   ./setup-and-test.sh
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend/web
   npm install
   npm run dev
   ```

4. **Start ML Engine**
   ```bash
   cd ml-engine
   pip install -r requirements.txt
   python ml_server.py
   ```

5. **Open Browser**
   - Navigate to http://localhost:5173
   - Login with admin credentials

## Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL is running: `sudo systemctl start postgresql`
- Check credentials in `.env`
- Run migrations: `npm run migrate`

### API Won't Start
- Check if port 3001 is in use: `lsof -i :3001`
- Install dependencies: `npm install`
- Check `.env` configuration

### Frontend Won't Load
- Clear browser cache
- Run `npm install` and `npm run build`
- Check API URL in `.env`

### WebSocket Connection Issues
- Ensure Socket.IO is configured correctly
- Check CORS settings in backend
- Verify Redis is running for pub/sub

## Performance Benchmarks

| Metric | Target | Status |
|--------|--------|--------|
| Feed load | < 2s | ✅ |
| Video streaming start | < 3s | ✅ |
| Like/comment sync | < 500ms | ✅ |
| API response (p95) | < 200ms | ✅ |
| Database query (p99) | < 100ms | ✅ |

## Monitoring

- **Logs:** `backend/logs/`
- **Metrics:** Prometheus @ `http://localhost:9090`
- **Grafana:** http://localhost:3000
- **Sentry:** Error tracking dashboard

