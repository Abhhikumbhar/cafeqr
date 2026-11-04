import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'cafeflow_auth_user_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      // Pre-authenticate with Demo Admin for immediate smooth demonstration out of the box
      return {
        id: 'ADMIN-01',
        name: 'Alex Vance',
        email: 'admin@cafeflow.com',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
    } catch {
      return {
        id: 'ADMIN-01',
        name: 'Alex Vance',
        email: 'admin@cafeflow.com',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (email, password) => {
    // Validates credentials (demo-friendly)
    if (
      (email === 'admin@cafeflow.com' && password === 'admin123') ||
      password === '1234' ||
      (email.includes('@') && password.length >= 4)
    ) {
      const newUser = {
        id: 'ADMIN-01',
        name: email.split('@')[0].toUpperCase(),
        email,
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      setUser(newUser);
      return { success: true };
    }
    return {
      success: false,
      message: 'Invalid credentials. Use demo: admin@cafeflow.com / admin123 (or PIN 1234)'
    };
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
