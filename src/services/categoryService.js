import api from './api';

const ENDPOINT = '/categories';

/**
 * Fetch all categories for the authenticated user.
 */
export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch categories.' };
  }
};

/**
 * Fetch a single category by its ID.
 */
export const getById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch category.' };
  }
};

/**
 * Create a new category.
 * @param {Object} data - { name, type }
 */
export const create = async (data) => {
  try {
    const response = await api.post(ENDPOINT, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create category.' };
  }
};

/**
 * Update an existing category.
 * @param {number} id - Category ID
 * @param {Object} data - Updated category fields
 */
export const update = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update category.' };
  }
};

/**
 * Delete a category by its ID.
 */
export const remove = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete category.' };
  }
};
