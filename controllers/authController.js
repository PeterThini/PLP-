const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const flash = require('connect-flash');

// Registration Route with Validation
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(error => error.msg).join(', '));
        return res.redirect('/register');
    }

    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [username, email, hashedPassword, role], (err, result) => {
        if (err) {
            req.flash('error', 'User registration failed.');
            return res.redirect('/register');
        }
        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/login');
    });
};

// Login Route with Flash Messages
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ?`;

    db.query(sql, [username], async (err, results) => {
        if (err) {
            req.flash('error', 'An error occurred while fetching user data.');
            return res.redirect('/login');
        }

        if (results.length > 0) {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { username: user.username, role: user.role };
                req.flash('success', 'Login successful!');
                res.redirect(user.role === 'patient' ? '/patient_dashboard' : '/doctor_dashboard');
            } else {
                req.flash('error', 'Invalid password.');
                res.redirect('/login');
            }
        } else {
            req.flash('error', 'No user found with this username.');
            res.redirect('/login');
        }
    });
};

// Logout Route
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
};

const userModel = require('../models/userModel'); // Import user model

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(error => error.msg).join(', '));
        return res.redirect('/register');
    }

    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use model to create user
    userModel.createUser(username, email, hashedPassword, role, (err, result) => {
        if (err) {
            req.flash('error', 'User registration failed.');
            return res.redirect('/register');
        }
        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/login');
    });
};
