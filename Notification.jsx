
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './NotificationPage.css';

const NotificationPage = () => {
  const notifications = [
    {
      id: 1,
      title: 'Product Expiration Alert',
      message: 'Product "Milk" will expire in 2 days',
      time: '2 hours ago',
      type: 'expiration'
    },
    {
      id: 2,
      title: 'Low Stock Warning',
      message: 'Product "Bread" is running low. Current stock: 5 units',
      time: '1 day ago',
      type: 'stock'
    },
    {
      id: 3,
      title: 'New Product Added',
      message: 'New product "Cheese" has been added to inventory',
      time: '3 days ago',
      type: 'new'
    }
  ];

  return (
    <div className="notification-page">
      <div className="notification-header">
        <Link to="/mainhome" className="back-button">
          <FiArrowLeft size={24} />
          <span>Back to Dashboard</span>
        </Link>
        <h1>Notifications</h1>
      </div>

      <div className="notification-list">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.type}`}
          >
            <div className="notification-content">
              <h3 className="notification-title">{notification.title}</h3>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage; 