import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('7777_token');
      const savedUser = localStorage.getItem('7777_user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore parse errors
        }
      }
    }
    setLoading(false);
  }, []);

  const register = async (email, password, name, phone) => {
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('7777_token', data.access_token);
      localStorage.setItem('7777_user', JSON.stringify(data.user));
    }
    return data;
  };

  const login = async (email, password) => {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('7777_token', data.access_token);
      localStorage.setItem('7777_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('7777_token');
      localStorage.removeItem('7777_user');
    }
  };

  const updateProfile = async (name, phone) => {
    const response = await fetch(`/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone }),
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    const updatedUser = { ...user, name, phone };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('7777_user', JSON.stringify(updatedUser));
    }
  };

  const authFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
