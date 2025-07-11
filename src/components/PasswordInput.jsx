// src/components/PasswordInput.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ value, onChange, placeholder = "Password", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white pr-10"
        {...props}
      />
      <div
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 cursor-pointer text-gray-500 dark:text-gray-300"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  );
};

export default PasswordInput;
