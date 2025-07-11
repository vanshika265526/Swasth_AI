// src/components/SpinnerButton.jsx
import React from 'react';

const SpinnerButton = ({ isLoading, children, ...props }) => (
  <button
    disabled={isLoading}
    className={`w-full font-bold py-2 px-4 rounded-md ${
      isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-purple-600 hover:bg-purple-700 text-white'
    }`}
    {...props}
  >
    {isLoading ? (
      <div className="flex items-center justify-center gap-2">
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Processing...
      </div>
    ) : (
      children
    )}
  </button>
);

export default SpinnerButton;
