const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',  // Use environment variable for host
    user: process.env.DB_USER || 'root',      // Use environment variable for user
    password: process.env.DB_PASSWORD || '',  // Use environment variable for password
    database: process.env.DB_NAME || 'telemedicine_db' // Use environment variable for database
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1); // Exit the application if database connection fails
    }
    console.log('Connected to the database');
});

module.exports = db;  // Export the connection for use in other parts of the app
