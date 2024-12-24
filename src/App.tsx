import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { useAuth } from './hooks/useAuth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!CLIENT_ID) {
  throw new Error('Google Client ID is not configured. Please check your environment variables.');
}

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;