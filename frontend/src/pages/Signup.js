import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// --- 1. IMPORT THE NEW COMPONENTS ---
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    // --- 2. YOUR CLIENT ID HAS BEEN ADDED ---
    const googleClientId = "438675795459-cm0g2oguf5cq67jck34gpfa015vq5u23.apps.googleusercontent.com";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email, and password are required');
        }
        try {
            const url = "http://localhost:8080/auth/signup";
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/login'), 1000);
            } else {
                handleError(message || error?.details[0].message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    // --- 3. UPDATED GOOGLE SUCCESS HANDLER ---
    // The response object is different in the new library
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const url = "http://localhost:8080/auth/google-signup";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                // The token is now in credentialResponse.credential
                body: JSON.stringify({
                    token: credentialResponse.credential
                })
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
        handleError("Google signup failed. Please try again.");
    };

    return (
        // --- 4. WRAP YOUR COMPONENT WITH THE PROVIDER ---
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className='container'>
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='name'
                            autoFocus
                            placeholder='Enter your name...'
                            value={signupInfo.name}
                        />
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={signupInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={signupInfo.password}
                        />
                    </div>
                    <button type='submit'>Signup</button>
                    <div className='or-divider'>
                        <span>OR</span>
                    </div>

                    {/* --- 5. USE THE NEW GOOGLELOGIN COMPONENT --- */}
                    <div className='google-login-container'>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                        />
                    </div>

                    <span>Already have an account?
                        <Link to="/login"> Login</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </GoogleOAuthProvider>
    );
}

export default Signup;

