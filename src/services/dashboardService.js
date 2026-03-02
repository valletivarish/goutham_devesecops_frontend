import api from './api';

const ENDPOINT = '/dashboard';

/**
 * Fetch the dashboard summary for the authenticated user.
 * Returns aggregated financial data such as total income, total expenses,
 * balance, recent transactions, and budget utilization.
 */
export const getSummary = async () => {
  try {
    const response = await api.get(`${ENDPOINT}/summary`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard summary.' };
  }
};
