import React, { useState, useEffect } from 'react';
import { doctorAPI, bookingAPI } from '../../services/api';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaStethoscope,
  FaNotesMedical,
  FaTimes,
  FaCheck,
  FaCopy,
  FaPrint,
  FaCalendarCheck,
  FaIdCard,
  FaHospital,
  FaMapMarkerAlt,
  FaHourglassHalf,
  FaPlus,
  FaMinus,
  FaInfoCircle
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

  useEffect(() => {
    fetchDoctors();
  }, []);

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
      // Format the date properly before sending
      const appointmentDate = new Date(formData.appointmentDate);
      
      // Ensure the date is properly formatted for the API
      const formattedData = {
        ...formData,
        appointmentDate: appointmentDate.toISOString()
      };
      
      const response = await bookingAPI.createBooking(formattedData);
      
      // Store booking details and show confirmation modal
      setBookingDetails(response.data);
      setShowConfirmation(true);
      
      // Reset form
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

  // Set minimum date to today
  const today = format(new Date(), "yyyy-MM-dd");

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return format(date, 'MMMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Format date and time for display
  const formatDateTimeForDisplay = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return format(date, 'MMMM dd, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-blue-500 rounded-full blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full p-1 shadow-xl">
              <div className="bg-slate-800 rounded-full p-5">
                <FaUserMd className="h-12 w-12 text-blue-400" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 mt-6">
            Book an <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Appointment</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Schedule your visit with our expert healthcare professionals
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          <div className="p-8">
            {notification && (
              <div className={`mb-8 p-4 rounded-lg flex items-center justify-between backdrop-blur-sm ${
                notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                <div className="flex items-center">
                  {notification.type === 'success' ? 
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                        <FaCheck className="h-4 w-4 text-green-600" />
                      </div>
                    </div> : 
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100">
                        <FaTimes className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                  }
                  <span className="ml-3">{notification.message}</span>
                </div>
                <button 
                  onClick={() => setNotification(null)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 text-blue-600 mr-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 text-blue-600 mr-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 text-blue-600 mr-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 text-blue-600 mr-2">
                      <FaStethoscope className="h-3 w-3" />
                    </div>
                    Select Doctor *
                  </label>
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
                  ) : (
                    <select
                      name="doctorId"
                      required
                      value={formData.doctorId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 text-blue-600 mr-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 text-blue-600 mr-2">
                      <FaNotesMedical className="h-3 w-3" />
                    </div>
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm resize-none"
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
        <div className="mt-10 bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="p-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute -inset-2 bg-green-500 rounded-full blur opacity-20"></div>
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                    <FaCheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Information</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    You will receive a confirmation email after booking
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Please arrive 15 minutes before your appointment time
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Bring your ID and any relevant medical documents
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    For emergencies, please call our emergency hotline
                  </li>
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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-yellow-500 rounded-full blur-xl opacity-20"></div>
                  <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                    <FaHourglassHalf className="h-10 w-10 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">Appointment Pending!</h3>
                <p className="text-gray-600">Your appointment has been submitted and is pending confirmation</p>
              </div>
              
              {/* Tracking ID Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600 mr-2">
                      <FaIdCard className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-blue-800">Tracking ID</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => copyToClipboard(bookingDetails.trackingId)}
                      className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="Copy to clipboard"
                    >
                      <FaCopy className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={printConfirmation}
                      className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="Print confirmation"
                    >
                      <FaPrint className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800 tracking-widest">
                    {bookingDetails.trackingId}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Save this ID for future reference</p>
                </div>
              </div>
              
              {/* Appointment Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                      <FaUser className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500">Patient</h4>
                    <p className="text-lg font-medium text-gray-900">{bookingDetails.patientName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                      <FaUserMd className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500">Doctor</h4>
                    <p className="text-lg font-medium text-gray-900">
                      Dr. {bookingDetails.doctor.name} ({bookingDetails.doctor.specialization})
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                      <FaCalendarCheck className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500">Appointment Date</h4>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDateForDisplay(bookingDetails.appointmentDate)}
                    </p>
                    {bookingDetails.appointmentTime && bookingDetails.appointmentTime !== 'Pending' && (
                      <p className="text-sm text-gray-600">
                        {bookingDetails.appointmentTime}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                      <FaHospital className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="text-lg font-medium text-gray-900">KRS Multi Speciality Hospital</p>
                    <p className="text-gray-600">123 Health Street, Medical City</p>
                  </div>
                </div>
                
                {bookingDetails.notes && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                        <FaNotesMedical className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                      <p className="text-gray-900">{bookingDetails.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Status Information */}
              <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100">
                      <FaHourglassHalf className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">What Happens Next?</h3>
                    <div className="mt-2 text-sm text-yellow-700">
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
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                      <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Please arrive 15 minutes before your appointment</li>
                        <li>Bring your ID and relevant medical documents</li>
                        <li>Save your tracking ID for future reference</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
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
      
      <style jsx global>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        /* Professional hospital color scheme */
        .bg-slate-900 {
          background-color: #0f172a;
        }
        .bg-slate-800 {
          background-color: #1e293b;
        }
        .bg-slate-700 {
          background-color: #334155;
        }
        .text-slate-900 {
          color: #0f172a;
        }
        .text-slate-800 {
          color: #1e293b;
        }
        .text-slate-700 {
          color: #334155;
        }
        .border-slate-200 {
          border-color: #e2e8f0;
        }
        .border-slate-700 {
          border-color: #334155;
        }
        .border-slate-800 {
          border-color: #1e293b;
        }
        
        /* Blue accent colors */
        .bg-blue-500 {
          background-color: #3b82f6;
        }
        .bg-blue-600 {
          background-color: #2563eb;
        }
        .bg-blue-700 {
          background-color: #1d4ed8;
        }
        .text-blue-400 {
          color: #60a5fa;
        }
        .text-blue-500 {
          color: #3b82f6;
        }
        .text-blue-600 {
          color: #2563eb;
        }
        .text-blue-700 {
          color: #1d4ed8;
        }
        .text-blue-800 {
          color: #1e40af;
        }
        .border-blue-500 {
          border-color: #3b82f6;
        }
        .border-blue-600 {
          border-color: #2563eb;
        }
        .border-blue-700 {
          border-color: #1d4ed8;
        }
        
        /* Cyan accent colors */
        .bg-cyan-400 {
          background-color: #22d3ee;
        }
        .bg-cyan-500 {
          background-color: #06b6d4;
        }
        .bg-cyan-600 {
          background-color: #0891b2;
        }
        .bg-cyan-700 {
          background-color: #0e7490;
        }
        .text-cyan-300 {
          color: #67e8f9;
        }
        .text-cyan-400 {
          color: #22d3ee;
        }
        .text-cyan-500 {
          color: #06b6d4;
        }
        .text-cyan-600 {
          color: #0891b2;
        }
        .text-cyan-700 {
          color: #0e7490;
        }
        .border-cyan-500 {
          border-color: #06b6d4;
        }
        .border-cyan-600 {
          border-color: #0891b2;
        }
        .border-cyan-700 {
          border-color: #0e7490;
        }
        
        /* Green accent colors */
        .bg-green-500 {
          background-color: #22c55e;
        }
        .bg-green-600 {
          background-color: #16a34a;
        }
        .text-green-600 {
          color: #16a34a;
        }
        .text-green-700 {
          color: #15803d;
        }
        .text-green-800 {
          color: #166534;
        }
        
        /* Yellow accent colors */
        .bg-yellow-500 {
          background-color: #eab308;
        }
        .text-yellow-600 {
          color: #ca8a04;
        }
        .text-yellow-700 {
          color: #a16207;
        }
        .text-yellow-800 {
          color: #854d0e;
        }
        
        /* Orange accent colors */
        .bg-orange-500 {
          background-color: #f97316;
        }
        
        /* Indigo accent colors */
        .bg-indigo-100 {
          background-color: #e0e7ff;
        }
        .text-indigo-600 {
          color: #4f46e5;
        }
        
        /* Hover effects */
        .hover\\:bg-blue-50:hover {
          background-color: #eff6ff;
        }
        .hover\\:bg-blue-500:hover {
          background-color: #3b82f6;
        }
        .hover\\:bg-blue-600:hover {
          background-color: #2563eb;
        }
        .hover\\:bg-blue-700:hover {
          background-color: #1d4ed8;
        }
        .hover\\:text-blue-300:hover {
          color: #93c5fd;
        }
        .hover\\:text-blue-400:hover {
          color: #60a5fa;
        }
        .hover\\:text-blue-500:hover {
          color: #3b82f6;
        }
        .hover\\:text-blue-600:hover {
          color: #2563eb;
        }
        .hover\\:text-blue-700:hover {
          color: #1d4ed8;
        }
        .hover\\:border-blue-300:hover {
          border-color: #93c5fd;
        }
        .hover\\:border-blue-500:hover {
          border-color: #3b82f6;
        }
        .hover\\:border-blue-600:hover {
          border-color: #2563eb;
        }
        .hover\\:border-blue-700:hover {
          border-color: #1d4ed8;
        }
        
        /* Focus effects */
        .focus\\:ring-blue-500:focus {
          --tw-ring-color: #3b82f6;
        }
        .focus\\:border-blue-500:focus {
          border-color: #3b82f6;
        }
        
        /* Gradient text */
        .bg-gradient-to-r {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }
        .from-blue-400 {
          --tw-gradient-from: #60a5fa;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(96, 165, 250, 0));
        }
        .from-blue-500 {
          --tw-gradient-from: #3b82f6;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
        }
        .from-blue-600 {
          --tw-gradient-from: #2563eb;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
        }
        .from-blue-700 {
          --tw-gradient-from: #1d4ed8;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(29, 78, 216, 0));
        }
        .to-cyan-300 {
          --tw-gradient-to: #67e8f9;
        }
        .to-cyan-400 {
          --tw-gradient-to: #22d3ee;
        }
        .to-cyan-500 {
          --tw-gradient-to: #06b6d4;
        }
        .to-cyan-600 {
          --tw-gradient-to: #0891b2;
        }
        .to-cyan-700 {
          --tw-gradient-to: #0e7490;
        }
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
        .text-transparent {
          color: transparent;
        }
        
        /* Blur effects */
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        /* Animation effects */
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        /* Improved button styles */
        .btn-primary {
          @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300;
        }
        
        /* Improved card styles */
        .card {
          @apply bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 transition-all duration-300;
        }
        
        /* Improved modal styles */
        .modal {
          @apply fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm;
        }
        
        /* Improved form styles */
        .form-input {
          @apply focus:ring-blue-500 focus:border-blue-500 block w-full p-3 border-gray-300 rounded-lg transition-all duration-300;
        }
        
        /* Print styles */
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed > div, .fixed > div * {
            visibility: visible;
          }
          .fixed {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .flex button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingForm;