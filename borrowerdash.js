
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './borrowerdash.css';
import LoanStatus from './loanstatus';
import TransactionHistory from './transac';
import BorrowerHeader from './borrowerheader';
import axios from 'axios';
import Footer from './footer';
import { jwtDecode } from 'jwt-decode';

const Borrowerdash = () => {
    const [loggedIn, setLoggedIn] = useState(true);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setLoggedIn(false);
        navigate('/login');
    };

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
                console.log("Decoded Token:", decodedToken);
        
                const userId = decodedToken?.id; // Use 'id' as per the decoded token
                if (!userId) {
                    throw new Error('Invalid token: id not found.');
                }
        
                console.log("Extracted User ID:", userId);
        
                // Fetch user data from the API
                const response = await axios.get(`http://localhost:3001/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
        
                if (response.status === 200) {
                    setUsername(response.data?.username || 'Unknown User');
                } else {
                    console.error("Unexpected response status:", response.status);
                    setError("Unexpected error occurred while fetching username.");
                }
            } catch (error) {
                console.error("Error fetching username:", error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                    setError(`Error: ${error.response.data.message || 'Failed to fetch username.'}`);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    setError("No response from server. Please try again later.");
                } else {
                    setError(error.message || "Failed to fetch username.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsername();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="dashboardb">
           <BorrowerHeader /> 
            <div >
                <div className="cover"> 
                    <img src="cover.png" alt="MSU-IIT NMPC Logo" className="banner"/>
                </div>
              <div className="content">
                <aside>
                    <div className="profile-section">
                        <div className="profile-info">
                            <img src="prof.png" alt="Profile" className="profile-photo" />
                            {/*<button className="edit">Edit Profile</button> */}
                            <h2 className="name2">{username || 'User'}</h2>
                            <h4 className="work">Business Owner</h4>
                            
                        </div>
                         
                        <div className="about-info">
                            <h4 className="about">About</h4>
                            <p><i className="fas fa-male" style={{ marginRight: '8px' }}></i>
                                <strong>Male</strong>
                            </p><hr />
                            <p><i className="fas fa-birthday-cake" style={{ marginRight: '8px' }}></i>
                                Born June 26, 1980
                            </p><hr />
                            <p><i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                                2nd Floor, Robinsons Mall, Macapagal Ave, Iligan City
                            </p><hr />
                            <p><i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                                charles5182@ummoh.com
                            </p><hr />
                            <p><i className="fas fa-phone" style={{ marginRight: '8px' }}></i>
                                33757005467
                            </p> <hr />
                            <div className="Log" onClick={handleLogout}>
                    
                    <div className="logoutcont">
                        <p>Logout </p>
                    </div>
                </div>
                        </div>
                    </div>
                </aside>
                <main>
                    <p className="welcome">Welcome back!</p>
                        <div className="cards-containerb">
                            {/* Active Loan Card */}
                            <div className="loan-card active-loan">
                                <div className="loan-details">
                                <h3>Active Loan</h3>
                                <p className="current">Loan Amount: ₱5,000</p>
                                <p className="due1">Payment amount: ₱300</p>
                                <p className="due1">Loan Account Number: 4398526514</p>
                                <p className="due">Pay on or before: Oct 15, 2024</p>
                                <p className="term">Remaining Term: 12 months</p>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: '40%' }}></div>
                                </div>
                                </div>
                            </div>

                            {/* Previous Loans Card */}
                            <div className="loan-card previous-loan">
                                <div className="loan-details">
                                <h3>Previous Loans</h3>
                                    <p className="current">Loan Amount: ₱10,000</p>
                                    <p className="due1">Payment amount: ₱300</p>
                                    <p className="due1">Loan Account Number: 4398526514</p>
                                    <p className="due">Repayment Term: 24 months</p>
                                    <p className="term">Status: Fully Repaid</p>
                                </div>
                            </div>
                            {/* Active Loan Card */}
                            <div className="loan-card active-loan">
                                <div className="loan-details">
                                <h3>Active Loan</h3>
                                <p className="current">Loan Amount: ₱5,000</p>
                                <p className="due1">Payment amount: ₱300</p>
                                <p className="due1">Loan Account Number: 4398526514</p>
                                <p className="due">Pay on or before: Oct 15, 2024</p>
                                <p className="term">Remaining Term: 12 months</p>
                                <div className="progress-bar">
                                    <div className="progressp" style={{ width: '60%' }}></div>
                                </div>
                                </div>
                            </div>
                        </div>

                            <LoanStatus />
                            <TransactionHistory />
                        </main>
                    </div>
                </div>
             <Footer/>
        </div>
    );
};

export default Borrowerdash;
