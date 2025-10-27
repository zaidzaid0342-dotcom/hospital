import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaHospital,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const { login, loading, error, clearError } = useAuth();

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Block logic
  useEffect(() => {
    if (loginAttempts >= 3) {
      setIsBlocked(true);
      setBlockTimeLeft(30);
      const timer = setInterval(() => {
        setBlockTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsBlocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loginAttempts]);

  // Saved credentials
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) return;
    const result = await login(formData);
    if (!result.success) {
      setLoginAttempts(prev => prev + 1);
    } else {
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br
      from-blue-50 to-indigo-100
      dark:from-gray-900 dark:to-gray-800
      flex items-center justify-center p-6`}
    >
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Dark Mode Toggle with Moon & Sun Icons */}
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="px-3 py-2 rounded-full text-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-blue-500" />
            )}
          </button>
        </div>

        {/* Header */}
        <div className="text-center pb-8 border-b border-gray-100 dark:border-gray-700">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-full flex items-center justify-center shadow-md">
            <FaHospital className="h-12 w-12 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Admin Login</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Hospital Appointment Booking System</p>
        </div>

        {/* Error/Blocked */}
        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
          {isBlocked ? (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center">
              <FaExclamationCircle className="mr-2" />
              <div>
                <p className="font-medium">Too many failed attempts</p>
                <p className="text-sm">Please try again in {blockTimeLeft} seconds</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center">
              <FaExclamationCircle className="mr-2" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled={isBlocked}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                disabled={isBlocked}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-700 dark:text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
              Forgot password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading || isBlocked}
            className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="bg-gray-50 dark:bg-gray-800 px-10 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-start">
            <FaExclamationCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              For security purposes, please ensure you're logging in from a secure network.
              If you experience any issues, please contact the system administrator.
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          <p>© {new Date().getFullYear()} Hospital Appointment Booking System</p>
          <p className="mt-1">Version 1.0.0 | All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
