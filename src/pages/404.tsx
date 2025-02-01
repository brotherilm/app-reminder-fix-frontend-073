// pages/404.tsx
import React from "react";

const Custom404: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-black p-8 rounded-lg shadow-md text-center border-4 border-yellow-300">
        <h1 className="text-9xl font-bold text-yellow-300">404</h1>
        <p className="text-2xl font-semibold text-yellow-300 mt-4">
          Oops! Page Not Found
        </p>
        <p className="text-yellow-300 mt-2">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-yellow-300 text-black text-lg font-medium rounded-lg shadow hover:bg-yellow-400 transition duration-300"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default Custom404;
