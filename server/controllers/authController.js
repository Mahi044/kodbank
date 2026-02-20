const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { uid, username, password, email, phone } = req.body;
    const role = 'customer';
    const balance = 100000;

    try {
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM KoduSer WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await pool.query(
            'INSERT INTO KoduSer (uid, username, email, password, balance, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uid, username, email, hashedPassword, balance, phone, role]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM KoduSer WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { sub: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Store Token in DB
        const expiry = new Date(Date.now() + 3600000); // 1 hour
        await pool.query(
            'INSERT INTO UserToken (token, uid, expairy) VALUES (?, ?, ?)',
            [token, user.uid, expiry]
        );

        // Send Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: 'Login successful', role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { register, login };
