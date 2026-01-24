const express = require('express');
const jwt = require('jwt-simple');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return jwt.encode({ userId, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) }, secret);
};

// @route   POST /api/auth/register
// @desc    Register a new user (manual registration)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, birthday, location, phoneNumber, role, identityCardNumber, company, companyRegistration } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Validate role-specific fields if role is provided
    if (role === 'student' && !identityCardNumber) {
      return res.status(400).json({
        success: false,
        message: 'Identity card number is required for students',
      });
    }

    if (role === 'company' && (!company || !companyRegistration)) {
      return res.status(400).json({
        success: false,
        message: 'Company name and registration number are required for companies',
      });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      birthday: birthday || null,
      location: location || null,
      phoneNumber: phoneNumber || null,
      role: role || 'student',
    };

    if (role === 'student') {
      userData.identityCardNumber = identityCardNumber;
    } else if (role === 'company') {
      userData.company = company;
      userData.companyRegistration = companyRegistration;
    }

    const newUser = new User(userData);
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        birthday: newUser.birthday,
        location: newUser.location,
        phoneNumber: newUser.phoneNumber,
        profilePicture: newUser.profilePicture,
        role: newUser.role,
        ...(role === 'student' && { identityCardNumber: newUser.identityCardNumber }),
        ...(role === 'company' && {
          company: newUser.company,
          companyRegistration: newUser.companyRegistration,
        }),
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/signup
// @desc    Register a new user (legacy endpoint - redirect to /register)
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role, identityCardNumber, company, companyRegistration } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Validate role-specific fields
    if (role === 'student' && !identityCardNumber) {
      return res.status(400).json({
        success: false,
        message: 'Identity card number is required for students',
      });
    }

    if (role === 'company' && (!company || !companyRegistration)) {
      return res.status(400).json({
        success: false,
        message: 'Company name and registration number are required for companies',
      });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      phone,
      role,
    };

    if (role === 'student') {
      userData.identityCardNumber = identityCardNumber;
    } else {
      userData.company = company;
      userData.companyRegistration = companyRegistration;
    }

    const newUser = new User(userData);
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        ...(role === 'student' && { identityCardNumber: newUser.identityCardNumber }),
        ...(role === 'company' && {
          company: newUser.company,
          companyRegistration: newUser.companyRegistration,
        }),
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user registered with Google
    if (user.googleId && !user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google Sign-In. Please login with Google.',
      });
    }

    // Ensure user has a password set
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        location: user.location,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        phone: user.phone,
        role: user.role,
        ...(user.role === 'student' && { identityCardNumber: user.identityCardNumber }),
        ...(user.role === 'company' && {
          company: user.company,
          companyRegistration: user.companyRegistration,
        }),
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error during login',
      error: err.message,
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required',
      });
    }

    // Verify the Google token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error('Google token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token',
        error: error.message,
      });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // User exists - login
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      // Update profile picture if changed
      if (picture && user.profilePicture !== picture) {
        user.profilePicture = picture;
        await user.save();
      }
    } else {
      // User doesn't exist - create new user
      user = new User({
        name,
        email,
        googleId,
        profilePicture: picture || null,
        role: 'student', // Default role
      });

      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: user.googleId === googleId ? 'Login successful' : 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        location: user.location,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        phone: user.phone,
        role: user.role,
        googleId: user.googleId,
        ...(user.role === 'student' && { identityCardNumber: user.identityCardNumber }),
        ...(user.role === 'company' && {
          company: user.company,
          companyRegistration: user.companyRegistration,
        }),
      },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error during Google authentication',
      error: err.message,
    });
  }
});

// @route   GET /api/auth/user
// @desc    Get current user (requires token)
// @access  Private
router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.decode(token, secret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ...(user.role === 'student' && { identityCardNumber: user.identityCardNumber }),
        ...(user.role === 'company' && {
          company: user.company,
          companyRegistration: user.companyRegistration,
        }),
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: err.message,
    });
  }
});

module.exports = router;
