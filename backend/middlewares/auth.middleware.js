// backend/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import Model from '../models/Model.js';
import Admin from '../models/Admin.js';

// 🔹 Extract token helper
const extractToken = (req) => {
  // 1. Check cookies
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  
  // 2. Check admin cookie
  if (req.cookies?.adminToken) {
    return req.cookies.adminToken;
  }
  
  // 3. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // 4. Check query param
  if (req.query?.token) {
    return req.query.token;
  }
  
  return null;
};

// 🔹 Strict Authentication (Required)
export const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    
    // Check if it's an admin token
    let user = null;
    if (decoded.role === 'super_admin' || decoded.role === 'admin' || decoded.role === 'sub_admin') {
      user = await Admin.findById(decoded.id).select('-password');
      if (user) {
        req.user = { ...user.toObject(), isAdmin: true };
        return next();
      }
    }
    
    // Check if it's a model token
    user = await Model.findById(decoded.id).select('-password');
    if (user) {
      req.user = { ...user.toObject(), isAdmin: false };
      return next();
    }
    
    return res.status(401).json({
      success: false,
      message: 'User not found. Invalid token.',
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// 🔹 Optional Authentication (Guest allowed)
export const protectOptional = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    
    let user = null;
    if (decoded.role === 'super_admin' || decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
      if (user) {
        req.user = { ...user.toObject(), isAdmin: true };
        return next();
      }
    }
    
    user = await Model.findById(decoded.id).select('-password');
    req.user = user ? { ...user.toObject(), isAdmin: false } : null;
    next();

  } catch (error) {
    req.user = null;
    next();
  }
};

export const authOptional = protectOptional;