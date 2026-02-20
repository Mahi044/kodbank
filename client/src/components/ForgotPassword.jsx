import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New PW
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email, type: 'reset' });
            setStep(2);
            setMessage(`OTP sent to ${email}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setMessage('Password reset successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="page-container">
            <div className="card-container glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h2>

                {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
                {message && <p style={{ color: '#10b981', textAlign: 'center' }}>{message}</p>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                required
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="form-label">Enter OTP</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                required
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Reset Password
                        </button>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    opacity: 0.8
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Remembered password? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
