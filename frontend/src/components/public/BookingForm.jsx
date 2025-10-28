import React, { useState, useEffect } from 'react';
import { doctorAPI, bookingAPI } from '../../services/api';
import { 
  FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, FaUser, FaEnvelope, FaPhone,
  FaStethoscope, FaNotesMedical, FaTimes, FaCheck, FaCopy, FaPrint,
  FaCalendarCheck, FaIdCard, FaHospital, FaMapMarkerAlt, FaHourglassHalf,
  FaMoon, FaSun
} from 'react-icons/fa';
import { format } from 'date-fns';

const BookingForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorId: '',
    appointmentDate: '',
    notes: '',
  });
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showNotification('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const appointmentDate = new Date(formData.appointmentDate + "T00:00:00");
      const formattedData = {
        ...formData,
        appointmentDate: appointmentDate.toISOString()
      };

      const response = await bookingAPI.createBooking(formattedData);

      setBookingDetails(response.data);
      setShowConfirmation(true);

      setFormData({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        doctorId: '',
        appointmentDate: '',
        notes: '',
      });
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to book appointment';
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('Tracking ID copied to clipboard!', 'success');
  };

  const printConfirmation = () => {
    window.print();
  };

  const today = format(new Date(), "yyyy-MM-dd");

  // FIXED: Always parse as local date
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      let date = dateString;
      // Add T00:00:00 for local time parsing if needed
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        date = dateString + "T00:00:00";
      }
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return 'Invalid date';
      }
      return format(d, 'MMMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
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

        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-blue-500 rounded-full blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full p-1 shadow-xl">
              <div className="bg-slate-800 dark:bg-gray-900 rounded-full p-5">
                <FaUserMd className="h-12 w-12 text-blue-400 dark:text-blue-300" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 mt-6">
            Book an <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Appointment</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Schedule your visit with our expert healthcare professionals
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-gray-700">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="p-8">
            {notification && (
              <div className={`mb-8 p-4 rounded-lg flex items-center justify-between backdrop-blur-sm ${
                  notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-700'
                }`}>
                <div className="flex items-center">
                  {notification.type === 'success' ? 
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-800">
                        <FaCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                    </div> : 
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 dark:bg-red-800">
                        <FaTimes className="h-4 w-4 text-red-600 dark:text-red-300" />
                      </div>
                    </div>
                  }
                  <span className="ml-3">{notification.message}</span>
                </div>
                <button 
                  onClick={() => setNotification(null)} 
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
                      <FaUser className="h-3 w-3" />
                    </div>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    placeholder="John Doe"
                  />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
                      <FaEnvelope className="h-3 w-3" />
                    </div>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    required
                    value={formData.patientEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    placeholder="john@example.com"
                  />
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
                      <FaPhone className="h-3 w-3" />
                    </div>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    required
                    value={formData.patientPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                {/* Doctor */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
                      <FaStethoscope className="h-3 w-3" />
                    </div>
                    Select Doctor *
                  </label>
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded-lg"></div>
                  ) : (
                    <select
                      name="doctorId"
                      required
                      value={formData.doctorId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* Appointment Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
                      <FaCalendarAlt className="h-3 w-3" />
                    </div>
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    required
                    min={today}
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  />
                </div>
                {/* Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
                      <FaNotesMedical className="h-3 w-3" />
                    </div>
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={1}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm resize-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Booking...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaCalendarAlt className="mr-2" />
                      Book Appointment
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-gray-700">
          <div className="p-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute -inset-2 bg-green-500 rounded-full blur opacity-20"></div>
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                    <FaCheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Appointment Information</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                  <li className="flex items-start"><span className="text-green-500 dark:text-green-400 mr-2">•</span> You will receive a confirmation email after booking</li>
                  <li className="flex items-start"><span className="text-green-500 dark:text-green-400 mr-2">•</span> Please arrive 15 minutes before your appointment time</li>
                  <li className="flex items-start"><span className="text-green-500 dark:text-green-400 mr-2">•</span> Bring your ID and any relevant medical documents</li>
                  <li className="flex items-start"><span className="text-green-500 dark:text-green-400 mr-2">•</span> For emergencies, please call our emergency hotline</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && bookingDetails && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowConfirmation(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scaleIn border border-blue-100 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Appointment Details</h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-yellow-500 rounded-full blur-xl opacity-20"></div>
                  <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <FaHourglassHalf className="h-10 w-10 text-yellow-600 dark:text-yellow-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Appointment Pending!</h3>
                <p className="text-gray-600 dark:text-gray-300">Your appointment has been submitted and is pending confirmation</p>
              </div>
              {/* Tracking ID Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 mb-6 border border-blue-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
                      <FaIdCard className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Tracking ID</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => copyToClipboard(bookingDetails.trackingId)}
                      className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="Copy to clipboard"
                    >
                      <FaCopy className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={printConfirmation}
                      className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="Print confirmation"
                    >
                      <FaPrint className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800 dark:text-blue-400 tracking-widest">
                    {bookingDetails.trackingId}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Save this ID for future reference</p>
                </div>
              </div>
              {/* Appointment Details */}
              <div className="space-y-4 mb-6">
                {/* Patient */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 dark:bg-gray-800 text-indigo-600 dark:text-blue-300">
                      <FaUser className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Patient</h4>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{bookingDetails.patientName}</p>
                  </div>
                </div>
                {/* Doctor */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 dark:bg-gray-800 text-indigo-600 dark:text-blue-300">
                      <FaUserMd className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Doctor</h4>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Dr. {bookingDetails.doctor.name} ({bookingDetails.doctor.specialization})
                    </p>
                  </div>
                </div>
                {/* Date */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 dark:bg-gray-800 text-indigo-600 dark:text-blue-300">
                      <FaCalendarCheck className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Appointment Date</h4>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatDateForDisplay(bookingDetails.appointmentDate)}
                    </p>
                    {bookingDetails.appointmentTime && bookingDetails.appointmentTime !== 'Pending' && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {bookingDetails.appointmentTime}
                      </p>
                    )}
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 dark:bg-gray-800 text-indigo-600 dark:text-blue-300">
                      <FaHospital className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Location</h4>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">KRS Multi Speciality Hospital</p>
                    <p className="text-gray-600 dark:text-gray-400">123 Health Street, Medical City</p>
                  </div>
                </div>
                {/* Notes, if any */}
                {bookingDetails.notes && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 dark:bg-gray-800 text-indigo-600 dark:text-blue-300">
                        <FaNotesMedical className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Notes</h4>
                      <p className="text-gray-900 dark:text-white">{bookingDetails.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Status Info */}
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 mb-6 border border-yellow-100 dark:border-yellow-700">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <FaHourglassHalf className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">What Happens Next?</h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Your appointment is currently pending confirmation by our staff</li>
                        <li>You will receive an email once your appointment is confirmed</li>
                        <li>The email will include your confirmed date and time</li>
                        <li>Use your tracking ID to check the status of your appointment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Info section */}
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6 border border-blue-100 dark:border-blue-700">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
                      <FaMapMarkerAlt className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">Important Information</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Please arrive 15 minutes before your appointment</li>
                        <li>Bring your ID and relevant medical documents</li>
                        <li>Save your tracking ID for future reference</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  Close
                </button>
                <button
                  onClick={printConfirmation}
                  className="flex-1 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-blue-500/20"
                >
                  <FaPrint className="mr-2" />
                  Print Confirmation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
