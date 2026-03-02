import api from './api';

const ENDPOINT = '/goals';

/**
 * Fetch all goals for the authenticated user.
 */
export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch goals.' };
  }
};

/**
 * Fetch a single goal by its ID.
 */
export const getById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch goal.' };
  }
};

/**
 * Create a new goal.
 * @param {Object} data - { name, targetAmount }
 */
export const create = async (data) => {
  try {
    const response = await api.post(ENDPOINT, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create goal.' };
  }
};

/**
 * Update an existing goal.
 * @param {number} id - Goal ID
 * @param {Object} data - Updated goal fields
 */
export const update = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update goal.' };
  }
};

/**
 * Delete a goal by its ID.
 */
export const remove = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete goal.' };
  }
};
