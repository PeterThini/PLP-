const db = require('../db'); // Import the database connection

// Get doctor details by username
exports.getDoctorByUsername = (username, callback) => {
    const sql = `SELECT * FROM doctors WHERE username = ?`;
    db.query(sql, [username], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Schedule doctor availability
exports.scheduleDoctor = (doctorId, availability, callback) => {
    const sql = `INSERT INTO doctor_schedule (doctor_id, availability) VALUES (?, ?)`;
    db.query(sql, [doctorId, availability], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};
