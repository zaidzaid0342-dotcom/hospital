import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, bookingAPI } from '../../services/api';
import { 
  FaUserMd, 
  FaCalendarCheck, 
  FaClock, 
  FaSignOutAlt,
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaClipboardList,
  FaBell,
  FaExclamationTriangle,
  FaUserPlus,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaCog,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisH,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaStethoscope,
  FaHospital,
  FaSync
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

  useEffect(() => {
    fetchDashboardData();
    
    // Set up automatic refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
      setLastRefresh(new Date());
      setRefreshCountdown(30);
    }, 30000);
    
    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up intervals on component unmount
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
      
      // Calculate date ranges
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      
      // Filter bookings by date range
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
      
      // Calculate growth (mock data for demo)
      const doctorGrowth = Math.floor(Math.random() * 20) - 5;
      const bookingGrowth = Math.floor(Math.random() * 30) - 10;
      
      // Get recent bookings (last 5)
      const recent = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      // Get upcoming appointments (next 5)
      const upcoming = bookings
        .filter(booking => new Date(booking.appointmentDate) >= today)
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 5);
      
      // Create notifications
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
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: <FaUserMd className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50',
      link: '/admin/doctors',
      growth: stats.doctorGrowth,
      growthLabel: 'from last month'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarCheck className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50',
      link: '/admin/bookings',
      growth: stats.bookingGrowth,
      growthLabel: 'from last month'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: <FaClock className="h-8 w-8 text-yellow-600" />,
      color: 'bg-yellow-50',
      link: '/admin/bookings?filter=pending',
      alert: stats.pendingBookings > 5
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: <FaCheckCircle className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50',
      link: '/admin/bookings?filter=confirmed'
    },
  ];

  const quickStats = [
    {
      title: "Today's Appointments",
      value: stats.todayBookings,
      icon: <FaCalendarAlt className="h-6 w-6 text-indigo-600" />,
      color: 'bg-indigo-50'
    },
    {
      title: 'Weekly Bookings',
      value: stats.weeklyBookings,
      icon: <FaChartLine className="h-6 w-6 text-teal-600" />,
      color: 'bg-teal-50'
    },
    {
      title: 'Monthly Bookings',
      value: stats.monthlyBookings,
      icon: <FaClipboardList className="h-6 w-6 text-orange-600" />,
      color: 'bg-orange-50'
    },
    {
      title: 'Rejected Bookings',
      value: stats.rejectedBookings,
      icon: <FaTimes className="h-6 w-6 text-red-600" />,
      color: 'bg-red-50'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Enhanced stat card component with animated numbers
  const AnimatedStatCard = ({ title, value, icon, color, link, growth, growthLabel, alert }) => (
    <Link
      to={link}
      className={`${color} p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden border border-slate-200 group`}
    >
      {alert && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          Alert
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-slate-900 mt-1 transition-all duration-500 group-hover:text-blue-600">
              {value}
            </span>
          </div>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth >= 0 ? (
                <FaArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <FaArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(growth)}% {growthLabel}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white rounded-lg shadow-sm transition-transform duration-300 group-hover:rotate-12">
          {icon}
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-blue-500 rounded-full blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full p-1 shadow-xl">
              <div className="bg-slate-800 rounded-full p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-75"></div>
                  <div className="relative bg-slate-800 rounded-full p-1">
                    <FaHospital className="h-6 w-6 text-blue-400 mx-1" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 ml-2">Admin Dashboard</h1>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500">Welcome back, {admin?.username}</p>
                <div className="ml-4 flex items-center text-xs text-gray-500 bg-slate-100 px-2 py-1 rounded-full">
                  <FaSync className="mr-1" />
                  Refresh in {refreshCountdown}s
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
                {['day', 'week', 'month'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      dateRange === range
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2">
                <FaSearch className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm text-slate-700 w-40"
                />
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <FaBell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-10 overflow-hidden border border-slate-200">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 p-2 rounded-full mr-3 ${
                                notification.type === 'appointment' ? 'bg-blue-100' : 'bg-yellow-100'
                              }`}>
                                {notification.type === 'appointment' ? (
                                  <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <FaExclamationTriangle className="h-4 w-4 text-yellow-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-slate-900">{notification.message}</p>
                                <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings */}
              <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <FaCog className="h-5 w-5" />
              </button>
              
              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md"
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
            <div key={index} className={`${stat.color} p-5 rounded-xl shadow-md border border-slate-200 transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center">
                <div className="p-3 bg-white rounded-lg shadow-sm mr-4 transition-transform duration-300 hover:rotate-12">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
            <Link
              to="/admin/bookings"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
            >
              View All
              <FaEllipsisH className="ml-1" />
            </Link>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingAppointments.slice(0, 6).map((appointment) => (
                <div key={appointment._id} className="border-l-4 border-blue-500 pl-4 py-4 bg-slate-50 rounded-r-lg hover:bg-slate-100 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{appointment.patientName}</h4>
                      <p className="text-xs text-slate-500 flex items-center mt-1">
                        <FaStethoscope className="mr-1" />
                        Dr. {appointment.doctor?.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-slate-100 rounded-full">
                  <FaCalendarAlt className="h-8 w-8 text-slate-400" />
                </div>
              </div>
              <p className="text-lg">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/doctors"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200"
            >
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <FaUserMd className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Manage Doctors</h3>
              <p className="text-sm text-slate-500 mt-1">Add or remove doctors</p>
            </Link>
            <Link
              to="/admin/bookings"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200"
            >
              <div className="p-3 bg-green-100 rounded-full mb-3">
                <FaCalendarCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Manage Bookings</h3>
              <p className="text-sm text-slate-500 mt-1">View and update appointments</p>
            </Link>
            <Link
              to="/admin/doctors?action=add"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200"
            >
              <div className="p-3 bg-purple-100 rounded-full mb-3">
                <FaUserPlus className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Add Doctor</h3>
              <p className="text-sm text-slate-500 mt-1">Quickly add a new doctor</p>
            </Link>
            <button className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center border border-slate-200">
              <div className="p-3 bg-indigo-100 rounded-full mb-3">
                <FaDownload className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Export Reports</h3>
              <p className="text-sm text-slate-500 mt-1">Download booking reports</p>
            </button>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Today's Date</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">System Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Last Login</p>
              <p className="text-lg font-semibold text-slate-900">Just now</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Server Time</p>
              <p className="text-lg font-semibold text-slate-900">
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