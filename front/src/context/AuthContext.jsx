import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_URL = `${BASE_API_URL}/users`;
  const ADMIN_API_URL = `${BASE_API_URL}/admin`;

  // Configure axios to include credentials (cookies) if needed
  axios.defaults.withCredentials = true;

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (!token && !adminToken) {
      setLoading(false);
      return;
    }

    try {
      if (token) {
        const response = await axios.get(`${API_URL}/test`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      }

      if (adminToken) {
        const response = await axios.get(`${ADMIN_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (response.data.success) {
          // If we can fetch dashboard, token is valid and user is admin
          // We might need a specific 'verify admin' endpoint but dashboard works for now
          // Let's assume the user data is in the token or we fetch it
          // For now, let's just set admin state
          setAdmin({ role: 'admin' }); 
        } else {
          localStorage.removeItem('adminToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (token) localStorage.removeItem('token');
      if (adminToken) localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${ADMIN_API_URL}/login`, { email, password });
      if (response.data.success) {
        const { token, admin } = response.data;
        localStorage.setItem('adminToken', token);
        setAdmin(admin);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Admin login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin, 
      isAuthenticated, 
      loading, 
      login, 
      adminLogin, 
      logout, 
      adminLogout, 
      register, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

