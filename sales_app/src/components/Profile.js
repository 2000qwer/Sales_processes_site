import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountModificationForm from './AccountModificationForm';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  const checkUserDataAndNavigate = useCallback((data) => {
    if (!localStorage.getItem('token')) {
        console.log('No user found. Redirecting to login...');
        navigate('/');
        return;
    }
    else if (!data || !data.user || !data.user.name) {
      console.log('Navigating to login');
      navigate('/');
    } else {
      console.log('Setting user data:', data.user);
      setUserData(data.user);
      setUserId(data.user.id);
    }
  }, [navigate]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/user', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      checkUserDataAndNavigate(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error.message);

      // Check for a 500 status code in the response
      if (error.response && error.response.status === 500) {
        console.log('Internal server error. Redirecting to login...');
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleUpdateSuccess = (updatedUser) => {
    setUserData(updatedUser);
    setIsEditing(false);
  };

  

  return (
    <div className="profile-container">
      {userData.name && (
        <>
          <h1>Profile</h1>
          {isEditing ? (
            <AccountModificationForm userData={userData} onUpdateSuccess={handleUpdateSuccess} userId={userId} />
          ) : (
            <div>
              <h2>Welcome, {userData.name}!</h2>
              <p>Email: {userData.email}</p>
              <button onClick={() => setIsEditing(true)}>Edit Account</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;