import React from 'react';
import "./Footer.css";

// Import the icons
import facebookIcon from '../assets/images/facebook.png';
import instagramIcon from '../assets/images/instagram.png';
import linkedinIcon from '../assets/images/linkedin.png';
import emailIcon from '../assets/images/mail.png';
import phoneIcon from '../assets/images/phone.png';
import locationIcon from '../assets/images/location.png';

import logo from '../assets/images/logo.png'

const Footer = () => {
  return (
    
    <footer> <br/>
      {/* First Footer Section with Green Background */}
      <div className="footer-content-wrapper">
        <div className="footer-content">
          {/* Logo Section */}
          <div className="footer-logo">
            <img src={logo} alt="Farm Logo" className="footer-logo-img" />
            <p className="footer-description">Your trusted farm for fresh, organic produce.</p>
          </div>

          {/* Social Media Links */}
          <div className="footer-socials">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" className="social-icon" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instagramIcon} alt="Instagram" className="social-icon" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <p>
                <img src={emailIcon} alt="Email" className="contact-icon" /> contact@ceylondairyfarm.com
              </p>
              <p>
                <img src={phoneIcon} alt="Phone" className="contact-icon" /> +94 74 128 7674
              </p>
              <p>
                <img src={locationIcon} alt="Location" className="contact-icon" /> Thalahena, Malabe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Footer Section with Black Background (Copyright) */}
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Ceylon Dairy Farm. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer