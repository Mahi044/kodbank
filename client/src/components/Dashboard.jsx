import React, { useState } from 'react';
import api from '../api';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [userProfile, setUserProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const triggerConfetti = () => {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        var random = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const checkBalance = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch Profile (includes balance)
            const profileRes = await api.get('/api/profile');
            setUserProfile(profileRes.data);
            setBalance(profileRes.data.balance);

            triggerConfetti();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                // Token invalid or expired
                navigate('/login');
            } else {
                setError('Failed to fetch balance');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear cookie logic would go here (usually backend endpoint to clear cookie)
        // For now just redirect
        navigate('/login');
    };

    return (
        <div className="page-container" style={{ flexDirection: 'column' }}>
            {/* Top Right Profile Section */}
            <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 10
            }}>
                {userProfile.username && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '8px 16px',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--glass-border)'
                    }}>
                        {/* Avatar / Logo */}
                        <div style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                        }}>
                            {userProfile.username.charAt(0).toUpperCase()}
                        </div>

                        {/* User Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>{userProfile.username}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>UID: {userProfile.uid}</span>
                        </div>
                    </div>
                )}

                <button onClick={handleLogout} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '8px 16px' }}>
                    Logout
                </button>
            </div>

            <div className="card-container glass-card" style={{ textAlign: 'center' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Kodbank</h1>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Premium Banking Experience</p>

                <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {balance !== null ? (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>Your Available Balance</p>
                            <h2 style={{ fontSize: '3rem', color: 'var(--accent)', margin: '0.5rem 0' }}>
                                ₹ {Number(balance).toLocaleString()}
                            </h2>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-dim)' }}>
                            {loading ? "Securely fetching your balance..." : "Click below to view your balance"}
                        </p>
                    )}

                    {error && <p style={{ color: '#ef4444' }}>{error}</p>}
                </div>

                <button
                    onClick={checkBalance}
                    className="btn-primary btn-balance"
                    style={{ marginTop: '2rem', width: '100%' }}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Check Balance'}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
