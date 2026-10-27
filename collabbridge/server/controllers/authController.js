const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');

// Generate JWT token helper
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'collabbridge_super_secure_jwt_secret_key_2026_dev',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user (Brand or Influencer)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, password, and account role.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (!['brand', 'influencer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either brand or influencer.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role
    });

    // If influencer, initialize their InfluencerProfile
    if (role === 'influencer') {
      await InfluencerProfile.create({
        userId: user._id,
        bio: `Hi, I'm ${user.name}! Excited to collaborate with great brands.`,
        niche: 'Lifestyle',
        location: '',
        followerCount: 0,
        engagementRate: 0,
        collaborationPrice: 0,
        profileImage: '',
        socialLinks: { instagram: '', youtube: '', twitter: '', tiktok: '', website: '' }
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log in existing user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user info
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    let profile = null;
    if (req.user.role === 'influencer') {
      profile = await InfluencerProfile.findOne({ userId: req.user._id });
    }

    res.json({
      success: true,
      user: req.user,
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update basic user profile (name)
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateDetails
};
