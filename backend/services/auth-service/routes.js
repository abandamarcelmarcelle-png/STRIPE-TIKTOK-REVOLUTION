const express = require('express');
const router = express.Router();
const { signup, login, refresh, logout, verifyEmail, setupTwoFA } = require('./controller');
const { validateSignup, validateLogin } = require('./validation');
const { authenticate } = require('../../middleware/auth');

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/refresh', refresh);
router.post('/verify-email/:token', verifyEmail);
router.post('/2fa/setup', authenticate, setupTwoFA);

// Protected routes
router.post('/logout', authenticate, logout);

module.exports = router;
