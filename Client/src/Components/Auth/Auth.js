import React, { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { useSignup } from '../../hooks/useSignup';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [signinBtn, setSigninBtn] = useState('Sign in')
  const [signupBtn, setSignupBtn] = useState('Sign up')
  const [forgotBtn, setforgotBtn] = useState('Submit')
  const { login, loginError, isLoading } = useLogin();
  const { signup, signupError, signupIsLoading } = useSignup();
  const [success, setSuccess] = useState(null)
  const [isForgot, setIsForgot] = useState(false)
  const [isForgotLoading, setIsForgotLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [newConfirmPassword, setNewConfirmPassword] = useState("")

  useEffect(() => {
    if (loginError) {
      setErrors(prevErrors => [...prevErrors.slice(-3), loginError]);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }, [loginError]);

  useEffect(() => {
    if (signupError) {
      setErrors(prevErrors => [...prevErrors.slice(-3), signupError]);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }, [signupError]);

  const handleSwap = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false)
    setTimeout(() => {
      setIsForgot(false)
      setErrors([]);
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSigninBtn('Signing in');

    setTimeout(async () => {
      await login(email.toLowerCase(), password);
      setSigninBtn('Sign In');
    }, 300);
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupBtn('Signing up');

    setTimeout(async () => {
      await signup(name, email.toLowerCase(), password, otp);
      setSignupBtn('Sign Up');
    }, 300);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hanleGenOtp = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/genotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
        setTimeout(() => {
          setErrors(prevErrors => prevErrors.slice(1));
        }, 3000);
      } else {
        setSuccess('OTP Trimis cu succes')
        setTimeout(() => {
          setSuccess(null)
        }, 3000);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }

  const handleForget = async (e) => {
    e.preventDefault()
    setforgotBtn('Submitting')
    setIsForgotLoading(true)


    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/verifyotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
        setTimeout(() => {
          setErrors(prevErrors => prevErrors.slice(1));
        }, 3000);
      } else {
        setSuccess('OTP verificat. Sa schimbat parola.')
        setShowNewPassword(true)
        setTimeout(() => {
          setSuccess(null)
        }, 3000);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    } finally {
      setforgotBtn('Submit')
      setIsForgotLoading(false)
    }
  }

  const hanleForgotOtp = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/forgototp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
        setTimeout(() => {
          setErrors(prevErrors => prevErrors.slice(1));
        }, 3000);
      } else {
        setSuccess('OTP trimis cu succes')
        setTimeout(() => {
          setSuccess(null)
        }, 3000);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    }
  }

  const updatePassword = async (e) => {
    setforgotBtn('Submitting')
    setIsForgotLoading(true)
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, newConfirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors.slice(-3), errorData.error || 'An error occurred']);
        setTimeout(() => {
          setErrors(prevErrors => prevErrors.slice(1));
        }, 3000);
      } else {
        setSuccess('Parola modificata cu succes.')
        setNewPassword('')
        setNewConfirmPassword('')
        setEmail('')
        setPassword('')
        setOtp('')
        setShowNewPassword(false)
        setIsForgot(false)
        setTimeout(() => {
          setSuccess(null)
        }, 3000);
      }
    } catch (error) {
      setErrors(prevErrors => [...prevErrors.slice(-3), 'Network error']);
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.slice(1));
      }, 3000);
    } finally {
      setforgotBtn('Submit')
      setIsForgotLoading(false)
    }
  }

  return (
    <div className="loginSignup-background-container">
      <div className={`loginSignup-container ${isSignUp ? 'loginSignup-right-panel-active' : ''}`}>
        <div className="loginSignup-form-container loginSignup-sign-up-container">
          <form onSubmit={handleSignup}>
            <h1>Creează cont</h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="loginSignup-input-field"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="loginSignup-input-field"
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="loginSignup-input-field password-field"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-btn"
              >
                {showPassword ? <i className="fa fa-eye-slash icon-white"></i> : <i className="fa fa-eye icon-white"></i>}
              </button>
            </div>
            <div className="password-container">
              <input
                type={'text'}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                className="loginSignup-input-field password-field"
              />
              <button
                type="button"
                onClick={hanleGenOtp}
                className="toggle-otp-btn"
              >
                Trimite
              </button>
            </div>
            <button type="submit" className="loginSignup-btn" disabled={signupIsLoading}>
              {signupBtn}
            </button>
          </form>
        </div>

        <div className="loginSignup-form-container loginSignup-sign-in-container">
          {!isForgot && <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="loginSignup-input-field"
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="loginSignup-input-field password-field"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-btn"
              >
                {showPassword ? <i className="fa fa-eye-slash icon-white"></i> : <i className="fa fa-eye icon-white"></i>}
              </button>
            </div>
            <p onClick={() => setIsForgot(true)} className='loginSignup-forgot-password'>Forgot Password</p>
            <button type="submit" className="loginSignup-btn" disabled={isLoading}>
              {signinBtn}
            </button>
          </form>}

          {isForgot &&
            <>
              <form onSubmit={!showNewPassword ? handleForget : updatePassword}>
                <h1>Forgot Password</h1>
                {!showNewPassword && <><input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="loginSignup-input-field"
                />
                  <div className="password-container">
                    <input
                      type={'text'}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="OTP"
                      className="loginSignup-input-field password-field"
                    />
                    <button
                      type="button"
                      onClick={hanleForgotOtp}
                      className="toggle-otp-btn"
                    >
                      Trimite
                    </button>
                  </div></>}

                {showNewPassword && <><input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="loginSignup-input-field"
                />
                  <input
                    type="text"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="loginSignup-input-field"
                  />
                </>}

                <p onClick={() => setIsForgot(false)} className='loginSignup-forgot-password'>Back to Sign In</p>
                <button type="submit" className="loginSignup-btn" disabled={isForgotLoading}>
                  {forgotBtn}
                </button>
              </form> </>}
        </div>

        <div className="loginSignup-overlay-container">
          <div className="loginSignup-overlay">
            <div className="loginSignup-overlay-panel loginSignup-overlay-left">
              <h1>Bine ai revenit!</h1>
              <p>Pentru a rămâne conectat(ă) cu noi, vă rugăm să vă autentificați cu informațiile dumneavoastră personale</p>
              <button className="loginSignup-ghost" onClick={handleSwap}>
                Sign In
              </button>
            </div>
            <div className="loginSignup-overlay-panel loginSignup-overlay-right">
              {!isForgot && (
                <>
                  <h1>Salut, Prietene!</h1>
                  <p>Introdu datele tale personale și începe călătoria alături de noi.</p>
                </>
              )}
              {isForgot && (
                <>
                  <h1>Aţi uitat parola?</h1>
                  <p>Introdu adresa ta de e-mail și codul OTP pentru a reseta parola.</p>
                </>
              )}

              <button className="loginSignup-ghost" onClick={handleSwap}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-errors-container">
        {errors.map((error, index) => (
          <div key={index} className="auth-error">
            {error}
          </div>
        ))}
        {success && <div className='auth-error profile-Succ-msg'>
          {success}
        </div>}
      </div>
    </div>
  );
};

export default Auth;