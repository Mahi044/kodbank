import React from 'react';

const transactions = [
    {
        id: 1,
        name: 'Amazon India',
        date: '20 Feb 2026',
        category: 'Shopping',
        amount: -3499,
        status: 'Completed',
    },
    {
        id: 2,
        name: 'Salary Credit',
        date: '18 Feb 2026',
        category: 'Income',
        amount: 95000,
        status: 'Completed',
    },
    {
        id: 3,
        name: 'Swiggy',
        date: '17 Feb 2026',
        category: 'Food',
        amount: -850,
        status: 'Completed',
    },
    {
        id: 4,
        name: 'Electricity Bill',
        date: '16 Feb 2026',
        category: 'Utilities',
        amount: -2100,
        status: 'Pending',
    },
    {
        id: 5,
        name: 'Netflix',
        date: '15 Feb 2026',
        category: 'Entertain',
        amount: -649,
        status: 'Completed',
    },
    {
        id: 6,
        name: 'Freelance Payout',
        date: '13 Feb 2026',
        category: 'Income',
        amount: 12500,
        status: 'Completed',
    },
    {
        id: 7,
        name: 'Jio Mobile',
        date: '11 Feb 2026',
        category: 'Utilities',
        amount: -719,
        status: 'Completed',
    },
    {
        id: 8,
        name: 'Uber India',
        date: '10 Feb 2026',
        category: 'Transport',
        amount: -312,
        status: 'Failed',
    },
];

const catConfig = {
    Shopping: { bg: 'hsl(221, 83%, 96%)', text: 'hsl(221, 83%, 53%)' },
    Income: { bg: 'hsl(150, 80%, 96%)', text: 'hsl(150, 80%, 30%)' },
    Food: { bg: 'hsl(25, 95%, 96%)', text: 'hsl(25, 95%, 45%)' },
    Utilities: { bg: 'hsl(262, 80%, 96%)', text: 'hsl(262, 80%, 50%)' },
    Entertain: { bg: 'hsl(320, 80%, 96%)', text: 'hsl(320, 80%, 50%)' },
    Transport: { bg: 'hsl(199, 89%, 96%)', text: 'hsl(199, 89%, 48%)' },
};

const statusConfig = {
    Completed: { bg: 'hsl(150, 80%, 96%)', text: 'hsl(150, 80%, 30%)' },
    Pending: { bg: 'hsl(45, 90%, 96%)', text: 'hsl(45, 90%, 40%)' },
    Failed: { bg: 'hsl(0, 84%, 96%)', text: 'hsl(0, 84%, 55%)' },
};

const TransactionsTable = () => {
    return (
        <div className="transactions-card">
            <div className="transactions-header">
                <div>
                    <h3 className="transactions-title" style={{ fontSize: "16px", fontWeight: "700" }}>History</h3>
                    <p className="transactions-sub" style={{ fontSize: "13px" }}>Last 30 days transactions</p>
                </div>
                <button className="view-all-btn" style={{ fontWeight: "600", fontSize: "12px", background: "var(--primary-subtle)", color: "var(--primary)", border: "none", padding: "6px 12px", borderRadius: "6px" }}>
                    Export CSV
                </button>
            </div>

            <div className="table-wrapper">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Detail</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th style={{ textAlign: "right" }}>Amount</th>
                            <th style={{ textAlign: "right" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => {
                            const cat = catConfig[tx.category] || { bg: '#f1f5f9', text: '#64748b' };
                            const st = statusConfig[tx.status] || { bg: '#f1f5f9', text: '#64748b' };
                            const isPlus = tx.amount > 0;

                            return (
                                <tr key={tx.id} className="table-row">
                                    <td>
                                        <div className="tx-name-cell">
                                            <div className="tx-avatar" style={{ background: cat.bg, color: cat.text, fontWeight: "700" }}>
                                                {tx.name.charAt(0)}
                                            </div>
                                            <span className="tx-name" style={{ fontWeight: "600" }}>{tx.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{tx.date}</td>
                                    <td>
                                        <span className="category-badge" style={{ background: cat.bg, color: cat.text }}>
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: "700", color: isPlus ? "hsl(150, 80%, 30%)" : "var(--text-main)" }}>
                                        {isPlus ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <span className="status-badge" style={{ background: st.bg, color: st.text }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable;
