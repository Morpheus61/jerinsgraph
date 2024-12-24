import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { handleLogin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Sign In
        </h1>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => console.error('Login Failed')}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};
