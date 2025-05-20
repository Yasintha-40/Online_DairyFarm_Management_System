import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New product added: Milk', time: '2 hours ago', read: false },
    { id: 2, message: 'Product quantity low: Cheese', time: '5 hours ago', read: false },
    { id: 3, message: 'New order received', time: '1 day ago', read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="notifications-container">
      <Nav />
      <div className="notifications-content">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <button onClick={markAllAsRead} className="mark-all-read">
            Mark All as Read
          </button>
        </div>
        
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              {!notification.read && <div className="unread-indicator" />}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications; 