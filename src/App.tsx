import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { useAuth } from './hooks/useAuth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Log the client ID (without exposing it fully)
console.log('Client ID configured:', CLIENT_ID ? 'Yes' : 'No');

if (!CLIENT_ID) {
  throw new Error('Google Client ID is not configured. Please check your environment variables.');
}

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log('AppContent rendered, isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;