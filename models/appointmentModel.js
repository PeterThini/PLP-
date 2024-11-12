const db = require('../db'); // Import the database connection

// Create a new appointment
exports.createAppointment = (patientId, doctorId, appointmentTime, callback) => {
    const sql = `INSERT INTO appointments (patient_id, doctor_id, appointment_time) VALUES (?, ?, ?)`;
    db.query(sql, [patientId, doctorId, appointmentTime], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Get appointments for a patient
exports.getAppointmentsByPatient = (patientId, callback) => {
    const sql = `SELECT * FROM appointments WHERE patient_id = ?`;
    db.query(sql, [patientId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Get appointments for a doctor
exports.getAppointmentsByDoctor = (doctorId, callback) => {
    const sql = `SELECT * FROM appointments WHERE doctor_id = ?`;
    db.query(sql, [doctorId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};
