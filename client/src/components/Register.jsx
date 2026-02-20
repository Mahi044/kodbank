import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location.state?.isVerified) {
            navigate('/verify-email');
        }
    }, [location, navigate]);

    const [formData, setFormData] = useState({
        uid: '',
        username: '',
        password: '',
        email: location.state?.email || '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left branding panel */}
            <div className="auth-brand">
                <div className="auth-brand-logo">
                    <div className="auth-brand-logo-icon">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="auth-brand-logo-text">KodBank</span>
                </div>
                <h1>Start Your<br />Banking Journey.</h1>
                <p>Join thousands of users who trust KodBank for secure, modern, and effortless banking. Create your account in seconds.</p>
                <div className="auth-brand-features">
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <span className="auth-feature-text">Join 10,000+ happy users</span>
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <span className="auth-feature-text">Email-verified secure signup</span>
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        </div>
                        <span className="auth-feature-text">₹1,00,000 starting balance</span>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <h2>Create your account</h2>
                    <p className="auth-subtitle">Fill in your details to get started</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div className="auth-field">
                                <label>User ID</label>
                                <input type="number" name="uid" className="auth-input" placeholder="e.g. 1001" required onChange={handleChange} />
                            </div>
                            <div className="auth-field">
                                <label>Username</label>
                                <input type="text" name="username" className="auth-input" placeholder="Choose a username" required onChange={handleChange} />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                value={formData.email}
                                readOnly
                                style={{ background: "var(--bg)", color: "var(--text-s)" }}
                            />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <input type="password" name="password" className="auth-input" placeholder="Create a strong password" required onChange={handleChange} />
                        </div>

                        <div className="auth-field">
                            <label>Phone Number</label>
                            <input type="text" name="phone" className="auth-input" placeholder="+91 XXXXX XXXXX" required onChange={handleChange} />
                        </div>

                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
