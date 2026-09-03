import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile/');
      setUser(response.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('jobflow_access_token');
      localStorage.removeItem('jobflow_refresh_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jobflow_access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('jobflow_access_token', access);
      localStorage.setItem('jobflow_refresh_token', refresh);
      await fetchProfile();
      showToast('Welcome back to JobFlow!', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid username or password.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register/', userData);
      showToast('Account created successfully! Logging you in...', 'success');
      return await login(userData.username, userData.password);
    } catch (err) {
      const errObj = err.response?.data;
      let msg = 'Registration failed. Please check your inputs.';
      if (errObj) {
        if (typeof errObj === 'object') {
          const firstKey = Object.keys(errObj)[0];
          msg = `${firstKey}: ${errObj[firstKey]}`;
        }
      }
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('jobflow_access_token');
    localStorage.removeItem('jobflow_refresh_token');
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile/', profileData);
      setUser(response.data);
      showToast('Profile updated successfully!', 'success');
      return { success: true };
    } catch (err) {
      const errData = err.response?.data;
      let msg = 'Failed to update profile.';
      if (errData && typeof errData === 'object') {
        const key = Object.keys(errData)[0];
        msg = `${key}: ${Array.isArray(errData[key]) ? errData[key].join(', ') : errData[key]}`;
      }
      showToast(msg, 'error');
      return { success: false };
    }
  };

  const triggerSeedData = async () => {
    try {
      const response = await api.post('/seed/seed-data/');
      showToast(response.data.message || 'Demo data loaded!', 'success');
      await fetchProfile();
      return { success: true };
    } catch (err) {
      showToast('Failed to seed demo data.', 'error');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        triggerSeedData,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
