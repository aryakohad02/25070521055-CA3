import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('collabbridge_token'));
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('collabbridge_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.profile) {
            setProfile(res.data.profile);
          }
        }
      } catch (err) {
        console.error('Session validation error:', err);
        localStorage.removeItem('collabbridge_token');
        setUser(null);
        setProfile(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('collabbridge_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      // Fetch full profile if influencer
      if (res.data.user.role === 'influencer') {
        try {
          const meRes = await api.get('/auth/me');
          if (meRes.data.profile) setProfile(meRes.data.profile);
        } catch (e) {
          // Non-critical
        }
      }
      return res.data.user;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('collabbridge_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.role === 'influencer') {
        try {
          const meRes = await api.get('/auth/me');
          if (meRes.data.profile) setProfile(meRes.data.profile);
        } catch (e) {
          // Non-critical
        }
      }
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('collabbridge_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
