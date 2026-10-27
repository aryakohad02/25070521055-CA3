const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or localhost Vite
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/influencers', require('./routes/influencerRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 404 Route Not Found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const DEFAULT_PORT = process.env.PORT || 5001;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 CollabBridge Backend Server running on port ${port}`);
    console.log(`🌐 Base URL: http://localhost:${port}/api`);
    console.log(`🩺 Health check: http://localhost:${port}/api/health`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(port) + 1;
      console.warn(`[Port Conflict] Port ${port} is in use (e.g. macOS AirPlay Receiver). Retrying on port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('[Server Error]', err);
    }
  });
};

startServer(DEFAULT_PORT);

module.exports = app;
