import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Stats from './Stats';
import Graphs from './Graphs';
import TransactionsTable from './TransactionsTable';
import './officerdashboard.css';

const Dashboard1 = () => {
  const navigate = useNavigate();

  // State variables
  const [username, setUsername] = useState('Unknown User');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage. Please log in.');
          setError('You must log in.');
          setLoading(false);
          navigate('/login');
          return;
        }

        // Decode the token and extract the user ID
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        const userId = decodedToken?.id; // Use 'id' as per the decoded token
        if (!userId) {
          throw new Error('Invalid token: id not found.');
        }

        console.log('Extracted User ID:', userId);

        // Fetch user data from the API
        const response = await axios.get(`http://localhost:3001/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUsername(response.data?.username || 'Unknown User');
        } else {
          console.error('Unexpected response status:', response.status);
          setError('Unexpected error occurred while fetching username.');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          setError(`Error: ${error.response.data.message || 'Failed to fetch username.'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('No response from server. Please try again later.');
        } else {
          setError(error.message || 'Failed to fetch username.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [navigate]);

  const handleLogout = () => {
    // Remove token and other user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setLoggedIn(false); // Update loggedIn state to false
    navigate('/login'); // Redirect to login page after logout
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log("username:", username);
  return (
    <div className="offdashboard">
      <header className="headeroff">
        <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff" />
        <h2 className="landingh2off">MSU-IIT National Multi-Purpose Cooperative</h2>
      </header>

      <div className="sidebar">
        <div className="profile">
          <img src="User_circle1.png" alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <h3 className="username">{username}</h3>
            
            <div className="username-divider"></div>
            <p className="role">Loan Clerk</p>
          </div>
        </div>
        <nav className="nav-menu">
          <Link to="/officerdashboard1">Dashboard</Link>
          <Link to="/OfficerDashboard2">Loan Applications</Link>
          <Link to="/OfficerDashboard3">Borrower List</Link>
          <Link to="/Officerprof">Profile</Link>
        </nav>

        <div className="Logoff" onClick={handleLogout}>
          <img src="Sign_out_squre.png" alt="Logout" className="outpicoff" />
          <div className="logoutcontoff">
            <Link to="/login" className="logoutoff">Logout</Link>
          </div>
        </div>
      </div>
      <div className="containeroff">
        <h1 className="loan-title">Loan Management System</h1>
        <Link to="/generate">
          <button className="generate-report-button">Generate Report</button>
        </Link>

        <Stats />
        <Graphs />
        <TransactionsTable />
      </div>
    </div>
  );
};

export default Dashboard1;
