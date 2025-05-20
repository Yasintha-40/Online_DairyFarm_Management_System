import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";
import logo from '../assets/images/logo.png'

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li className="dropdown">
            <span>Employees ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/employees">Employee</Link></li>
              <li><Link to="/insert">Add Employees</Link></li>
            </ul>
          </li>
          <li className="dropdown">
            <span>Animal Care ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/employees">Vetinary Management</Link></li>
              <li><Link to="/insertemployee">Animals Management</Link></li>
            </ul>
          </li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="#">Products</Link></li>
        </ul>

        {/* Profile Section */}
        <div className="profile" onClick={toggleDropdown}>
          <img 
            src="https://www.w3schools.com/howto/img_avatar.png" 
            alt="User Profile" 
            className="profile-img"
          />
          <span className="profile-name">John Doe ▾</span>

          {/* Dropdown (Only Sign Out) */}
          {dropdownOpen && (
            <ul className="profile-dropdown">
              <li><Link to="#">Sign Out</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
