const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, verifyToken, JWT_EXPIRE } = require('../middleware/auth');
const validator = require('validator');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Student or Company)
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      identityCardNumber,
      company,
      companyRegistration,
    } = req.body;

    // Validation
    const errors = {};

    if (!name || name.trim().length === 0) {
      errors.name = 'Name is required';
    }

    if (!email || !validator.isEmail(email)) {
      errors.email = 'Valid email is required';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!phone || !validator.isMobilePhone(phone)) {
      errors.phone = 'Valid phone number is required';
    }

    if (!role || !['student', 'company'].includes(role)) {
      errors.role = 'Role must be either student or company';
    }

    if (role === 'student' && !identityCardNumber) {
      errors.identityCardNumber = 'Identity Card Number is required for students';
    }

    if (role === 'company') {
      if (!company) {
        errors.company = 'Company name is required';
      }
      if (!companyRegistration) {
        errors.companyRegistration = 'Company registration number is required';
      }
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered. Please use a different email or login.',
      });
    }

    // Create user object
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone,
      role,
    };

    // Add role-specific fields
    if (role === 'student') {
      userData.identityCardNumber = identityCardNumber;
    } else if (role === 'company') {
      userData.company = company;
      userData.companyRegistration = companyRegistration;
    }

    // Create new user
    const user = await User.create(userData);

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        ...(role === 'student' && { identityCardNumber: user.identityCardNumber }),
        ...(role === 'company' && {
          company: user.company,
          companyRegistration: user.companyRegistration,
        }),
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);

    // Handle duplicate email from MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email and password
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    const errors = {};

    if (!email || !validator.isEmail(email)) {
      errors.email = 'Valid email is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Find user by email and include password field for verification
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Verify password
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Return success response without password
    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        ...(user.role === 'student' && { identityCardNumber: user.identityCardNumber }),
        ...(user.role === 'company' && {
          company: user.company,
          companyRegistration: user.companyRegistration,
        }),
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        ...(user.role === 'student' && { identityCardNumber: user.identityCardNumber }),
        ...(user.role === 'company' && {
          company: user.company,
          companyRegistration: user.companyRegistration,
        }),
      },
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token deletion)
 * @access  Private
 */
router.post('/logout', verifyToken, (req, res) => {
  // Token is handled client-side - this endpoint confirms logout
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;

    const updateData = {};

    if (name) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters',
        });
      }
      updateData.name = name.trim();
    }

    if (phone) {
      if (!validator.isMobilePhone(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number',
        });
      }
      updateData.phone = phone;
    }

    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
});

module.exports = router;
