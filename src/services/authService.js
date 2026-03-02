import api from './api';

/**
 * Authenticate user with username and password.
 * Stores the JWT token and user info in localStorage on success.
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    const { token, username: name } = response.data;

    if (token) {
      localStorage.setItem('token', token);
    }
    if (name) {
      localStorage.setItem('user', JSON.stringify({ username: name }));
    }

    return { token, user: { username: name } };
  } catch (error) {
    throw error.response?.data || { message: 'Login failed. Please try again.' };
  }
};

/**
 * Register a new user account.
 */
export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed. Please try again.' };
  }
};

/**
 * Log out the current user by clearing stored credentials.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Retrieve the currently authenticated user from localStorage.
 * Returns null if no user is stored.
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
