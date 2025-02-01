import React, { useState } from "react";
import { Eye, EyeOff, Mail, Shield, CreditCard } from "lucide-react";
import Navbar from "@/components/navbar";

const ProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userProfile] = useState({
    email: "user@example.com",
    password: "secretpassword123",
    isVerified: false,
    subscriptionStatus: "Active",
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-yellow-400">
            Profile Settings
          </h1>

          {/* Email Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-yellow-400 flex items-center gap-2">
                <Mail size={20} />
                Email
              </label>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded text-sm font-medium"
                  onClick={() => alert("Verification email sent!")}
                >
                  Verify Email
                </button>
                <button
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-yellow-400 rounded text-sm font-medium"
                  onClick={() => alert("Reset password email sent!")}
                >
                  Forgot Password
                </button>
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded">{userProfile.email}</div>
          </div>

          {/* Password Section */}
          <div className="mb-6">
            <label className="text-yellow-400 flex items-center gap-2 mb-2">
              <Shield size={20} />
              Password
            </label>
            <div className="bg-gray-700 p-3 rounded flex items-center justify-between">
              <span className="flex-1">
                {showPassword
                  ? userProfile.password
                  : "•".repeat(userProfile.password.length)}
              </span>
              <button
                onClick={togglePassword}
                className="text-yellow-400 hover:text-yellow-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Status Section */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-yellow-400 flex items-center gap-2 mb-2">
                <Mail size={20} />
                Verification Status
              </label>
              <div className="bg-gray-700 p-3 rounded flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    userProfile.isVerified ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span>
                  {userProfile.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-yellow-400 flex items-center gap-2 mb-2">
                <CreditCard size={20} />
                Subscription Status
              </label>
              <div className="bg-gray-700 p-3 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>{userProfile.subscriptionStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
