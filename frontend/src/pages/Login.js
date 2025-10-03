import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Import Google components
import { handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    // --- 1. ADD YOUR GOOGLE CLIENT ID HERE ---
    const googleClientId = "438675795459-cm0g2oguf5cq67jck34gpfa015vq5u23.apps.googleusercontent.com";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = "http://localhost:8080/auth/login";
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, email: userEmail, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                // Store user info as an object
                localStorage.setItem('loggedInUser', JSON.stringify({ name, email: userEmail }));
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else {
                handleError(message || error?.details[0].message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    // --- 2. ADD GOOGLE LOGIN HANDLERS (SAME AS SIGNUP) ---
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // We reuse the same endpoint for signup and login
            const url = "http://localhost:8080/auth/google-signup";
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            const result = await response.json();
            const { success, message, jwtToken, name, email } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', JSON.stringify({ name, email }));
                setTimeout(() => navigate('/home'), 1000);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleGoogleFailure = (error) => {
        console.error("Google login failed", error);
        handleError("Google login failed. Please try again.");
    };

    return (
        // --- 3. WRAP THE COMPONENT WITH THE PROVIDER ---
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className='container'>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={loginInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                        />
                    </div>
                    <button type='submit'>Login</button>

                    <div className='or-divider'>
                        <span>OR</span>
                    </div>

                    {/* --- 4. ADD THE GOOGLE LOGIN BUTTON --- */}
                    <div className='google-login-container'>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                        />
                    </div>

                    <span>Don't have an account?
                        <Link to="/signup"> Signup</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;
