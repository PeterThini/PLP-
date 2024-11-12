const express = require('express');
const { patientDashboard, doctorDashboard, healthCenterLocator } = require('../controllers/dashboardController');
const router = express.Router();

// Patient Dashboard Route
router.get('/patient_dashboard', patientDashboard);

// Doctor Dashboard Route
router.get('/doctor_dashboard', doctorDashboard);

// Health Center Locator Route
router.get('/health_center_locator', healthCenterLocator);

module.exports = router;
