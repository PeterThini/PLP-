require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const db = require('./db'); // Import the MySQL connection
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const session = require('express-session');
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator'); // Validation

const app = express(); // Initialize app here

app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use `true` if you're using HTTPS
}));

app.use(flash()); // Use flash after session is initialized

// Route for the Landing Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/landing.html');
});

// Registration Route with Validation
app.post('/submit_registration', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
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
});

// Login Route with Flash Messages
app.post('/authenticate', (req, res) => {
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
});

// Helper function for role-based access
function checkAuth(role) {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.redirect('/login');
        }
    };
}

// Patient Dashboard (only accessible to 'patient' role)
app.get('/patient_dashboard', checkAuth('patient'), (req, res) => {
    res.sendFile(__dirname + '/views/patient_dashboard.html');
});

// Doctor Dashboard (only accessible to 'doctor' role)
app.get('/doctor_dashboard', checkAuth('doctor'), (req, res) => {
    res.sendFile(__dirname + '/views/doctor_dashboard.html');
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

// Health Center Locator
app.get('/health_center_locator', (req, res) => {
    res.sendFile(__dirname + '/views/health_center_locator.html');
});

// Server configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
