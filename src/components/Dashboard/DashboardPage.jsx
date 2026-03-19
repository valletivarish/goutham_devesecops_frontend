import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-toastify';
import {
  FaArrowUp, FaArrowDown, FaBalanceScale, FaWallet, FaBullseye,
} from 'react-icons/fa';
import * as dashboardService from '../../services/dashboardService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const styles = {
  page: {
    maxWidth: '1200px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 24px 0',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardLabel: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 4px 0',
  },
  cardValue: {
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    marginBottom: '32px',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 20px 0',
  },
  recentSection: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottom: '2px solid #e2e8f0',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  incomeBadge: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  expenseBadge: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '20px',
    fontSize: '14px',
  },
};

const summaryCards = [
  {
    key: 'totalIncome',
    label: 'Total Income',
    icon: FaArrowUp,
    bgColor: '#dcfce7',
    iconColor: '#16a34a',
    valueColor: '#16a34a',
    isCurrency: true,
  },
  {
    key: 'totalExpenses',
    label: 'Total Expenses',
    icon: FaArrowDown,
    bgColor: '#fee2e2',
    iconColor: '#dc2626',
    valueColor: '#dc2626',
    isCurrency: true,
  },
  {
    key: 'balance',
    label: 'Balance',
    icon: FaBalanceScale,
    bgColor: '#dbeafe',
    iconColor: '#2563eb',
    valueColor: '#2563eb',
    isCurrency: true,
  },
  {
    key: 'activeBudgets',
    label: 'Active Budgets',
    icon: FaWallet,
    bgColor: '#fef3c7',
    iconColor: '#d97706',
    valueColor: '#d97706',
    isCurrency: false,
  },
  {
    key: 'totalGoals',
    label: 'Goals',
    icon: FaBullseye,
    bgColor: '#ede9fe',
    iconColor: '#7c3aed',
    valueColor: '#7c3aed',
    isCurrency: false,
  },
];

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      const message = err?.message || 'Failed to load dashboard data.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const chartData = summary?.monthlyData || [];
  const recentTransactions = summary?.recentTransactions || [];

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Dashboard</h1>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const value = summary?.[card.key] ?? 0;
          return (
            <div key={card.key} style={styles.card}>
              <div style={{ ...styles.cardIcon, backgroundColor: card.bgColor }}>
                <Icon size={22} color={card.iconColor} />
              </div>
              <div>
                <p style={styles.cardLabel}>{card.label}</p>
                <p style={{ ...styles.cardValue, color: card.valueColor }}>
                  {card.isCurrency ? formatCurrency(value) : value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Income vs Expenses Chart */}
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Income vs Expenses</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={styles.emptyText}>No monthly data available yet.</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div style={styles.recentSection}>
        <h3 style={styles.chartTitle}>Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.slice(0, 5).map((tx) => (
                <tr key={tx.id}>
                  <td style={styles.td}>{formatDate(tx.transactionDate)}</td>
                  <td style={styles.td}>{tx.description || '-'}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(tx.type === 'INCOME' ? styles.incomeBadge : styles.expenseBadge),
                      }}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td style={styles.td}>{formatCurrency(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.emptyText}>No transactions yet. Start by adding your first transaction.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
