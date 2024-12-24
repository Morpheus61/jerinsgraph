import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { handleLogin } = useAuth();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a202c',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          color: 'white',
          marginBottom: '2rem'
        }}>
          Sign In
        </h1>
        <div>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log('Login Success:', credentialResponse);
              handleLogin(credentialResponse);
            }}
            onError={() => {
              console.error('Login Failed');
            }}
          />
        </div>
      </div>
    </div>
  );
};
