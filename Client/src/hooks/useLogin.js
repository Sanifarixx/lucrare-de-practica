import { useState } from 'react';
import { useAuthContext } from './UseAuthContext';

export const useLogin = () => {
  const [loginError, setloginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setloginError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setloginError(json.error || 'Logare incorecta');
      } else {
        localStorage.setItem('user', JSON.stringify(json));

        dispatch({ type: 'LOGIN', payload: json });

        setIsLoading(false);
      }
    } catch (loginError) {
      setIsLoading(false);
      setloginError('DB Lost.');
    }
  };

  return { login, isLoading, loginError, setloginError };
};
