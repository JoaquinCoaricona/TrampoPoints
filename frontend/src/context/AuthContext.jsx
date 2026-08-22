import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser, getStoredAuth } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Control del modal de autenticación
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'

  // Al montar, inicializar con la sesión guardada y validar token
  useEffect(() => {
    const initAuth = async () => {
      const stored = getStoredAuth();
      if (stored.token) {
        setToken(stored.token);
        setUser(stored.user);
        try {
          const validatedUser = await getCurrentUser(stored.token);
          if (validatedUser) {
            setUser(validatedUser);
          } else {
            // Token inválido o expirado
            setUser(null);
            setToken(null);
          }
        } catch {
          // Si hay error de red se mantiene el stored.user temporalmente
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const result = await loginUser(email, password);
      setToken(result.token);
      setUser(result.user);
      setIsAuthModalOpen(false);
      return result;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const result = await registerUser(name, email, password);
      setToken(result.token);
      setUser(result.user);
      setIsAuthModalOpen(false);
      return result;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const openAuthModal = (mode = 'LOGIN') => {
    setError(null);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setError(null);
    setIsAuthModalOpen(false);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
