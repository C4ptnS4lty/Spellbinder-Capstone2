import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/register', { //Will change to url for heroku
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        // Optionally, redirect the user to a login page or another area
        console.log('Registration successful:', data);

        if (data.token && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('authToken', data.token);
          console.log('Registration and automatic login successful, token:', data.token);
          if (onLoginSuccess) {
            onLoginSuccess(data.user, data.token); // Call the callback with user and token
          }
          navigate('/'); // Redirect to the home page or dashboard
        } else {
          console.log('Registration successful, please log in.');
          navigate('/'); // Redirect to the home page or dashboard
        }
      } else {
        setError(data.error || 'Registration failed.');
        console.error('Registration failed:', data);
      }
    } catch (error) {
      setError('Network error. Please try again later.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;