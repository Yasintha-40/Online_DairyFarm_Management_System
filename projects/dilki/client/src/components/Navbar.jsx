import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import "./CSS/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent);
  const sendVerificationOtp = async ()=>{

    try {
      axios.defaults.withCredentials = true;

      const {data}= await axios.post(backendUrl +'/api/auth/send-verify-otp')
      
      if(data.success){
           navigate('/email-verify')

           toast.success(data.message)
      }else
      {
        toast.error(data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
  }
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src={assets.logo} alt="Logo" onClick={() => navigate('/')} className="cursor-pointer" />
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li className="dropdown">
            <span>Employees ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/employees">Employee</Link></li>
              <li><Link to="/insertemployee">Add Employees</Link></li>
            </ul>
          </li>
          <li className="dropdown">
            <span>Animal Care ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/vet">Veterinary Management</Link></li>
              <li><Link to="/animals">Animals Management</Link></li>
            </ul>
          </li>
          <li><Link to="/products">Products</Link></li>
        </ul>

        {/* Profile Section */}
        {userData ? (
          <div className="profile" onClick={toggleDropdown}>
            <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
              {userData.name[0].toUpperCase()}
              {dropdownOpen && (
                <ul className="profile-dropdown">
                  {!userData.isAccountVerified && (
                    <li onClick={sendVerificationOtp} className="cursor-pointer">Verify Email</li>
                  )}
                  <li onClick={logout} className="cursor-pointer">Logout</li>
                </ul>
              )}
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="auth-button">
            Login <img src={assets.arrow_icon} alt="" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
