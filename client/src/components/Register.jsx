import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user came from verification
    useEffect(() => {
        if (!location.state?.isVerified) {
            navigate('/verify-email');
        }
    }, [location, navigate]);

    const [formData, setFormData] = useState({
        uid: '',
        username: '',
        password: '',
        email: location.state?.email || '', // Pre-fill email
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
            // Using configured api instance
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || 'Registration failed';
            setError(msg);
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="card-container glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">User ID (UID)</label>
                        <input type="number" name="uid" required className="form-input" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input type="text" name="username" required className="form-input" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="form-input"
                            value={formData.email}
                            readOnly // Lock email
                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" required className="form-input" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input type="text" name="phone" required className="form-input" onChange={handleChange} />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
