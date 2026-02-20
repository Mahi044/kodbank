import React from 'react';

const TrendUp = () => (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

const TrendDown = () => (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

const cards = [
    {
        id: 'total',
        label: 'Net Balance',
        amount: '₹1,24,850',
        change: '3.2%',
        positive: true,
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5zm-4 1a1 1 0 110-2 1 1 0 010 2zM3 7h18" />
            </svg>
        ),
        iconBg: '#f0f9ff',
        iconColor: '#0ea5e9',
    },
    {
        id: 'savings',
        label: 'Savings',
        amount: '₹89,200',
        change: '5.8%',
        positive: true,
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        iconBg: '#f0fdf4',
        iconColor: '#10b981',
    },
    {
        id: 'current',
        label: 'Flowing',
        amount: '₹35,650',
        change: '1.4%',
        positive: false,
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M8 7h12M8 12h8M8 17h4" />
            </svg>
        ),
        iconBg: '#fffbeb',
        iconColor: '#d97706',
    },
    {
        id: 'credit',
        label: 'Liability',
        amount: '₹22,400',
        change: '2.1%',
        positive: false,
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
        iconBg: '#fef2f2',
        iconColor: '#ef4444',
    },
];

const SummaryCards = ({ balance }) => {
    const displayCards = balance !== null
        ? [{ ...cards[0], amount: `₹${Number(balance).toLocaleString('en-IN')}` }, ...cards.slice(1)]
        : cards;

    return (
        <div className="summary-cards-grid">
            {displayCards.map((card) => (
                <div key={card.id} className="summary-card">
                    <div className="summary-card-top">
                        <div className="summary-card-icon-pill" style={{ background: card.iconBg, color: card.iconColor }}>
                            {card.icon}
                        </div>
                        <button className="header-icon-tool" style={{ padding: "4px" }} title="Quick Actions">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                    <p className="summary-card-label">{card.label}</p>
                    <h2 className="summary-card-amount">{card.amount}</h2>
                    <div className="summary-card-footer">
                        <div className={`summary-card-change ${card.positive ? 'positive' : 'negative'}`}>
                            {card.positive ? <TrendUp /> : <TrendDown />}
                            <span>{card.change}</span>
                        </div>
                        <span className="summary-card-subtext">vs last mo.</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
