// backend/config/database.js
import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export const connectMongoDB = async () => {
  try {
    // Check if already connected
    if (isConnected) {
      console.log('✅ MongoDB already connected');
      return mongoose.connection;
    }

    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      maxPoolSize: 50,
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    isConnected = true;

    console.log(`✅ [MongoDB Atlas] Successfully connected to database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port}`);

    // 🔹 Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB Error]', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB Warning] Disconnected from MongoDB. Attempting reconnect...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ [MongoDB] Reconnected successfully');
      isConnected = true;
    });

    // 🔹 Graceful shutdown
    const handleShutdown = async () => {
      try {
        await mongoose.connection.close();
        console.log('✅ [MongoDB Atlas] Connection closed due to application termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
    process.on('SIGQUIT', handleShutdown);

    return conn;

  } catch (error) {
    console.error('❌ [MongoDB Connection Failure]', error);
    console.error('   Please check:');
    console.error('   1. MongoDB is running');
    console.error('   2. Connection string is correct in .env');
    console.error('   3. Network connectivity');
    process.exit(1);
  }
};

// 🔹 Disconnect function
export const disconnectMongoDB = async () => {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error);
  }
};

// 🔹 Check connection status
export const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    readyStateText: getReadyStateText(mongoose.connection.readyState),
    databaseName: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
  };
};

// 🔹 Helper: Get ready state text
const getReadyStateText = (state) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
};

// 🔹 Export mongoose instance (if needed)
export { mongoose };

// 🔹 Default export
export default {
  connectMongoDB,
  disconnectMongoDB,
  getConnectionStatus,
  mongoose,
};