// src/components/RegistrationForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationForm = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send registration data to the server
      const response = await axios.post('http://localhost:5001/api/register', formData);
      console.log('Received token:', response.data.token);
      // Set user information in the state
      setUser({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        // Add other user information as needed
      });
      localStorage.setItem('token', response.data.token);
      // Redirect to the dashboard upon successful registration
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error.message);
      // Handle registration error, e.g., show an error message to the user
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Sales Site Registration</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <button type="submit" className="registration-button">Register</button>

        {/* Login link */}
        <p className="login-link">Already have an account? <Link to="/">Login here</Link></p>
      </form>
    </div>
  );
};

export default RegistrationForm;