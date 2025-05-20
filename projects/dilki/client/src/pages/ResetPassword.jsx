import React, { useState, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const inputRefs = useRef(new Array(6).fill(null));

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

  // Send email to request OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Submit OTP and verify
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(input => input.value).join('');
    setOtp(otpArray);
    setIsOtpSubmited(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-reset-otp`, { email, otp: otpArray });
      if (data.success) {
        toast.success(data.message);
        setIsOtpSubmited(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  // Submit new password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-pass', { email, otp, newPassword });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* Email Input Form */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm mb-6'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <h3 className='text-indigo-300 text-center mb-6'>Enter your registered email address</h3>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="Email Icon" className='w-3 h-3' />
            <input
              type="email"
              placeholder='Email id'
              className='bg-transparent outline-none text-white w-full'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
        </form>
      )}

      {/* OTP Input Form */}
      {!isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
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

          <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      )}

      {/* New password form */}
      {isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm mb-6'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <h3 className='text-indigo-300 text-center mb-6'>Enter your new-password below</h3>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="Email Icon" className='w-3 h-3' />
            <input
              type="password"
              placeholder='Password'
              className='bg-transparent outline-none text-white w-full'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
