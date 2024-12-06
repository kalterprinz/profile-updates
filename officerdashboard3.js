import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import
import './officerdashboard.css';

const Dashboard3 = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [borrowers, setBorrowers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user and borrower data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Redirecting to login...');
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;

        if (!userId) {
          throw new Error('Invalid token: User ID not found.');
        }

        setIsLoading(true);
        
        // Fetch username
        const userResponse = await fetch(`http://localhost:3001/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUsername(userData.username || 'Unknown User');

        // Fetch borrowers
        const borrowersResponse = await fetch('http://localhost:3001/borrowers/approved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!borrowersResponse.ok) throw new Error('Failed to fetch approved borrowers');
        const borrowersData = await borrowersResponse.json();
        setBorrowers(borrowersData);
      } catch (error) {
        console.error('Error during fetch:', error);
        if (error.message.includes('token')) navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch individual borrower details
  const fetchBorrowerDetails = async (borrowerId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Redirecting to login...');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3001/borrowers/${borrowerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch borrower details');
      const data = await response.json();
      setSelectedBorrower(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching borrower details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  };

  const filteredBorrowers = borrowers.filter((borrower) =>
    Object.values(borrower)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  return (
    <div className="offdashboard">
      <header className="headeroff">
        <img src="logo.png" alt="MSU-IIT NMPC Logo" className="logooff" />
        <h2 className="landingh2off2">MSU-IIT National Multi-Purpose Cooperative</h2>
      </header>

      <div className="sidebar">
        <div className="profile">
          <img src="prof.png" alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <h3 className="username">{username}</h3> {/* Display the dynamic username */}
            <div className="username-divider"></div>
            <p className="role">Loan Clerk</p>
          </div>
        </div>
        <nav className="nav-menu">
          <Link to="/officerdashboard1">Dashboard</Link>
          <Link to="/OfficerDashboard2">Loan Applications</Link>
          <Link to="/OfficerDashboard3">Borrower List</Link>
          <Link to="/payment">Payment</Link>
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
        <div className="pending-table">
          <div className="pending-header">
            <span>Borrower List</span>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search borrowers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Active Loan</th>
                <th>Loan Type</th>
                <th>Repayment Status</th>
                <th>Payment Due Date</th>
                <th>Loan Term</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.length > 0 ? (
                filteredBorrowers.map((borrower) => (
                  <tr key={borrower._id}>
                    <td>{borrower.applicantName}</td>
                    <td>{borrower.loanAmount}</td>
                    <td>{borrower.loanType}</td>
                    <td>{borrower.repaymentSchedule}</td>
                    <td>{borrower.paymentDueDate}</td>
                    <td>{borrower.loanTerm}</td>
                    <td>{borrower.paymentStatus}</td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => fetchBorrowerDetails(borrower._id)}
                      >
                        View more..
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No borrowers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedBorrower && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Borrower Details</h2>
            <p><strong>Name:</strong> {selectedBorrower.applicantName}</p>
            <p><strong>Email Address:</strong> {selectedBorrower.emailAddress}</p>
            <p><strong>Permanent Address:</strong> {selectedBorrower.permanentAddress}</p>
            <p><strong>Present Address:</strong> {selectedBorrower.presentAddress}</p>
            <p><strong>Tel/Mobile:</strong> {selectedBorrower.telMob}</p>
            <p><strong>Age:</strong> {selectedBorrower.age}</p>
            <p><strong>Sex:</strong> {selectedBorrower.sex}</p>
            <p><strong>Civil Status:</strong> {selectedBorrower.civilStatus}</p>
            <p><strong>Spouse Name:</strong> {selectedBorrower.spouseName}</p>
            <p><strong>Spouse Occupation:</strong> {selectedBorrower.spouseOccu}</p>
            <p><strong>Location:</strong> {selectedBorrower.location}</p>
            <p><strong>Loan Type:</strong> {selectedBorrower.loanType}</p>
            <p><strong>Loan Amount:</strong> {selectedBorrower.loanAmount}</p>
            <p><strong>Loan Term:</strong> {selectedBorrower.loanTerm}</p>
            <p><strong>Purpose of Loan:</strong> {selectedBorrower.purposeLoan}</p>
            <p><strong>Employer:</strong> {selectedBorrower.employer}</p>
            <p><strong>Employer Contact:</strong> {selectedBorrower.empCon}</p>
            <p><strong>Employment Status:</strong> {selectedBorrower.empStatus}</p>
            <p><strong>Business Name:</strong> {selectedBorrower.businessName}</p>
            <p><strong>Business Address:</strong> {selectedBorrower.businessAdd}</p>
            <p><strong>Membership Length:</strong> {selectedBorrower.lengthMem}</p>
            <p><strong>Share Capital:</strong> {selectedBorrower.shareCapital}</p>
            <p><strong>Savings Deposit:</strong> {selectedBorrower.savingsDepo}</p>
            <p><strong>Other Deposit:</strong> {selectedBorrower.otherDepo}</p>
            <p><strong>Collateral:</strong> {selectedBorrower.collateral}</p>
            <p><strong>Source of Payment:</strong> {selectedBorrower.sourcePay}</p>
            <p><strong>Payment Mode:</strong> {selectedBorrower.modePay}</p>
            <p><strong>Payment Schedule:</strong> {selectedBorrower.repaymentSchedule}</p>
            <p><strong>Loan Due Date:</strong> {selectedBorrower.loanDueDate}</p>
            <p><strong>Guarantor Name:</strong> {selectedBorrower.guarantorName}</p>
            <p><strong>Guarantor Contact:</strong> {selectedBorrower.guarantorContact}</p>
            <p><strong>Guarantor Address:</strong> {selectedBorrower.guarantorAddress}</p>
            <p><strong>Guarantor Relationship:</strong> {selectedBorrower.guarantorRel}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard3;
