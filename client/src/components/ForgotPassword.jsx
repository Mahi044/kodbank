import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
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
        <div className="auth-page">
            <div className="auth-brand">
                <div className="auth-brand-logo">
                    <div className="auth-brand-logo-icon">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="auth-brand-logo-text">KodBank</span>
                </div>
                <h1>Reset Your<br />Password.</h1>
                <p>No worries — it happens to the best of us. We'll send you a secure one-time code to verify your identity.</p>
                <div className="auth-brand-features">
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="auth-feature-text">OTP sent to your registered email</span>
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <span className="auth-feature-text">Secure password reset process</span>
                    </div>
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <h2>{step === 1 ? 'Forgot password?' : 'Set new password'}</h2>
                    <p className="auth-subtitle">
                        {step === 1 ? 'Enter your email and we\'ll send you a reset code' : 'Enter the OTP and your new password'}
                    </p>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}

                    {step === 1 ? (
                        <form className="auth-form" onSubmit={handleSendOtp}>
                            <div className="auth-field">
                                <label>Email Address</label>
                                <input type="email" className="auth-input" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <button type="submit" className="auth-btn" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Send Reset Code'}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleResetPassword}>
                            <div className="auth-field">
                                <label>One-Time Password</label>
                                <input type="text" className="auth-input" placeholder="Enter 6-digit code" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" />
                            </div>
                            <div className="auth-field">
                                <label>New Password</label>
                                <input type="password" className="auth-input" placeholder="Enter your new password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="auth-btn">Reset Password</button>
                            <div style={{ textAlign: "center" }}>
                                <button type="button" className="auth-text-btn" onClick={handleSendOtp}>Resend OTP</button>
                            </div>
                        </form>
                    )}

                    <div className="auth-footer">
                        Remember your password? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
