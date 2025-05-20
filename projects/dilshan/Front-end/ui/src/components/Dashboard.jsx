import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import employee_icon from '../assets/images/employee.png';
import animal_icon from '../assets/images/animal-care.png';
import user_icon from '../assets/images/team.png';
import headerImage from '../assets/images/headerimage.png';

const services = [
  { id: 1, name: "Employee Management", candidates: "5", img: employee_icon, link: "/employees" },
  { id: 2, name: "User Management", candidates: "8", img: user_icon, link: "/users" },
  { id: 3, name: "Veterinary Service", candidates: "5", img: animal_icon, link: "/veterinary" },
  { id: 4, name: "Product Management", candidates: "10", img: employee_icon, link: "/products" },
  { id: 5, name: "Animal care", candidates: "10", img: animal_icon, link: "/animal-care" },
  { id: 6, name: "Service Handling", candidates: "10", img: animal_icon, link: "/alert" },
  { id: 7, name: "Tasks Alerts", candidates: "10", img: animal_icon, link: "/tasks" }
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Blue Header Section */}
      <div className="header-box">
        <div className="header-text">
          <h2>Good Morning, User</h2>
          <p>You have new notifications. Check them now!</p>
        </div>
        <img src={headerImage} alt="Header Visual" className="header-image" />
      </div>
      
      {/* Service Boxes */}
      <div className="service-grid">
        {services.map((service) => (
          <Link to={service.link} key={service.id} className="service-box">
            <div className="service-img-container">
              <img src={service.img} alt={service.name} />
            </div>
            <h3>{service.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard