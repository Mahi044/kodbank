import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const monthlyData = [
    { month: 'Aug', income: 82000, expenses: 54000 },
    { month: 'Sep', income: 75000, expenses: 61000 },
    { month: 'Oct', income: 91000, expenses: 57000 },
    { month: 'Nov', income: 88000, expenses: 63000 },
    { month: 'Dec', income: 95000, expenses: 70000 },
    { month: 'Jan', income: 102000, expenses: 65000 },
    { month: 'Feb', income: 98000, expenses: 59000 },
];

const spendingData = [
    { name: 'Housing', value: 28, color: '#2563EB' },
    { name: 'Food', value: 22, color: '#60A5FA' },
    { name: 'Transport', value: 14, color: '#818CF8' },
    { name: 'Shopping', value: 18, color: '#A78BFA' },
    { name: 'Health', value: 10, color: '#F472B6' },
    { name: 'Other', value: 8, color: '#CBD5E1' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "#fff", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px", boxShadow: "var(--shadow-3)" }}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</p>
                {payload.map((entry) => (
                    <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color }}></div>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>
                            {entry.name === 'income' ? 'Income' : 'Expenses'}: ₹{entry.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsSection = () => {
    return (
        <div className="analytics-grid">
            <div className="analytics-card">
                <div className="analytics-card-header">
                    <div>
                        <h3 className="analytics-card-title">Cash Flow</h3>
                        <p className="analytics-card-sub">Income and expenses over time</p>
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }}></div>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>Income</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--text-dim)" }}></div>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>Expenses</span>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expenses"
                                stroke="var(--text-dim)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="analytics-card">
                <div className="analytics-card-header">
                    <div>
                        <h3 className="analytics-card-title">Spending</h3>
                        <p className="analytics-card-sub">Top categories</p>
                    </div>
                </div>
                <div style={{ width: '100%', height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={spendingData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {spendingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                <tspan x="50%" dy="-0.5em" style={{ fontSize: "12px", fontWeight: "600", fill: "var(--text-dim)" }}>TOTAL</tspan>
                                <tspan x="50%" dy="1.5em" style={{ fontSize: "16px", fontWeight: "700", fill: "var(--text-main)" }}>₹42k</tspan>
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {spendingData.slice(0, 4).map(item => (
                        <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color }}></div>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>{item.name} {item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
