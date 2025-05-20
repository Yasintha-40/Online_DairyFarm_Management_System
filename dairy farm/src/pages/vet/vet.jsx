import React, { useEffect, useState } from 'react';
import './vet.css';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { assets } from '../../assets/assets';
import api from '../../utils/axios';
// Import local components
import AddVaccine from '../../components/AddVaccine/AddVaccine';
import Vaccines from '../../components/VaccineDetails/Vaccines';
import AddCow from '../../components/AddCow/AddCow';
import Cows from '../../components/CowDetails/Cows';

const Vet = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/profile");
        if (response.data.success) {
          setUser(response.data.data);
          setForm({
            name: response.data.data.name,
            email: response.data.data.email,
            phone: response.data.data.phone,
          });
        } else {
          setError(response.data.message || "Failed to fetch user data");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch user data. Please try again later.");
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      setError("User ID not found. Please try again.");
      return;
    }

    try {
      const response = await api.put(`/api/user/update/${user._id}`, form);
      if (response.data.success) {
        alert("Profile updated successfully!");
        // Update the user state with new data
        setUser(prevUser => ({
          ...prevUser,
          ...form
        }));
      } else {
        setError(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Failed to update profile. Please try again later.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const response = await api.delete("/api/user/delete");
      if (response.data.success) {
        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
      } else {
        setError(response.data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || "Failed to delete account. Please try again later.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">User not found. Please try logging in again.</div>;

  return (
    <div className="vet-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-options">
          <NavLink 
            to="/vet" 
            className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
            onClick={() => setShowProfile(!showProfile)}
          >
            <img src={assets.profile_icon} alt="Profile" />
            <p>Profile Details</p>
          </NavLink>
          <NavLink 
            to="/vet/addvaccine" 
            className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
            onClick={() => setShowProfile(false)}
          >
            <img src={assets.selector_icon} alt="Add Vaccine" />
            <p>Add Vaccine</p>
          </NavLink>
          <NavLink 
            to="/vet/vaccinedetails" 
            className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
            onClick={() => setShowProfile(false)}
          >
            <img src={assets.selector_icon} alt="Vaccine Details" />
            <p>Vaccine Details</p>
          </NavLink>
          <NavLink 
            to="/vet/addcow" 
            className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
            onClick={() => setShowProfile(false)}
          >
            <img src={assets.selector_icon} alt="Add Sick Animal" />
            <p>Add Sick Animal</p>
          </NavLink>
          <NavLink 
            to="/vet/cowdetails" 
            className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
            onClick={() => setShowProfile(false)}
          >
            <img src={assets.selector_icon} alt="Sick Animal Details" />
            <p>Sick Animal Details</p>
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="vet-content">
        {showProfile ? (
          <div className="profile-details">
            <h1>Welcome {user.name}!</h1>
            <h2>Role: {user.role}</h2>

            <form className="update-form" onSubmit={handleUpdate}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
              <button type="submit">Update</button>
            </form>

            <button className="delete-button" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Vet;
