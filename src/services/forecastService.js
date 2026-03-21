import api from './api';

const ENDPOINT = '/forecast';

/**
 * Fetch the spending forecast for the authenticated user.
 * Returns predicted spending data based on historical transaction patterns.
 */
export const getSpendingForecast = async () => {
  try {
    const response = await api.get(`${ENDPOINT}/spending`);
    const data = response.data;
    return {
      historicalData: (data.historicalData || []).map((item) => ({
        month: item.month,
        amount: item.amount ?? item.predictedAmount,
      })),
      predictedData: (data.predictedData || data.predictions || []).map((item) => ({
        month: item.month,
        amount: item.amount ?? item.predictedAmount,
      })),
      trend: data.trend,
      confidenceScore: data.confidenceScore ?? data.confidence,
    };
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch spending forecast.' };
  }
};
