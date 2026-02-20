const pool = require('../config/db');

const getBalance = async (req, res) => {
    try {
        const username = req.user.sub;
        const [rows] = await pool.query('SELECT balance FROM KoduSer WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ balance: rows[0].balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const username = req.user.sub;
        // Fetch all details except password
        const [rows] = await pool.query('SELECT uid, username, email, phone, balance, role FROM KoduSer WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

module.exports = { getBalance, getProfile };
