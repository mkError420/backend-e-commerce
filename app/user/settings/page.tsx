"use client";

import { useState } from "react";
import UserLayout from "../layout";
import { useAuth } from "@/contexts/AuthContext";

const UserSettings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Account Settings
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your orders and account activity</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    notifications ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    twoFactor ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    twoFactor ? "translate-x-6" : "translate-x-1"
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Use dark theme across the application</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    darkMode ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive promotional offers and product recommendations</p>
                </div>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    emailUpdates ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    emailUpdates ? "translate-x-6" : "translate-x-1"
                  }`}></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Privacy & Security
            </h3>
            
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <span className="text-gray-400"></span>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Download Your Data</p>
                    <p className="text-sm text-gray-500">Get a copy of your personal information</p>
                  </div>
                  <span className="text-gray-400"></span>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Delete Account</p>
                    <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                  </div>
                  <span className="text-red-400"></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              About
            </h3>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">MK Shop E-Commerce Platform</p>
                <p>Version 1.0.0</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Support</p>
                <p>Contact us at support@mkshop.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Terms & Privacy</p>
                <a href="#" className="text-blue-600 hover:text-blue-800">View Terms of Service</a>  
                <a href="#" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSettings;