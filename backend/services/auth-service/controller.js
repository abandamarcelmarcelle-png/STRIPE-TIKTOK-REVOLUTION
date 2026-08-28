const db = require('../../db/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const logger = require('../../utils/logger');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

// Signup
const signup = async (req, res, next) => {
  try {
    const { email, username, password, phone } = req.body;

    // Check if user exists
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email or username already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, username, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING id, email, username',
      [email, username, passwordHash, phone]
    );

    const user = result.rows[0];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Send verification email
    const verificationToken = jwt.sign(
      { userId: user.id, type: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await transporter.sendMail({
      to: email,
      subject: 'Verify your STRIPE-TIKTOK account',
      html: `Click here to verify: ${process.env.FRONTEND_URL}/verify/${verificationToken}`
    });

    logger.info(`User signed up: ${user.id}`);

    res.status(201).json({
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user
    const result = await db.query(
      'SELECT id, email, username, password_hash, avatar_url, verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    logger.info(`User logged in: ${user.id}`);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
        verified: user.verified
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { accessToken: newAccessToken } = generateTokens(decoded.userId);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    // Optional: invalidate refresh token in DB
    logger.info(`User logged out: ${req.user.id}`);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Verify email
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await db.query(
      'UPDATE users SET verified = true, verified_at = NOW() WHERE id = $1',
      [decoded.userId]
    );

    logger.info(`Email verified: ${decoded.userId}`);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

// Setup 2FA
const setupTwoFA = async (req, res, next) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `STRIPE-TIKTOK (${req.user.email})`
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode,
      backupCodes: Array.from({ length: 10 }, () => Math.random().toString(36).substring(7))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
  verifyEmail,
  setupTwoFA
};
