import React, { useEffect, useState } from 'react';
import './user.css';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import api from '../../utils/axios';

const User = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
          fetchOrders();
        } else {
          setError(response.data.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError(error.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/order/user-orders");
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          console.error(response.data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
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
      setError("User ID not found. Please try logging in again.");
      return;
    }

    try {
      const response = await api.put(`/api/user/update/${user._id}`, form);
      
      if (response.data.success) {
        alert("Profile updated successfully!");
        setUser({ ...user, ...form });
      } else {
        setError(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Something went wrong!");
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
        window.location.reload();
      } else {
        setError(response.data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || "Something went wrong!");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">User not found. Please try logging in again.</div>;

  return (
    <div className="user-page">
      <h1>Welcome {user.name}!</h1>
      <h2>Role: {user.role}</h2>

      <div className="user-content">
        <div className="profile-section">
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

            <div className="button-group">
              <button type="submit" className="update-button">Update</button>
              <button type="button" className="delete-button" onClick={handleDelete}>Delete Account</button>
            </div>
          </form>
        </div>
        <div className="orders-section">
          <h2>Your Orders</h2>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <p><b>Order Amount:</b> Rs.{order.amount}</p>
                <p><b>Ordered On:</b> {new Date(order.createdAt).toLocaleString()}</p>
                <div className="cart">
                  <div className="cart-items-title">
                    <p>Image</p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Status</p>
                    <p>Total</p>
                  </div>
                  <hr />
                  {order.items.map((item, idx) => (
                    <div key={item._id || idx} className="cart-items-item-row">
                      <img src={assets.parcel_icon} alt={item.name} />
                      <p>{item.name}</p>
                      <p>Rs.{item.price}</p>
                      <p>{item.quantity}</p>
                      <p>{order.status}</p>
                      <p>Rs.{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
