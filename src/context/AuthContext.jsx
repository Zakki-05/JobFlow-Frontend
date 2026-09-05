import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const formatApiError = (err, fallbackMessage = 'An unexpected error occurred.') => {
  if (!err.response) {
    return err.message || 'Network error: Unable to connect to backend server.';
  }

  const { status, data } = err.response;

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.detail && typeof data.detail === 'string') {
      return data.detail;
    }
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }

    const fieldErrors = [];
    for (const [key, val] of Object.entries(data)) {
      const valStr = Array.isArray(val) ? val.join(', ') : String(val);
      const cleanKey = key.replace(/_/g, ' ');
      fieldErrors.push(`${cleanKey}: ${valStr}`);
    }
    if (fieldErrors.length > 0) {
      return fieldErrors.join(' | ');
    }
  }

  if (typeof data === 'string') {
    if (data.includes('<html') || data.includes('<!DOCTYPE')) {
      if (status === 400) return `Server error (400): Bad Request`;
      if (status === 403) return 'Server error (403): Forbidden Access';
      if (status === 404) return 'Server error (404): Endpoint not found';
      if (status >= 500) return `Server error (${status}): Internal server error`;
      return `Server error: HTTP ${status}`;
    }
    if (data.trim().length > 0 && data.trim().length < 200) {
      return data.trim();
    }
  }

  return fallbackMessage;
};

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
      const msg = formatApiError(err, 'Invalid username or password.');
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
      const msg = formatApiError(err, 'Registration failed. Please check your inputs.');
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
      const msg = formatApiError(err, 'Failed to update profile.');
      showToast(msg, 'error');
      return { success: false, error: msg };
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
