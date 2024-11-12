const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

// Registration Route
router.post('/submit_registration', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], register);

// Login Route
router.post('/authenticate', login);

// Logout Route
router.get('/logout', logout);

module.exports = router;
