import api from './api';

const ENDPOINT = '/budgets';

/**
 * Fetch all budgets for the authenticated user.
 */
export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budgets.' };
  }
};

/**
 * Fetch a single budget by its ID.
 */
export const getById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budget.' };
  }
};

/**
 * Create a new budget.
 * @param {Object} data - { amountLimit, period, startDate, categoryId }
 */
export const create = async (data) => {
  try {
    const response = await api.post(ENDPOINT, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create budget.' };
  }
};

/**
 * Update an existing budget.
 * @param {number} id - Budget ID
 * @param {Object} data - Updated budget fields
 */
export const update = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update budget.' };
  }
};

/**
 * Delete a budget by its ID.
 */
export const remove = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete budget.' };
  }
};
