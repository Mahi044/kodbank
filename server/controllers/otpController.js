const pool = require('../config/db');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (req, res) => {
    const { email, type } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Check if email already exists for registration
    if (type === 'register') {
        const [existing] = await pool.query('SELECT * FROM KoduSer WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }
    } else if (type === 'reset') {
        const [existing] = await pool.query('SELECT * FROM KoduSer WHERE email = ?', [email]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Email not registered. Please register first.' });
        }
    }

    const otp = generateOTP();
    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60000);

    try {
        // Upsert OTP (Update if exists, Insert if new)
        // MySQL ON DUPLICATE KEY UPDATE
        await pool.query(
            `INSERT INTO OtpStore (email, otp, expires_at) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)`,
            [email, otp, expiresAt]
        );

        console.log(`[DEV ONLY] OTP for ${email}: ${otp}`); // Log OTP for easy testing
        const fs = require('fs');
        // Async write to verify it doesn't block response
        fs.writeFile('otp.txt', `OTP for ${email}: ${otp}`, (err) => {
            if (err) console.error("Failed to log OTP:", err);
        });

        // Customize Email Content
        let subject = 'Your Kodbank OTP';
        let text = `Your Verification Code is: ${otp}`;

        if (type === 'reset') {
            subject = 'Reset Your Kodbank Password';
            text = `You requested a password reset. Use this code to proceed: ${otp}\n\nIf you did not request this, please ignore this email.`;
        } else {
            subject = 'Verify Your Email - Kodbank';
            text = `Welcome to Kodbank! Your verification code is: ${otp}`;
        }

        // Send Email (MUST await in Serverless to ensure delivery)
        await sendEmail(email, subject, text);
        console.log("OTP Email Sent Successfully");

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error("OTP Send Error:", error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM OtpStore WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'No OTP found for this email' });
        }

        const storedOtp = rows[0];

        if (new Date() > new Date(storedOtp.expires_at)) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP Valid
        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error("OTP Verify Error:", error);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Verify OTP again (Secure approach)
    try {
        const [rows] = await pool.query('SELECT * FROM OtpStore WHERE email = ?', [email]);
        if (rows.length === 0 || rows[0].otp !== otp || new Date() > new Date(rows[0].expires_at)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update User Password
        const [result] = await pool.query('UPDATE KoduSer SET password = ? WHERE email = ?', [hashedPassword, email]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cleanup OTP
        await pool.query('DELETE FROM OtpStore WHERE email = ?', [email]);

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Server error resetting password' });
    }
};

module.exports = { sendOtp, verifyOtp, resetPassword };
