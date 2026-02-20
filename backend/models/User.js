const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      validate: [validator.isMobilePhone, 'Please provide a valid phone number'],
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'company'],
        message: 'Role must be either student or company',
      },
      required: [true, 'Please specify a role'],
    },
    // Student specific fields
    identityCardNumber: {
      type: String,
      sparse: true, // Allow null for company users
    },
    // Company specific fields
    company: {
      type: String,
      sparse: true,
    },
    companyRegistration: {
      type: String,
      sparse: true,
    },
    // Common fields
    profilePicture: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user data without sensitive info
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Prevent duplicate email on update
userSchema.pre('findByIdAndUpdate', async function () {
  if (this.getUpdate().email) {
    const existingUser = await mongoose.model('User').findOne({
      email: this.getUpdate().email,
      _id: { $ne: this.getFilter()._id },
    });
    if (existingUser) {
      throw new Error('Email is already in use');
    }
  }
});

module.exports = mongoose.model('User', userSchema);
