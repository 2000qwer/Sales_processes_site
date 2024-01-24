import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import the CSS file for styling

const LoginForm = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5001/api/login', formData);
      localStorage.setItem('token', response.data.token);
  
      // Set user information in the state, including _id
      setUser({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        // Add other user information as needed
      });
  
      // Clear any previous login error
      setLoginError('');
  
      // Display a success message (you can customize this)
      console.log('Login successful!');
  
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
  
      // Set the login error message
      setLoginError('Invalid credentials. Please try again.');
  
      // Display an alert for wrong credentials
      window.alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sales Site Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>

        {/* Display login error if present */}
        {loginError && <p className="login-error">{loginError}</p>}

        {/* Registration button */}
        <p className="registration-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;