import api from './api';

const ENDPOINT = '/transactions';

/**
 * Fetch all transactions for the authenticated user.
 */
export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transactions.' };
  }
};

/**
 * Fetch a single transaction by its ID.
 */
export const getById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transaction.' };
  }
};

/**
 * Create a new transaction.
 * @param {Object} data - { amount, type, description, transactionDate, categoryId }
 */
export const create = async (data) => {
  try {
    const response = await api.post(ENDPOINT, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create transaction.' };
  }
};

/**
 * Update an existing transaction.
 * @param {number} id - Transaction ID
 * @param {Object} data - Updated transaction fields
 */
export const update = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update transaction.' };
  }
};

/**
 * Delete a transaction by its ID.
 */
export const remove = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete transaction.' };
  }
};
