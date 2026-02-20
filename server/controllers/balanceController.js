const pool = require('../config/db');

const getBalance = async (req, res) => {
    // Middleware attaches user info to req.user (from JWT)
    const username = req.user.sub;

    try {
        const [rows] = await pool.query('SELECT balance FROM KoduSer WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ balance: rows[0].balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching balance' });
    }
};

module.exports = { getBalance };
