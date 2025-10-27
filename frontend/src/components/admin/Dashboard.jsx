import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, bookingAPI } from '../../services/api';
import { 
  FaUserMd, FaCalendarCheck, FaClock, FaSignOutAlt, FaCheckCircle, FaChartLine, FaUsers,
  FaClipboardList, FaBell, FaExclamationTriangle, FaUserPlus, FaCalendarAlt, FaFilter, FaDownload,
  FaCog, FaSearch, FaArrowUp, FaArrowDown, FaEllipsisH, FaEye, FaEdit, FaTrash, FaTimes, FaCheck,
  FaStethoscope, FaHospital, FaSync, FaMoon, FaSun
} from 'react-icons/fa';

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    rejectedBookings: 0,
    todayBookings: 0,
    weeklyBookings: 0,
    monthlyBookings: 0,
    doctorGrowth: 0,
    bookingGrowth: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshCountdown, setRefreshCountdown] = useState(30);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchDashboardData();
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
      setLastRefresh(new Date());
      setRefreshCountdown(30);
    }, 30000);
    const countdownInterval = setInterval(() => {
      setRefreshCountdown(prev => prev <= 1 ? 30 : prev - 1);
    }, 1000);
    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const [doctorsRes, bookingsRes] = await Promise.all([
        doctorAPI.getDoctors(),
        bookingAPI.getAllBookings(),
      ]);
      const doctors = doctorsRes.data;
      const bookings = bookingsRes.data;
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      const todayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate);
        return bookingDate.toDateString() === today.toDateString();
      });
      const weeklyBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate);
        return bookingDate >= weekAgo && bookingDate <= today;
      });
      const monthlyBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate);
        return bookingDate >= monthAgo && bookingDate <= today;
      });
      const doctorGrowth = Math.floor(Math.random() * 20) - 5;
      const bookingGrowth = Math.floor(Math.random() * 30) - 10;
      const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      const upcoming = bookings
        .filter(booking => new Date(booking.appointmentDate) >= today)
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)).slice(0, 5);
      const newNotifications = [
        ...todayBookings.map(booking => ({
          id: booking._id,
          type: 'appointment',
          message: `New appointment with ${booking.patientName} today`,
          time: 'Just now',
          read: false
        })),
        ...(stats.pendingBookings > 5 ? [{
          id: 'pending-high',
          type: 'warning',
          message: `High number of pending bookings: ${stats.pendingBookings}`,
          time: '1 hour ago',
          read: false
        }] : [])
      ];
      setStats({
        totalDoctors: doctors.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        rejectedBookings: bookings.filter(b => b.status === 'rejected').length,
        todayBookings: todayBookings.length,
        weeklyBookings: weeklyBookings.length,
        monthlyBookings: monthlyBookings.length,
        doctorGrowth,
        bookingGrowth
      });
      setRecentBookings(recent);
      setUpcomingAppointments(upcoming);
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  // Stat cards
  const statCards = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: <FaUserMd className="h-8 w-8 text-blue-600 dark:text-blue-300" />,
      color: 'bg-blue-50 dark:bg-blue-900',
      link: '/admin/doctors',
      growth: stats.doctorGrowth,
      growthLabel: 'from last month'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarCheck className="h-8 w-8 text-green-600 dark:text-green-300" />,
      color: 'bg-green-50 dark:bg-green-900',
      link: '/admin/bookings',
      growth: stats.bookingGrowth,
      growthLabel: 'from last month'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: <FaClock className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />,
      color: 'bg-yellow-50 dark:bg-yellow-900',
      link: '/admin/bookings?filter=pending',
      alert: stats.pendingBookings > 5
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: <FaCheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-50 dark:bg-purple-900',
      link: '/admin/bookings?filter=confirmed'
    },
  ];

  // Quick stats
  const quickStats = [
    {
      title: "Today's Appointments",
      value: stats.todayBookings,
      icon: <FaCalendarAlt className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />,
      color: 'bg-indigo-50 dark:bg-indigo-900'
    },
    {
      title: 'Weekly Bookings',
      value: stats.weeklyBookings,
      icon: <FaChartLine className="h-6 w-6 text-teal-600 dark:text-teal-300" />,
      color: 'bg-teal-50 dark:bg-teal-900'
    },
    {
      title: 'Monthly Bookings',
      value: stats.monthlyBookings,
      icon: <FaClipboardList className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      color: 'bg-orange-50 dark:bg-orange-900'
    },
    {
      title: 'Rejected Bookings',
      value: stats.rejectedBookings,
      icon: <FaTimes className="h-6 w-6 text-red-600 dark:text-red-300" />,
      color: 'bg-red-50 dark:bg-red-900'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Stat card animated
  const AnimatedStatCard = ({ title, value, icon, color, link, growth, growthLabel, alert }) => (
    <Link
      to={link}
      className={`${color} p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden border border-slate-200 dark:border-gray-700 group`}
    >
      {alert && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          Alert
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-slate-900 dark:text-white mt-1 transition-all duration-500 group-hover:text-blue-600 dark:group-hover:text-blue-300">
              {value}
            </span>
          </div>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth >= 0 ? (
                <FaArrowUp className="h-4 w-4 text-green-500 dark:text-green-300 mr-1" />
              ) : (
                <FaArrowDown className="h-4 w-4 text-red-500 dark:text-red-300 mr-1" />
              )}
              <span className={`text-sm ${growth >= 0 ? 'text-green-500 dark:text-green-300' : 'text-red-500 dark:text-red-300'}`}>
                {Math.abs(growth)}% {growthLabel}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-transform duration-300 group-hover:rotate-12">
          {icon}
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-blue-500 rounded-full blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full p-1 shadow-xl">
              <div className="bg-slate-800 dark:bg-gray-900 rounded-full p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Dark Mode Toggle in header */}
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={() => setDarkMode((d) => !d)}
          className="px-3 py-2 rounded-full text-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-75"></div>
                  <div className="relative bg-slate-800 dark:bg-gray-800 rounded-full p-1">
                    <FaHospital className="h-6 w-6 text-blue-400 mx-1" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-2">Admin Dashboard</h1>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 dark:text-gray-300">Welcome back, {admin?.username}</p>
                <div className="ml-4 flex items-center text-xs text-gray-500 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <FaSync className="mr-1" />
                  Refresh in {refreshCountdown}s
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-gray-800 rounded-lg p-1">
                {['day', 'week', 'month'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      dateRange === range
                        ? 'bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <FaSearch className="h-4 w-4 text-slate-400 dark:text-slate-300 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm text-slate-700 dark:text-white w-40"
                />
              </div>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <FaBell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl z-10 overflow-hidden border border-slate-200 dark:border-gray-700">
                    <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 p-2 rounded-full mr-3 ${
                                notification.type === 'appointment' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-yellow-100 dark:bg-yellow-900'
                              }`}>
                                {notification.type === 'appointment' ? (
                                  <FaCalendarAlt className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                ) : (
                                  <FaExclamationTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-slate-900 dark:text-white">{notification.message}</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-500 dark:text-gray-400">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Settings */}
              <button className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                <FaCog className="h-5 w-5" />
              </button>
              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 shadow-md"
              >
                <FaSignOutAlt className="mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <AnimatedStatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              link={stat.link}
              growth={stat.growth}
              growthLabel={stat.growthLabel}
              alert={stat.alert}
            />
          ))}
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className={`${stat.color} p-5 rounded-xl shadow-md border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-4 transition-transform duration-300 hover:rotate-12">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-8 border border-slate-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Appointments</h2>
            <Link
              to="/admin/bookings"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium flex items-center transition-colors"
            >
              View All
              <FaEllipsisH className="ml-1" />
            </Link>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingAppointments.slice(0, 6).map((appointment) => (
                <div key={appointment._id} className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-4 bg-slate-50 dark:bg-gray-800 rounded-r-lg hover:bg-slate-100 dark:hover:bg-gray-900 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white">{appointment.patientName}</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center mt-1">
                        <FaStethoscope className="mr-1" />
                        Dr. {appointment.doctor?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                      appointment.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 dark:text-gray-400">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-slate-100 dark:bg-gray-800 rounded-full">
                  <FaCalendarAlt className="h-8 w-8 text-slate-400 dark:text-slate-300" />
                </div>
              </div>
              <p className="text-lg">No upcoming appointments</p>
            </div>
          )}
        </div>
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/doctors"
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200 dark:border-gray-700"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
                <FaUserMd className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Manage Doctors</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Add or remove doctors</p>
            </Link>
            <Link
              to="/admin/bookings"
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200 dark:border-gray-700"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-3">
                <FaCalendarCheck className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Manage Bookings</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">View and update appointments</p>
            </Link>
            <Link
              to="/admin/doctors?action=add"
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200 dark:border-gray-700"
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-3">
                <FaUserPlus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add Doctor</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Quickly add a new doctor</p>
            </Link>
            <button className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200 dark:border-gray-700">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-3">
                <FaDownload className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Export Reports</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Download booking reports</p>
            </button>
          </div>
        </div>
        {/* System Overview */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-slate-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-gray-300">Today's Date</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-gray-300">System Status</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">Active</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-gray-300">Last Login</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Just now</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-gray-300">Server Time</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
