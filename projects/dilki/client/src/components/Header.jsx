import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import "./CSS/Header.css";

const Header = () => {
  const { userData } = useContext(AppContent);

  return (
    <div className="header-container flex flex-col items-center justify-center mt-20 px-4 text-center text-gray-800">
      {/* Profile Image */}
      <div className="relative mb-6 animate__animated animate__fadeIn">
        <img 
          src={assets.logo2} 
          alt="User Profile" 
          className="w-56 h-56 rounded-full mb-4 shadow-lg transform transition-transform duration-500 hover:scale-110"  // Further increased size
        />
      </div>

      {/* Greeting and Title */}
      <h1 className="flex items-center justify-center gap-2 text-xl sm:text-3xl font-medium mb-2 animate__animated animate__fadeIn">
        Hey {userData && userData.name ? userData.name : "Developer"}!
        <img className="w-8 aspect-square animate__animated animate__fadeIn animate__delay-1s" src={assets.hand_wave} alt="wave icon" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4 text-gradient animate__animated animate__fadeIn animate__delay-2s">
        Welcome to our website
      </h2>

      {/* Description */}
      <p className="mb-8 max-w-md px-4 animate__animated animate__fadeIn animate__delay-3s">
        Your personalized experience starts here! Let us guide you through the best features.
      </p>

      {/* Call to Action Button */}
      <button className="cta-button bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium px-8 py-3 rounded-full transition-all hover:bg-indigo-700">
        Get Started
      </button>
    </div>
  );
};

export default Header;
