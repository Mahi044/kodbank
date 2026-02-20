const pool = require('./config/db');

const initDb = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS KoduSer (
                uid INT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                balance DECIMAL(15, 2) DEFAULT 100000.00,
                phone VARCHAR(20),
                role VARCHAR(20) DEFAULT 'customer'
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS UserToken (
                tid INT AUTO_INCREMENT PRIMARY KEY,
                token TEXT NOT NULL,
                uid INT NOT NULL,
                expairy DATETIME NOT NULL,
                FOREIGN KEY (uid) REFERENCES KoduSer(uid) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS OtpStore (
                email VARCHAR(255) PRIMARY KEY,
                otp VARCHAR(10) NOT NULL,
                expires_at DATETIME NOT NULL
            )
        `);
        console.log("✅ Database tables checked/initialized successfully.");
    } catch (error) {
        console.error("❌ Error initializing database tables:", error);
    } finally {
        connection.release();
    }
};

module.exports = initDb;
