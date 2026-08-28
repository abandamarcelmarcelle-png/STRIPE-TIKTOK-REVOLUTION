require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const redis = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./services/auth-service/routes'));
app.use('/api/videos', require('./services/video-service/routes'));
app.use('/api/social', require('./services/social-service/routes'));
app.use('/api/users', require('./services/user-service/routes'));

// WebSocket (Real-time)
require('./services/messaging-service/socket')(io);
require('./services/collab-service/socket')(io);

// Redis Adapter for Socket.io (for horizontal scaling)
const pubClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
pubClient.connect().catch(err => logger.warn('Redis pub client connection failed:', err));

const subClient = pubClient.duplicate();
subClient.connect().catch(err => logger.warn('Redis sub client connection failed:', err));

io.adapter(createAdapter(pubClient, subClient));

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = server;
