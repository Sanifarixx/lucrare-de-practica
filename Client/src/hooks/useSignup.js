import { useState } from 'react';
import { useAuthContext } from './UseAuthContext';

export const useSignup = () => {
  const [signupError, setSignupError] = useState(null);
  const [signupIsLoading, setSignupIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password, otp) => {
    setSignupIsLoading(true);
    setSignupError(null);

    try {
      const otpResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/verifyotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const jsonOtp = await otpResponse.json();
      if (!otpResponse.ok) {
        setSignupIsLoading(false);
        setSignupError(jsonOtp.error || 'OTP verificare incorecta.');
      } else {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const json = await response.json();

        if (!response.ok) {
          setSignupIsLoading(false);
          setSignupError(json.error || 'Ceva nu a mers bine. Vă rugăm să încercați din nou..');
        } else {
          localStorage.setItem('user', JSON.stringify(json));

          dispatch({ type: 'LOGIN', payload: json });

          setSignupIsLoading(false);
          setSignupError(null);
        }
      }
    } catch (error) {
      setSignupIsLoading(false);
      setSignupError('DB error.');
    }
  };

  return { signup, signupIsLoading, signupError, setSignupError };
};
