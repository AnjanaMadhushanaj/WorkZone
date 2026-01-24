const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if googleId is not present
      return !this.googleId;
    },
    minlength: 6,
    select: false, // Don't return password by default
  },
  birthday: {
    type: Date,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
    sparse: true, // Allows multiple null values but unique non-null values
  },
  profilePicture: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['student', 'company'],
    default: 'student',
  },
  // Student-specific fields
  identityCardNumber: {
    type: String,
    default: null,
  },
  // Company-specific fields
  company: {
    type: String,
    default: null,
  },
  companyRegistration: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified and exists
  if (!this.isModified('password') || !this.password) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  // If no password is set, return false
  if (!this.password) {
    return false;
  }
  
  // If no entered password, return false
  if (!enteredPassword) {
    return false;
  }
  
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to return user without sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
