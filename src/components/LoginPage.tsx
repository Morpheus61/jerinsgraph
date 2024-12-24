import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export const LoginPage = () => {
  const { handleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (response: any) => {
    console.log('Login success:', response);
    setError(null);
    handleLogin(response);
  };

  const handleLoginError = () => {
    console.error('Login Failed');
    setError('Failed to sign in with Google. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Sign In
        </h1>
        <div className="flex flex-col items-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            useOneTap
            theme="filled_black"
            shape="pill"
            size="large"
          />
          {error && (
            <div className="mt-4 text-red-500 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
