import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from '../firebase';
import { passwordCriteria } from '../lib/passwordValidator';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordValidations = () =>
    passwordCriteria.map(rule => rule.test(password));

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    const validations = getPasswordValidations();
    const allValid = validations.every(Boolean);

    if (!allValid) {
      alert("Password must include uppercase, lowercase, and a special character.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: name });

      await sendEmailVerification(userCredential.user);

      localStorage.setItem("tempUserEmail", email);
      localStorage.setItem("tempUserName", name);
      localStorage.setItem("name", name); // ✅ store name for later use

      setStep(2);
    } catch (error) {
      alert("Error creating account: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', localStorage.getItem("tempUserEmail"));
      localStorage.setItem('name', localStorage.getItem("tempUserName"));
      // Send ID token to backend to create/update user profile
      const token = await auth.currentUser.getIdToken();
      await fetch('http://localhost:5000/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: localStorage.getItem("tempUserName") }),
      });
      navigate('/');
    } else {
      alert("Email not verified yet. Please check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-black dark:text-white">
          {step === 1 ? 'Create your account' : 'Verify Your Email'}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleInitialSubmit} className="mt-8 space-y-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="mb-2 relative">
              <label className="block text-sm font-medium text-black dark:text-white">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white pr-10"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <p className="text-sm text-black dark:text-white">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
              {loading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-sm text-black dark:text-white text-center">
              Click the link sent to <strong>{email}</strong> and then press verify
            </p>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'I have verified my email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;