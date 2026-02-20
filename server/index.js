const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*', // Allow all origins for Vercel deployment
    credentials: true
}));

const pool = require('./config/db');
const initDb = require('./initDb');

// Initialize DB
initDb();

// Root Route
app.get('/', (req, res) => {
    res.send('Kodbank API is running');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const otpRoutes = require('./routes/otpRoutes');

app.use('/auth', authRoutes);
app.use('/auth', otpRoutes); // Mounts /auth/send-otp, etc.
app.use('/api', balanceRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
