// backend/middlewares/adminOnly.js
export const adminOnly = (req, res, next) => {
  // Check if user exists
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.',
    });
  }

  // Check if user has admin role (including super_admin)
  const adminRoles = ['super_admin', 'admin', 'sub_admin'];
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

// 🔹 Super Admin only middleware
export const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.',
    });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin privileges required.',
    });
  }

  next();
};