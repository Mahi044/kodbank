import React, { useState } from 'react';
import api from '../api';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
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
            // /api/balance logic
            const response = await api.get('/api/balance');
            setBalance(response.data.balance);
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
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <button onClick={handleLogout} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
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
