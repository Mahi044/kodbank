import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import AnalyticsSection from './AnalyticsSection';
import TransactionsTable from './TransactionsTable';
import ChatWidget from './ChatWidget';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [userProfile, setUserProfile] = useState({});
    const [activeItem, setActiveItem] = useState('dashboard');
    const [showBalance, setShowBalance] = useState(false);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [balanceRevealed, setBalanceRevealed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileRes = await api.get('/api/profile');
                setUserProfile(profileRes.data);
                setBalance(profileRes.data.balance);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleCheckBalance = async () => {
        setBalanceLoading(true);
        setBalanceRevealed(false);
        setShowBalance(true);
        try {
            const res = await api.get('/api/profile');
            setBalance(res.data.balance);
            setUserProfile(res.data);
        } catch (err) {
            console.error('Failed to fetch balance');
        } finally {
            setBalanceLoading(false);
            // Trigger the count-up reveal after a tiny delay
            setTimeout(() => setBalanceRevealed(true), 100);
        }
    };

    return (
        <div className="db-layout">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} userProfile={userProfile} />

            <div className="db-main">
                <DashboardHeader userProfile={userProfile} />

                <main className="db-content">
                    <div className="db-page-title">
                        <div>
                            <h1 className="db-page-heading">Dashboard</h1>
                            <p className="db-page-sub">Welcome back{userProfile.username ? `, ${userProfile.username}` : ''}. Here's your financial overview.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button onClick={handleCheckBalance} className="check-bal-btn">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5zm-4 1a1 1 0 110-2 1 1 0 010 2zM3 7h18" />
                                </svg>
                                Check Balance
                            </button>
                            <div className="db-date-badge">
                                {new Date().toLocaleDateString('en-IN', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>

                    <SummaryCards balance={balance} />
                    <AnalyticsSection />
                    <TransactionsTable />
                </main>
            </div>

            {/* Balance Modal Overlay */}
            {showBalance && (
                <div className="bal-overlay" onClick={() => setShowBalance(false)}>
                    <div className="bal-modal" onClick={e => e.stopPropagation()}>
                        {/* Animated rings */}
                        <div className="bal-ring bal-ring-1" />
                        <div className="bal-ring bal-ring-2" />

                        <div className="bal-icon-wrap">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                                <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5zm-4 1a1 1 0 110-2 1 1 0 010 2zM3 7h18" />
                            </svg>
                        </div>

                        <p className="bal-label">Available Balance</p>

                        {balanceLoading ? (
                            <div className="bal-amount">
                                <span className="bal-loader" />
                            </div>
                        ) : (
                            <div className={`bal-amount ${balanceRevealed ? 'revealed' : ''}`}>
                                ₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                        )}

                        <p className="bal-user-info">
                            {userProfile.username} • {userProfile.email}
                        </p>

                        <div className="bal-sparkle-row">
                            <span className="bal-sparkle">✨</span>
                            <span className="bal-sparkle">💰</span>
                            <span className="bal-sparkle">✨</span>
                        </div>

                        <button className="bal-close-btn" onClick={() => setShowBalance(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .check-bal-btn {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 20px;
                    background: linear-gradient(135deg, hsl(234,62%,56%), hsl(260,50%,45%));
                    color: #fff; border: none; border-radius: 12px;
                    font-size: 14px; font-weight: 600; font-family: inherit;
                    cursor: pointer;
                    box-shadow: 0 4px 14px hsla(234,85%,65%,.25);
                    transition: all .25s cubic-bezier(.34,1.56,.64,1);
                    position: relative;
                    overflow: hidden;
                }
                .check-bal-btn::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, hsla(0,0%,100%,.2), transparent);
                    transform: translateX(-100%);
                    transition: transform .6s;
                }
                .check-bal-btn:hover::after {
                    transform: translateX(100%);
                }
                .check-bal-btn:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 8px 24px hsla(234,85%,65%,.35);
                }
                .check-bal-btn:active {
                    transform: translateY(0) scale(.98);
                }

                .bal-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,.5);
                    backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 999;
                    animation: overlayIn .3s ease-out;
                }
                @keyframes overlayIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .bal-modal {
                    background: #fff;
                    border-radius: 24px;
                    padding: 48px 56px;
                    text-align: center;
                    box-shadow: 0 32px 64px rgba(0,0,0,.15);
                    min-width: 380px;
                    animation: modalBounce .5s cubic-bezier(.34,1.56,.64,1);
                    position: relative;
                    overflow: hidden;
                }
                @keyframes modalBounce {
                    0% { opacity: 0; transform: scale(.8) translateY(40px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }

                .bal-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 2px solid hsla(234,85%,65%,.1);
                    animation: ringPulse 2s ease-out infinite;
                }
                .bal-ring-1 {
                    width: 200px; height: 200px;
                    top: 50%; left: 50%;
                    transform: translate(-50%,-50%);
                    animation-delay: 0s;
                }
                .bal-ring-2 {
                    width: 300px; height: 300px;
                    top: 50%; left: 50%;
                    transform: translate(-50%,-50%);
                    animation-delay: .5s;
                }
                @keyframes ringPulse {
                    0% { transform: translate(-50%,-50%) scale(.8); opacity: .6; }
                    100% { transform: translate(-50%,-50%) scale(1.3); opacity: 0; }
                }

                .bal-icon-wrap {
                    width: 64px; height: 64px; border-radius: 20px;
                    background: linear-gradient(135deg, hsl(234,62%,56%), hsl(260,50%,45%));
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 24px;
                    position: relative; z-index: 1;
                    animation: iconPop .4s cubic-bezier(.34,1.56,.64,1) .2s both;
                    box-shadow: 0 8px 24px hsla(234,85%,65%,.3);
                }
                @keyframes iconPop {
                    0% { transform: scale(0) rotate(-20deg); }
                    100% { transform: scale(1) rotate(0); }
                }

                .bal-label {
                    font-size: 12px; font-weight: 700;
                    color: hsl(228,15%,55%);
                    text-transform: uppercase; letter-spacing: 1.5px;
                    margin-bottom: 12px;
                    position: relative; z-index: 1;
                    animation: fadeUp .4s ease-out .3s both;
                }

                .bal-amount {
                    font-size: 46px; font-weight: 800;
                    color: hsl(228,40%,16%);
                    letter-spacing: -2px;
                    position: relative; z-index: 1;
                    animation: fadeUp .4s ease-out .4s both;
                    transition: all .5s cubic-bezier(.34,1.56,.64,1);
                }
                .bal-amount.revealed {
                    animation: balReveal .6s cubic-bezier(.34,1.56,.64,1) forwards;
                }
                @keyframes balReveal {
                    0% { transform: scale(.5); opacity: 0; filter: blur(10px); }
                    50% { transform: scale(1.08); opacity: 1; filter: blur(0); }
                    100% { transform: scale(1); }
                }

                .bal-loader {
                    display: inline-block;
                    width: 32px; height: 32px;
                    border: 3px solid hsl(228,25%,92%);
                    border-top-color: hsl(234,85%,65%);
                    border-radius: 50%;
                    animation: spin .6s linear infinite;
                }

                .bal-user-info {
                    font-size: 13px; color: hsl(228,10%,70%);
                    margin-top: 12px;
                    position: relative; z-index: 1;
                    animation: fadeUp .4s ease-out .5s both;
                }

                .bal-sparkle-row {
                    margin-top: 20px;
                    display: flex; justify-content: center; gap: 16px;
                    position: relative; z-index: 1;
                }
                .bal-sparkle {
                    font-size: 22px;
                    animation: sparkleFloat 1.5s ease-in-out infinite alternate;
                }
                .bal-sparkle:nth-child(2) { animation-delay: .3s; }
                .bal-sparkle:nth-child(3) { animation-delay: .6s; }
                @keyframes sparkleFloat {
                    0% { transform: translateY(0) scale(1); }
                    100% { transform: translateY(-8px) scale(1.2); }
                }

                .bal-close-btn {
                    margin-top: 24px; padding: 10px 36px;
                    background: hsl(228,33%,97%);
                    border: 1px solid hsl(228,25%,92%);
                    border-radius: 12px;
                    font-size: 14px; font-weight: 600;
                    color: hsl(228,15%,50%);
                    cursor: pointer; font-family: inherit;
                    transition: all .2s;
                    position: relative; z-index: 1;
                    animation: fadeUp .4s ease-out .6s both;
                }
                .bal-close-btn:hover {
                    background: hsl(228,25%,92%);
                    transform: translateY(-1px);
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* AI Chat Assistant */}
            <ChatWidget />
        </div>
    );
};

export default Dashboard;
