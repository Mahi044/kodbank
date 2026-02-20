import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const EmailVerification = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await api.post('/auth/send-otp', { email, type: 'register' });
            setStep(2);
            setMessage(`OTP sent to ${email}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/verify-otp', { email, otp });
            // Navigate to register with email state
            navigate('/register', { state: { email, isVerified: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="page-container">
            <div className="card-container glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {step === 1 ? 'Verify Email' : 'Enter OTP'}
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
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <label className="form-label">Enter 6-digit OTP</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Verify & Continue
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
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent)', width: '100%', marginTop: '1rem', cursor: 'pointer' }}
                        >
                            Change Email
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
