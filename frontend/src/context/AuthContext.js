import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email, username, password) => {
    const response = await api.post('/api/v1/auth/signup', {
      email,
      username,
      password,
    });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    const meResponse = await api.get('/api/v1/auth/me');
    localStorage.setItem('user', JSON.stringify(meResponse.data));
    setUser(meResponse.data);
    return meResponse.data;
  };

  const login = async (email, password) => {
    const response = await api.post('/api/v1/auth/login', {
      email,
      password,
    });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    const meResponse = await api.get('/api/v1/auth/me');
    localStorage.setItem('user', JSON.stringify(meResponse.data));
    setUser(meResponse.data);
    return meResponse.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);