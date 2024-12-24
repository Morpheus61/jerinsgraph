import React, { createContext, useState, useCallback, useEffect } from 'react';
import { CredentialResponse } from '@react-oauth/google';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  handleLogin: (response: CredentialResponse) => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider mounted');
  }, []);

  const handleLogin = useCallback((response: CredentialResponse) => {
    console.log('Login response received:', response);
    try {
      if (!response.credential) {
        console.error('No credential in response');
        return;
      }

      setAccessToken(response.credential);
      setIsAuthenticated(true);

      // Decode JWT to get user info
      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Decoded user info:', decoded);
      setUser(decoded);
    } catch (error) {
      console.error('Error handling login:', error);
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const handleLogout = useCallback(() => {
    console.log('Logging out');
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};