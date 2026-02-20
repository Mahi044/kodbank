import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ userProfile }) => {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    const initials = userProfile?.username
        ? userProfile.username.charAt(0).toUpperCase()
        : 'U';

    return (
        <header className="dash-header">
            <div className="dash-header-search">
                <svg style={{ color: "var(--text-dim)" }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for anything..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <div className="search-k-bg">⌘ K</div>
            </div>

            <div className="dash-header-right">
                <button className="header-icon-tool">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

                <button className="header-icon-tool" style={{ position: "relative" }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }}></span>
                </button>

                <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 4px" }} />

                <div className="header-avatar-circle">
                    {initials}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
