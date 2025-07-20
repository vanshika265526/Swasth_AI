import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', email);
      localStorage.setItem('name', 'John Doe'); // You can replace this with actual fetched name
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-black dark:text-white">Login to your account</h2>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"/>
          </div>

          <p className="text-sm text-black dark:text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">Create one</Link>
          </p>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
