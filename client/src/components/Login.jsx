import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
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
            await api.post('/auth/login', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
                <h1>Smart Banking,<br />Simplified.</h1>
                <p>Manage your finances with confidence. Track spending, grow savings, and stay in control — all from one beautiful dashboard.</p>
                <div className="auth-brand-features">
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <span className="auth-feature-text">Bank-grade security & encryption</span>
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <span className="auth-feature-text">Real-time analytics & insights</span>
                    </div>
                    <div className="auth-brand-feature">
                        <div className="auth-feature-icon">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="auth-feature-text">Zero fees on all transfers</span>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <h2>Welcome back</h2>
                    <p className="auth-subtitle">Enter your credentials to access your account</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label>Username or Email</label>
                            <input
                                type="text"
                                name="username"
                                className="auth-input"
                                placeholder="Enter your username or email"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="auth-field">
                            <div className="auth-row">
                                <label>Password</label>
                                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                placeholder="Enter your password"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/verify-email">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
