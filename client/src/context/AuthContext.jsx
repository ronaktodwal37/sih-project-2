import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';
import { setAuthToken } from '../services/api.js';
import { ROLE_DASHBOARD_PATHS } from '../utils/constants.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('token');
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('token');
      setAuthToken(null);
      setUser(null);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return ROLE_DASHBOARD_PATHS[user.role] || '/';
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loadUser, getDashboardPath, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
