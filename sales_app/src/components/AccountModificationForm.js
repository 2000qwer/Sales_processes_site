import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AccountModificationForm.css'; // Import the CSS file for styling

const AccountModificationForm = ({ userData, onUpdateSuccess, userId }) => {
  const [newName, setNewName] = useState(userData.name);
  const [newEmail, setNewEmail] = useState(userData.email);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there is no user data, navigate to login
    if (!userData.name) {
      navigate('/');
    }
  }, [navigate, userData]);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleUpdateAccount = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/user/${userId}`,
        { name: newName, email: newEmail },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );

      onUpdateSuccess(response.data.user);
    } catch (error) {
      console.error('Error updating account:', error.message);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="account-modification-container">
      <h2>Account Modification</h2>
      <label>New Name:</label>
      <input
        type="text"
        value={newName}
        onChange={handleNameChange}
        className="account-modification-input"
      />
      <label>New Email:</label>
      <input
        type="email"
        value={newEmail}
        onChange={handleEmailChange}
        className="account-modification-input"
      />
      <div className="account-modification-buttons">
        <button onClick={handleUpdateAccount}>Update Account</button>
        <button onClick={handleBackToDashboard}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default AccountModificationForm;