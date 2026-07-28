// backend/routes/admin.routes.js
import { Router } from 'express';
import {
  createSuperAdmin,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  adminLogout,
  forgotPassword,
  resetPassword,
} from '../controllers/admin/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/adminOnly.js';

const router = Router();

// ============================================
// 🔹 PUBLIC ROUTES (No auth required)
// ============================================

// ✅ Create Super Admin - PUBLIC (No auth)
router.post('/create-super-admin', createSuperAdmin);
// Admin Login
router.post('/login', adminLogin);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// ============================================
// 🔹 PROTECTED ROUTES (Auth required)
// ============================================

// Get admin profile
router.get('/profile/me', authMiddleware, adminOnly, getAdminProfile);

// Update admin profile
router.put('/profile/me', authMiddleware, adminOnly, updateAdminProfile);

// Change password
router.put('/change-password', authMiddleware, adminOnly, changeAdminPassword);

// Logout
router.post('/logout', authMiddleware, adminOnly, adminLogout);

export default router;