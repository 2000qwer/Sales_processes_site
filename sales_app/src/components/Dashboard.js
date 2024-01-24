import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [salesData, setSalesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user details using the stored token
        const response = await axios.get('http://localhost:5001/api/user', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
        // If there's an error or no user data, navigate to the login page
        navigate('/');
      }
    };

    const fetchSalesData = async () => {
      try {
        // Fetch sales data from your API or database
        // For simplicity, I'm using a placeholder array here
        const response = await axios.get('http://localhost:5001/api/sales');
        setSalesData(response.data.sales);
      } catch (error) {
        console.error('Error fetching sales data:', error.message);
      }
    };

    fetchUserDetails();
    fetchSalesData();
  }, [navigate]);

  const handleAddSale = () => {
    navigate('/add-sale');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleCharts = () => {
    navigate('/charts');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // If there is no value in userData.name, navigate to the login page
  if (!userData.name) {
    navigate('/');
    return null; // Return null to prevent rendering the rest of the component
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav>
        <h1>Sales</h1>
        <ul>
          <li onClick={handleCharts}>Charts</li>
          <li onClick={handleAddSale}>Add Sale</li>
          <li onClick={handleViewProfile}>Profile</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1>Welcome, {userData.name}!</h1>
        <p className="dashboard-description">
          Explore sales data visualization, track your performance, and make informed decisions.
          This is your secure space to manage and analyze your sales activities.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;