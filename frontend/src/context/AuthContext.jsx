import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fukre_token');
    const savedUser = localStorage.getItem('fukre_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('fukre_token', data.token);
      localStorage.setItem('fukre_user', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      return { success: true, user: data };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password, phone });
      localStorage.setItem('fukre_token', data.token);
      localStorage.setItem('fukre_user', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      toast.success(`Welcome to Fukre Travels, ${data.name}!`);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('fukre_token');
    localStorage.removeItem('fukre_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
