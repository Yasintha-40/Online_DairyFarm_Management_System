import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, food_list, setSearchTerm, searchTerm } = useContext(StoreContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(role);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    window.location.reload(); // Refresh the page to reflect logout state
  };

  const handleProfileClick = () => {
    if (role === "admin") {
      window.location.href = "http://localhost:5174"; // Admin home
    } else if (role === "employee") {
      navigate("/employee");
    } else if (role === "vet") {
      navigate("/vet");
    } else {
      navigate("/user");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("products")} className={menu === "products" ? "active" : ""}>Products</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
        <a href='' onClick={() => setMenu("help")} className={menu === "help" ? "active" : ""}>Help</a>
      </ul>

      <div className="navbar-right">
        <div className="search-container">
          {showSearch && (
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearch}
              autoFocus
            />
          )}
          <img 
            src={assets.search_icon} 
            alt="search" 
            onClick={toggleSearch}
            className={showSearch ? "active" : ""}
          />
        </div>
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="cart" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {isLoggedIn ? (
          <>
            <img className='profile' onClick={handleProfileClick} src={assets.profile_icon}/>
            <img className ="logout" onClick={logout} src={assets.logout_icon}/>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
