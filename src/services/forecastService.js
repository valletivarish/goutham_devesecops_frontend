import api from './api';

const ENDPOINT = '/forecast';

/**
 * Fetch the spending forecast for the authenticated user.
 * Returns predicted spending data based on historical transaction patterns.
 */
export const getSpendingForecast = async () => {
  try {
    const response = await api.get(`${ENDPOINT}/spending`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch spending forecast.' };
  }
};
