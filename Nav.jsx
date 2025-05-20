import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCaretDown, FaSearch } from "react-icons/fa";
import "./Nav.css";

const Nav = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
      {/* Navigation Bar */}
     
      {/* Additional Links Section */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Home, Add Product, Products Details Links */}
          <div>
            <ul className="home-ul">
              <li className="home-ll">
                <Link to="/mainhome" className="active home-a">
                  <h1>Home</h1>
                </Link>
              </li>
              <li className="home-ll">
                <Link to="/addproduct" className="active home-a">
                  <h1>Add Product</h1>
                </Link>
              </li>
              <li className="home-ll">
                <Link to="/productsdetails" className="active home-a">
                  <h1>Products Details</h1>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;