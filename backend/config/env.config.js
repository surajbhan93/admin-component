// backend/config/env.config.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

class EnvironmentConfig {
  constructor() {
    this.validateEnv();
  }

  validateEnv() {
    const required = ['MONGODB_URI', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn(`⚠️ Missing required env vars: ${missing.join(', ')}`);
      console.warn('⚠️ Application may not work correctly!');
    }
  }

  get(key, defaultValue = null) {
    return process.env[key] || defaultValue;
  }

  getNumber(key, defaultValue = 0) {
    return parseInt(this.get(key, defaultValue));
  }

  getBoolean(key, defaultValue = false) {
    const value = this.get(key, 'false');
    return value.toLowerCase() === 'true' || value === '1';
  }

  get PORT() {
    return this.getNumber('PORT', 5000);
  }

  get NODE_ENV() {
    return this.get('NODE_ENV', 'development');
  }

  get MONGODB_URI() {
    return this.get('MONGODB_URI', 'mongodb://localhost:27017/modeling_agency_db');
  }

  get JWT_SECRET() {
    return this.get('JWT_SECRET', 'fallback_jwt_secret');
  }

  get JWT_REFRESH_SECRET() {
    return this.get('JWT_REFRESH_SECRET', 'fallback_jwt_refresh_secret');
  }

  get JWT_EXPIRES_IN() {
    return this.get('JWT_EXPIRES_IN', '7d');
  }

  get JWT_REFRESH_EXPIRES_IN() {
    return this.get('JWT_REFRESH_EXPIRES_IN', '30d');
  }

  get CLIENT_URL() {
    return this.get('CLIENT_URL', 'http://localhost:3000');
  }

  get RAZORPAY_KEY_ID() {
    return this.get('RAZORPAY_KEY_ID', '');
  }

  get RAZORPAY_KEY_SECRET() {
    return this.get('RAZORPAY_KEY_SECRET', '');
  }

  get SMTP_HOST() {
    return this.get('SMTP_HOST', '');
  }

  get SMTP_PORT() {
    return this.getNumber('SMTP_PORT', 587);
  }

  get SMTP_USER() {
    return this.get('SMTP_USER', '');
  }

  get SMTP_PASS() {
    return this.get('SMTP_PASS', '');
  }

  get EMAIL_FROM() {
    return this.get('EMAIL_FROM', 'noreply@modelingagency.com');
  }

  get CLOUDINARY_CLOUD_NAME() {
    return this.get('CLOUDINARY_CLOUD_NAME', '');
  }

  get CLOUDINARY_API_KEY() {
    return this.get('CLOUDINARY_API_KEY', '');
  }

  get CLOUDINARY_API_SECRET() {
    return this.get('CLOUDINARY_API_SECRET', '');
  }

  get ADMIN_EMAIL() {
    return this.get('ADMIN_EMAIL', 'admin@modelingagency.com');
  }

  get ADMIN_PASSWORD() {
    return this.get('ADMIN_PASSWORD', 'Admin@123456');
  }

  get LOG_LEVEL() {
    return this.get('LOG_LEVEL', 'info');
  }

  get API_VERSION() {
    return this.get('API_VERSION', 'v1');
  }

  // 🔹 Get all config as object
  getAll() {
    return {
      PORT: this.PORT,
      NODE_ENV: this.NODE_ENV,
      MONGODB_URI: this.MONGODB_URI,
      JWT_SECRET: this.JWT_SECRET,
      JWT_REFRESH_SECRET: this.JWT_REFRESH_SECRET,
      JWT_EXPIRES_IN: this.JWT_EXPIRES_IN,
      JWT_REFRESH_EXPIRES_IN: this.JWT_REFRESH_EXPIRES_IN,
      CLIENT_URL: this.CLIENT_URL,
      RAZORPAY_KEY_ID: this.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: this.RAZORPAY_KEY_SECRET,
      SMTP: {
        HOST: this.SMTP_HOST,
        PORT: this.SMTP_PORT,
        USER: this.SMTP_USER,
        PASS: this.SMTP_PASS,
        FROM: this.EMAIL_FROM,
      },
      CLOUDINARY: {
        CLOUD_NAME: this.CLOUDINARY_CLOUD_NAME,
        API_KEY: this.CLOUDINARY_API_KEY,
        API_SECRET: this.CLOUDINARY_API_SECRET,
      },
      ADMIN: {
        EMAIL: this.ADMIN_EMAIL,
        PASSWORD: this.ADMIN_PASSWORD,
      },
      LOG_LEVEL: this.LOG_LEVEL,
      API_VERSION: this.API_VERSION,
    };
  }
}

// 🔹 Singleton instance
const envConfig = new EnvironmentConfig();

export default envConfig;
export { EnvironmentConfig };