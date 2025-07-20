import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [step, setStep] = useState(1); // 1: form, 2: OTP
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      navigate('/');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-black dark:text-white">
          {step === 1 ? 'Create your account' : 'Verify OTP'}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleInitialSubmit} className="mt-8 space-y-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"/>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"/>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"/>
            </div>

            <p className="text-sm text-black dark:text-white">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">Continue</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-sm text-black dark:text-white text-center">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>
            <input type="text" placeholder="Enter OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"/>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
              Verify OTP & Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;

