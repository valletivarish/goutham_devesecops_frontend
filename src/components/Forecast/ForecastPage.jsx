import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-toastify';
import {
  FaArrowTrendUp, FaArrowTrendDown,
} from 'react-icons/fa6';
import { FaMinus, FaInfoCircle } from 'react-icons/fa';
import * as forecastService from '../../services/forecastService';
import { formatCurrency } from '../../utils/formatters';
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
  infoCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
    fontSize: '18px',
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
  legendNote: {
    display: 'flex',
    gap: '24px',
    marginTop: '12px',
    fontSize: '12px',
    color: '#94a3b8',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendLine: {
    width: '24px',
    height: '3px',
    borderRadius: '2px',
  },
  noDataContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '60px 24px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
  },
  noDataIcon: {
    color: '#94a3b8',
    marginBottom: '12px',
  },
  noDataText: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  noDataSubtext: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
};

const getTrendInfo = (trend) => {
  switch (trend?.toLowerCase()) {
    case 'increasing':
      return {
        icon: FaArrowTrendUp,
        color: '#dc2626',
        bgColor: '#fee2e2',
        label: 'Increasing',
      };
    case 'decreasing':
      return {
        icon: FaArrowTrendDown,
        color: '#16a34a',
        bgColor: '#dcfce7',
        label: 'Decreasing',
      };
    default:
      return {
        icon: FaMinus,
        color: '#2563eb',
        bgColor: '#dbeafe',
        label: 'Stable',
      };
  }
};

const ForecastPage = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await forecastService.getSpendingForecast();
      setForecast(data);
    } catch (err) {
      const message = err?.message || 'Failed to load forecast data.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const historicalData = forecast?.historicalData || [];
  const predictedData = forecast?.predictedData || [];
  const trend = forecast?.trend || 'STABLE';
  const confidence = forecast?.confidenceScore ?? null;

  const hasEnoughData = historicalData.length > 0 || predictedData.length > 0;

  // Merge historical and predicted data for charting
  // Historical points get 'actual' value, predicted points get 'predicted' value
  // The last historical point is duplicated into predicted to connect the lines
  const chartData = [];

  historicalData.forEach((item) => {
    chartData.push({
      month: item.month,
      actual: item.amount,
      predicted: null,
    });
  });

  if (historicalData.length > 0 && predictedData.length > 0) {
    const lastHistorical = historicalData[historicalData.length - 1];
    // Ensure the connecting point has both values
    chartData[chartData.length - 1] = {
      ...chartData[chartData.length - 1],
      predicted: lastHistorical.amount,
    };
  }

  predictedData.forEach((item) => {
    chartData.push({
      month: item.month,
      actual: null,
      predicted: item.amount,
    });
  });

  const trendInfo = getTrendInfo(trend);
  const TrendIcon = trendInfo.icon;

  if (!hasEnoughData) {
    return (
      <div style={styles.page}>
        <h1 style={styles.pageTitle}>Spending Forecast</h1>
        <div style={styles.noDataContainer}>
          <div style={styles.noDataIcon}>
            <FaInfoCircle size={40} />
          </div>
          <p style={styles.noDataText}>Not enough data for a forecast</p>
          <p style={styles.noDataSubtext}>
            Add more transactions over time to generate spending predictions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Spending Forecast</h1>

      {/* Info Cards */}
      <div style={styles.infoCards}>
        <div style={styles.card}>
          <div style={{ ...styles.cardIcon, backgroundColor: trendInfo.bgColor }}>
            <TrendIcon size={22} color={trendInfo.color} />
          </div>
          <div>
            <p style={styles.cardLabel}>Spending Trend</p>
            <p style={{ ...styles.cardValue, color: trendInfo.color }}>
              {trendInfo.label}
            </p>
          </div>
        </div>

        {confidence !== null && (
          <div style={styles.card}>
            <div style={{ ...styles.cardIcon, backgroundColor: '#ede9fe' }}>
              <FaInfoCircle size={22} color="#7c3aed" />
            </div>
            <div>
              <p style={styles.cardLabel}>Confidence Score</p>
              <p style={{ ...styles.cardValue, color: '#7c3aed' }}>
                {typeof confidence === 'number' ? `${Math.round(confidence * 100)}%` : confidence}
              </p>
            </div>
          </div>
        )}

        {predictedData.length > 0 && (
          <div style={styles.card}>
            <div style={{ ...styles.cardIcon, backgroundColor: '#fef3c7' }}>
              <FaArrowTrendUp size={22} color="#d97706" />
            </div>
            <div>
              <p style={styles.cardLabel}>Next Month Prediction</p>
              <p style={{ ...styles.cardValue, color: '#d97706' }}>
                {formatCurrency(predictedData[0]?.amount)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Forecast Chart */}
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Spending Forecast</h3>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => (value != null ? formatCurrency(value) : 'N/A')}
              contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Historical Spending"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted Spending"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={{ r: 4, strokeDasharray: '' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div style={styles.legendNote}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendLine, backgroundColor: '#2563eb' }} />
            <span>Historical (actual data)</span>
          </div>
          <div style={styles.legendItem}>
            <div
              style={{
                ...styles.legendLine,
                backgroundColor: '#f59e0b',
                borderTop: '2px dashed #f59e0b',
                height: '0',
              }}
            />
            <span>Predicted (forecast)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
