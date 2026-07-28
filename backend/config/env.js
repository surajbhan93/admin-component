// backend/config/env.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ YEH LINE ZAROORI HAI
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const ENV = {
  // Server
  PORT: parseInt(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/modeling_agency_db',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_change_this',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback_jwt_refresh_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // CORS
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // 🔥 Admin Credentials (For Super Admin Creation)
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL || 'admin@modelingagency.com',
    PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123456',
    NAME: process.env.ADMIN_NAME || 'Super Admin',
    PHONE: process.env.ADMIN_PHONE || '9999999999',
  },
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  
  // Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  
  // SMTP
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@modelingagency.com',
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
}

export default ENV;