import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const EmailVerification = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email, type: 'register' });
            setStep(2);
            setMessage(`OTP sent to ${email}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/verify-otp', { email, otp });
            navigate('/register', { state: { email, isVerified: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
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
                <h1>Verify Your<br />Identity.</h1>
                <p>A quick email verification keeps your account safe. We'll send a one-time code to confirm it's really you.</p>
                <div className="auth-brand-features">
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <span className="auth-feature-text">Prevents unauthorized registrations</span>
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="auth-feature-text">OTP is valid for 10 minutes</span>
                    </div>
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <h2>{step === 1 ? 'Verify your email' : 'Enter verification code'}</h2>
                    <p className="auth-subtitle">
                        {step === 1
                            ? 'We\'ll send a 6-digit OTP to your email address'
                            : `Enter the code we sent to ${email}`}
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
                                {loading ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleVerifyOtp}>
                            <div className="auth-field">
                                <label>6-Digit OTP</label>
                                <input type="text" className="auth-input" placeholder="000000" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" style={{ letterSpacing: "8px", fontSize: "20px", textAlign: "center", fontWeight: "700" }} />
                            </div>
                            <button type="submit" className="auth-btn">Verify & Continue</button>
                            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                                <button type="button" className="auth-text-btn" onClick={handleSendOtp}>Resend code</button>
                                <button type="button" className="auth-text-btn" onClick={() => setStep(1)}>Change email</button>
                            </div>
                        </form>
                    )}

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
