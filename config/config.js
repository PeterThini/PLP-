module.exports = {
    server: {
        port: process.env.PORT || 3000,  // Default to port 3000
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'telemedicine_db',
    },
    session: {
        secret: process.env.SESSION_SECRET || 'your_secret_key',
    },
};
