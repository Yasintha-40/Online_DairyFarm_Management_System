// Home.js
import React, { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import './Home.css';

const Home = () => {
  const [notificationCount, setNotificationCount] = useState(5);
  const navigate = useNavigate();

  // Navigate to notifications page when clicking bell
  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <div className="admin-container">
      <Nav />
      <div className="main-content">
        {/* Content Header */}
        <div className="content-header">
          <div className="page-title">
            <h1>Dashboard Overview</h1>
          </div>
          <div className="notification-container">
            <div className="notification-icon" onClick={handleNotificationClick}>
              <FiBell size={24} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="dashboard">
          {/* Dashboard content (widgets, charts, etc.) */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
