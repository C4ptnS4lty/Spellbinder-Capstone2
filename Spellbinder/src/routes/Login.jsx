import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';

function Login({ onLoginSuccess }) { // Receive onLoginSuccess as a prop
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameOrEmailChange = (event) => {
        setUsernameOrEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful, store user info and token in local storage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('authToken', data.token); // Store the token
                console.log('Login successful:', data);
                navigate('/');
                onLoginSuccess(data); // Call the callback function with user data and token

            } else {
                setError(data.error || 'Login failed.');
                console.error('Login failed:', data);
            }
        } catch (error) {
            setError('Network error. Please try again later.');
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="usernameOrEmail">Username or Email:</label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        value={usernameOrEmail}
                        onChange={handleUsernameOrEmailChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;