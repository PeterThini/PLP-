const db = require('../db'); // Import the database connection

// Get patient details by username
exports.getPatientByUsername = (username, callback) => {
    const sql = `SELECT * FROM patients WHERE username = ?`;
    db.query(sql, [username], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Create a new patient profile
exports.createPatient = (userId, address, phone, callback) => {
    const sql = `INSERT INTO patients (user_id, address, phone) VALUES (?, ?, ?)`;
    db.query(sql, [userId, address, phone], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};
