import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('insurewise_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('insurewise_token'));
  const [loading, setLoading] = useState(true);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('insurewise_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data.data && data.data.user) {
            setUser(data.data.user);
          }
        } catch (err) {
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.data.user);
    setToken(data.token);
    addToast('Welcome back! Successfully logged in.', 'success');
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.data.user);
    setToken(data.token);
    addToast('Account created successfully! Welcome to InsureWise AI.', 'success');
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    addToast('You have been logged out.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        addToast,
        toasts,
        removeToast
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
