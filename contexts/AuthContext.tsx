'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          apiClient.setToken(token);
          try {
            const userData = await apiClient.getCurrentUser();
            setUser({
              id: userData.user.id,
              firstName: userData.user.firstName,
              lastName: userData.user.lastName,
              email: userData.user.email,
              role: userData.user.role,
              phone: userData.user.phone,
              avatar: userData.user.avatar,
            });
          } catch (error) {
            console.error('Failed to get current user:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            apiClient.clearToken();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.login(email, password);
      
      setUser({
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role,
        phone: response.user.phone,
        avatar: response.user.avatar,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      
      setUser({
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role,
        phone: response.user.phone,
        avatar: response.user.avatar,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    apiClient.clearToken();
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.updateProfile(userData);
      
      setUser(prev => prev ? {
        ...prev,
        ...response.user,
      } : null);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiClient.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
