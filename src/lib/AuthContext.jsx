import React, { createContext, useState, useContext, useEffect } from 'react';
import { api as base44 } from '@/api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // No modo local, simulamos que as configurações públicas foram carregadas com sucesso
      setAppPublicSettings({ id: 'local-app', public_settings: {} });
      
      // Iniciamos a verificação de usuário
      await checkUserAuth();
      
      setIsLoadingPublicSettings(false);
    } catch (error) {
      console.error('Erro ao carregar estado inicial:', error);
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      
      // Utiliza o mock do apiClient para obter os dados do usuário Rogério
      const currentUser = await base44.auth.me();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('Falha na autenticação local:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Chama o método de logout do seu novo apiClient
    base44.auth.logout();
  };

  const navigateToLogin = () => {
    // No modo local, apenas simulamos o redirecionamento ou mostramos no console
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
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