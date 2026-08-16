import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

export interface User {
  user_id?: string | number;
  name: string;
  email: string;
  city?: string;
  state?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('solo_trip_token');
    const savedUser = localStorage.getItem('solo_trip_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      if (res.data && res.data.token) {
        const loggedUser = res.data.user || { name: email.split('@')[0], email };
        setToken(res.data.token);
        setUser(loggedUser);
        localStorage.setItem('solo_trip_token', res.data.token);
        localStorage.setItem('solo_trip_user', JSON.stringify(loggedUser));
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, message: msg };
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      if (res.data && !res.data.error) {
        // Auto login after register
        return await login(userData.email, userData.password);
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const demoLogin = () => {
    const demoUser: User = {
      user_id: 'demo-99',
      name: 'Aarav (Solo Explorer)',
      email: 'aarav.explorer@solotrip.io',
      city: 'Bangalore',
      state: 'Karnataka'
    };
    const demoToken = 'mock-jwt-token-demo-user-12345';
    setUser(demoUser);
    setToken(demoToken);
    localStorage.setItem('solo_trip_token', demoToken);
    localStorage.setItem('solo_trip_user', JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('solo_trip_token');
    localStorage.removeItem('solo_trip_user');
    localStorage.removeItem('token');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal
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
