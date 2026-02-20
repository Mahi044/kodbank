const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify JWT signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Verify token in DB (Extra Security Check as requested)
        const [tokens] = await pool.query('SELECT * FROM UserToken WHERE token = ?', [token]);
        if (tokens.length === 0) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Check if expired in DB (optional since JWT handles expiry, but good practice per requirement)
        const dbToken = tokens[0];
        if (new Date(dbToken.expairy) < new Date()) {
            return res.status(401).json({ message: 'Token expired.' });
        }

        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken;
