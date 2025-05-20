import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../assets/assets';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPopup = ({ setShowLogin }) => {
  const { url } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(data => ({ ...data, [name]: value }));
  };

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      if (currState === "Sign Up") {
        const { data: response } = await axios.post(`${url}/api/auth/register`, data);
        
        if (response.success) {
          toast.success('Registration successful!');
          setShowLogin(false);
          navigate('/');
        } else {
          toast.error(response.message || 'Registration failed');
        }
      } else {
        const { data: response } = await axios.post(`${url}/api/auth/login`, {
          email: data.email,
          password: data.password
        });

        if (response.success) {
          toast.success('Login successful!');
          setShowLogin(false);

          // Save login info in localStorage
          localStorage.setItem("token", response.token);
          localStorage.setItem("role", response.role);
          localStorage.setItem("email", data.email);
          if (response.employeeId) {
            localStorage.setItem("employeeId", response.employeeId);
          }

          // Redirect based on role
          if (response.role === "admin") {
            window.location.href = "http://localhost:5173";
          } else if (response.role === "employee") {
            navigate("/employee");
          } else if (response.role === "vet") {
            navigate("/vet");
          } else {
            navigate("/user");
          }
        } else {
          toast.error(response.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={onSubmitHandler}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <>
              <input
                type='text'
                name='name'
                placeholder='Your name'
                value={data.name}
                onChange={onChangeHandler}
                required
              />
              <input
                type='text'
                name='phone'
                placeholder='Your number'
                value={data.phone}
                onChange={onChangeHandler}
                required
              />
            </>
          )}

          <input
            type='email'
            name='email'
            placeholder='Your email'
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={data.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        <div className='login-popup-toggle'>
          {currState === "Login" ? (
            <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
