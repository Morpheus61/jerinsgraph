import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { BarChart, AlertCircle } from 'lucide-react';
import type { CredentialResponse } from '@react-oauth/google';

interface LoginError {
  message: string;
  visible: boolean;
}

export const LoginPage = () => {
  const { handleLogin } = useAuth();
  const [error, setError] = useState<LoginError>({ message: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = async (response: CredentialResponse) => {
    try {
      setIsLoading(true);
      setError({ message: '', visible: false });
      await handleLogin(response);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Login failed. Please try again.',
        visible: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    setError({
      message: 'Google login failed. Please try again later.',
      visible: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BarChart className="w-16 h-16 text-indigo-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Jerin's Graph Generator
          </h1>
          <p className="text-gray-400 mb-8">
            Sign in with Google to visualize your spreadsheet data instantly
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
          {error.visible && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error.message}</span>
            </div>
          )}
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="circle"
              disabled={isLoading}
              ux_mode="popup"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
