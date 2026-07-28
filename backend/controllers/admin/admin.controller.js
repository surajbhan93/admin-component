// backend/controllers/admin.controller.js
import Admin from '../../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env.js';

// ============================================
// 🔹 CREATE SUPER ADMIN (First time setup)
// ============================================

export const createSuperAdmin = async (req, res) => {
  try {
    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Super Admin already exists. Please login.',
      });
    }

    // Get super admin credentials from .env
    // const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_PHONE } = ENV.ADMIN;
    // Get super admin credentials from ENV
const ADMIN_EMAIL = ENV.ADMIN.EMAIL;
const ADMIN_PASSWORD = ENV.ADMIN.PASSWORD;
const ADMIN_NAME = ENV.ADMIN.NAME;
const ADMIN_PHONE = ENV.ADMIN.PHONE;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'Admin credentials not found in .env file. Please set ADMIN_EMAIL and ADMIN_PASSWORD.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create super admin
    const superAdmin = new Admin({
      name: ADMIN_NAME || 'Super Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phone: ADMIN_PHONE || '9999999999',
      role: 'super_admin',
      isVerified: true,
      isActive: true,
      permissions: ['all'],
    });

    await superAdmin.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: superAdmin._id, 
        role: superAdmin.role, 
        email: superAdmin.email,
        isSuperAdmin: true 
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Super Admin created successfully!',
      token,
      admin: superAdmin.toJSON(),
    });

  } catch (error) {
    console.error('Create Super Admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Super Admin',
      error: error.message,
    });
  }
};

// ============================================
// 🔹 ADMIN LOGIN
// ============================================

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact super admin.',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: admin._id, 
        role: admin.role, 
        email: admin.email,
        isSuperAdmin: admin.role === 'super_admin'
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN || '7d' }
    );

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Admin login successful!',
      token,
      admin: admin.toJSON(),
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// ============================================
// 🔹 GET ADMIN PROFILE
// ============================================

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.json({
      success: true,
      admin,
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

// ============================================
// 🔹 UPDATE ADMIN PROFILE
// ============================================

export const updateAdminProfile = async (req, res) => {
  try {
    const updates = req.body;
    const adminId = req.user.id;

    // Remove sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.isActive;
    delete updates.isVerified;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      admin,
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// ============================================
// 🔹 CHANGE ADMIN PASSWORD
// ============================================

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully!',
    });

  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

// ============================================
// 🔹 ADMIN LOGOUT
// ============================================

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('adminToken');
    res.json({
      success: true,
      message: 'Logged out successfully!',
    });

  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

// ============================================
// 🔹 FORGOT PASSWORD (Optional)
// ============================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found with this email',
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: admin._id },
      ENV.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // TODO: Send email with reset link
    // For now, return token in response (for testing)
    res.json({
      success: true,
      message: 'Password reset token generated',
      resetToken,
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request',
      error: error.message,
    });
  }
};

// ============================================
// 🔹 RESET PASSWORD (Optional)
// ============================================

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Update password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({
      success: true,
      message: 'Password reset successfully!',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};