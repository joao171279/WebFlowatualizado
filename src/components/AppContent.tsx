import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginView } from './auth/LoginView';
import { Dashboard } from './Dashboard';

export const AppContent = () => {
  const { user } = useAuth();

  return user ? <Dashboard /> : <LoginView />;
};