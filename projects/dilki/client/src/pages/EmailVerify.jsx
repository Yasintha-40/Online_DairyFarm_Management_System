import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';

const EmailVerify = () => {
  axios.defaults.withCredentials = true; // Ensure cookies are sent for authentication

  const { backendUrl, getUserData, isLoggedIn, userData } = useContext(AppContent);
  const inputRefs = useRef(new Array(6).fill(null));
  const navigate = useNavigate();

  // Handle input navigation
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    pasteData.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Submit OTP verification
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otp = inputRefs.current.map((input) => input.value).join('');

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-email`, { otp });

      if (data.success) {
        toast.success(data.message);
        await getUserData(); // Ensure userData is updated
        setTimeout(() => {
          navigate('/'); // Delay navigation to allow context update
        }, 500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
  };

  // Check user status and redirect if already verified
  useEffect(() => {
    console.log("Checking user verification status...");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("userData:", userData);

    if (isLoggedIn && userData?.isAccountVerified) {
      console.log("Verified! Redirecting to home...");
      setTimeout(() => navigate('/'), 500); 
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <h3 className='text-indigo-300 text-center mb-6'>Enter the 6-digit code sent to your email</h3>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array.from({ length: 6 }, (_, index) => (
            <input
              type="text"
              maxLength="1"
              key={index}
              required
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button type="submit" className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
