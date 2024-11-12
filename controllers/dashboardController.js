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

exports.patientDashboard = (req, res) => {
    res.sendFile(__dirname + '/views/patient_dashboard.html');
};

exports.doctorDashboard = (req, res) => {
    res.sendFile(__dirname + '/views/doctor_dashboard.html');
};

exports.healthCenterLocator = (req, res) => {
    res.sendFile(__dirname + '/views/health_center_locator.html');
};
