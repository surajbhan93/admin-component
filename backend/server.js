// backend/server.js
import dotenv from "dotenv";

dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { connectMongoDB } from './config/database.js';

// Import routes
import adminRoutes from './routes/admin.routes.js'; // 👈 New
import modelRoutes from './routes/model.routes.js';
import adminModelRoutes from './routes/admin.model.routes.js';

const app = express();

// ============================================
// 🔹 SECURITY MIDDLEWARES
// ============================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: "http://localhost:3005"|| '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ============================================
// 🔹 RATE LIMITER
// ============================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ============================================
// 🔹 REQUEST PARSING
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================
// 🔹 HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
    database: {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name || 'not connected',
    },
  });
});

// ============================================
// 🔹 ROUTES
// ============================================

// Model routes
app.use('/api/models', modelRoutes);

// Admin routes
app.use('/api/admin/models', adminModelRoutes);
// Admin Model management routes
app.use('/api/admin/', adminRoutes);
// ============================================
// 🔹 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================
// 🔹 GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ============================================
// 🔹 START SERVER
// ============================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Start Express server
    app.listen(ENV.PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 [Enterprise MongoDB Backend] Engine online`);
      console.log(`📦 Environment: ${ENV.NODE_ENV}`);
      console.log(`🔌 Port: ${ENV.PORT}`);
      console.log(`👤 Models API: http://localhost:${ENV.PORT}/api/models`);
      console.log(`👑 Admin API: http://localhost:${ENV.PORT}/api/admin/models`);
      console.log(`❤️  Health: http://localhost:${ENV.PORT}/health`);
      console.log(`====================================================`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Import mongoose for health check
import mongoose from 'mongoose';

startServer();

export default app;