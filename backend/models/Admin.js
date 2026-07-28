// backend/models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  // 🔹 Personal Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
  },

  // 🔹 Role & Permissions
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'sub_admin'],
    default: 'admin',
  },
  permissions: {
    type: [String],
    default: [],
  },

  // 🔹 Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },

  // 🔹 Profile
  profileImage: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 500,
  },

  // 🔹 System Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// 🔹 Indexes
adminSchema.index({ email: 1 });
adminSchema.index({ phone: 1 });
adminSchema.index({ role: 1 });

// 🔹 Remove password when sending response
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;