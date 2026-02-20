import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // /auth/login as per vite proxy
            await api.post('/auth/login', formData);
            // On success, cookie is set automatically
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="page-container">
            <div className="card-container glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
                {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username or Email</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username or email"
                            required
                            className="form-input"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" required className="form-input" onChange={handleChange} />
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>Forgot Password?</Link>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
