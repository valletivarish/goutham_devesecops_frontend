import { createContext, useContext, useState, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the application and provides authentication state
 * and methods to all child components via React Context.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  /**
   * Authenticate user with username and password.
   * Updates context state and persists credentials to localStorage.
   */
  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  /**
   * Register a new user account.
   */
  const register = useCallback(async (username, email, password) => {
    const data = await authService.register(username, email, password);
    return data;
  }, []);

  /**
   * Log out the current user by clearing context state and localStorage.
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
