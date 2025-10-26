import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import { 
  FaCalendarCheck, 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaUser, 
  FaEnvelope, 
  FaPhone,
  FaSearch,
  FaFilter,
  FaClock,
  FaStethoscope,
  FaCalendarAlt,
  FaNotesMedical,
  FaIdCard,
  FaCopy,
  FaPrint,
  FaHospital,
  FaMapMarkerAlt,
  FaUserMd,
  FaPlus,
  FaMinus,
  FaInfoCircle
} from 'react-icons/fa';
import { format } from 'date-fns';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [copied, setCopied] = useState(false);
  
  // Time slot selection states
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeSlot, setTimeSlot] = useState('morning');
  const [customTime, setCustomTime] = useState('10:00 AM');
  const [timeSlotType, setTimeSlotType] = useState('predefined'); // 'predefined' or 'custom'

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      showNotification('Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update the updateStatus function with better error handling
  const updateStatus = async (id, status, appointmentTime = null) => {
    try {
      const response = await bookingAPI.updateBookingStatus(id, status, appointmentTime);
      showNotification(`Booking ${status} successfully`, 'success');
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      showNotification('Failed to update booking', 'error');
    }
  };

  const deleteBooking = async (id) => {
    try {
      await bookingAPI.deleteBooking(id);
      showNotification('Booking deleted successfully', 'success');
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      showNotification('Failed to delete booking', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printDoctorSlip = () => {
    if (!selectedBooking) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Doctor Slip - KRS Multi Speciality Hospital</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            body {
              padding: 0;
              margin: 0;
              color: #333;
              background-color: #f9fafb;
              font-size: 12px;
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 12mm;
              margin: 0 auto;
              background-color: white;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;
              padding-bottom: 12px;
              border-bottom: 2px solid #3b82f6;
            }
            .header-left {
              display: flex;
              align-items: center;
            }
            .header-logo {
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #3b82f6, #0891b2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
            }
            .header-logo svg {
              color: white;
              font-size: 20px;
            }
            .header h1 {
              font-size: 20px;
              color: #1e293b;
              margin-bottom: 3px;
            }
            .header .hospital-info {
              font-size: 11px;
              color: #64748b;
            }
            .header .tracking {
              text-align: right;
            }
            .header .tracking h2 {
              font-size: 16px;
              color: #1e293b;
              margin-bottom: 3px;
            }
            .header .tracking .tracking-id {
              font-family: monospace;
              font-size: 14px;
              font-weight: bold;
              color: #3b82f6;
            }
            .section {
              margin-bottom: 15px;
            }
            .section-title {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 8px;
              padding-bottom: 3px;
              border-bottom: 1px solid #e2e8f0;
              color: #3b82f6;
              display: flex;
              align-items: center;
            }
            .section-title svg {
              margin-right: 6px;
              color: #3b82f6;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-item .label {
              display: inline-block;
              width: 90px;
              font-weight: 600;
              color: #475569;
              font-size: 11px;
            }
            .info-item .value {
              color: #1e293b;
              font-size: 11px;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending {
              background-color: #fef3c7;
              color: #92400e;
            }
            .status-confirmed {
              background-color: #d1fae5;
              color: #065f46;
            }
            .status-rejected {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .notes-box {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 10px;
              min-height: 40px;
              margin-bottom: 12px;
              font-size: 11px;
              color: #334155;
            }
            .treatment-box {
              border: 1px dashed #cbd5e1;
              border-radius: 4px;
              padding: 12px;
              margin-bottom: 15px;
              min-height: 280px;
              background-color: #f8fafc;
            }
            .treatment-section {
              margin-bottom: 12px;
            }
            .treatment-box .label {
              font-size: 11px;
              font-weight: 600;
              color: #475569;
              margin-bottom: 4px;
              display: block;
            }
            .treatment-line {
              height: 24px;
              border-bottom: 1px dotted #cbd5e1;
              margin-bottom: 8px;
            }
            .footer {
              margin-top: auto;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .hospital-info-footer {
              font-size: 11px;
              color: #64748b;
            }
            .signature-section {
              text-align: right;
            }
            .signature-section .signature-label {
              font-weight: 600;
              margin-bottom: 3px;
              color: #475569;
              font-size: 11px;
            }
            .signature-section .signature-line {
              border-bottom: 1px solid #94a3b8;
              width: 180px;
              margin-bottom: 3px;
            }
            .signature-section .doctor-name {
              font-size: 11px;
              color: #64748b;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 80px;
              color: rgba(59, 130, 246, 0.05);
              font-weight: bold;
              z-index: -1;
              white-space: nowrap;
            }
            .prescription-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e2e8f0;
            }
            .prescription-title {
              font-size: 14px;
              font-weight: bold;
              color: #1e293b;
            }
            .prescription-date {
              font-size: 11px;
              color: #64748b;
            }
            .rx-symbol {
              font-size: 28px;
              font-weight: bold;
              color: #3b82f6;
              margin-right: 8px;
              line-height: 1;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
            background-color: white;
            font-size: 11px;
          }
          .page {
            width: 100%;
            min-height: 100vh;
            padding: 8mm;
            box-shadow: none;
          }
        }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="watermark">KRS HOSPITAL</div>
            <div class="header">
              <div class="header-left">
                <div class="header-logo">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <div>
                  <h1>KRS Multi Speciality Hospital</h1>
                  <div class="hospital-info">
                    <div>📍 123 Health Street, Medical City, MC 12345</div>
                    <div>📞 +1 (555) 123-4567</div>
                  </div>
                </div>
              </div>
              <div class="tracking">
                <h2>DOCTOR SLIP</h2>
                <div class="tracking-id">Tracking ID: #${selectedBooking.trackingId}</div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="section">
                <div class="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  PATIENT INFORMATION
                </div>
                <div class="info-item">
                  <span class="label">Name:</span>
                  <span class="value">${selectedBooking.patientName}</span>
                </div>
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span class="value">${selectedBooking.patientEmail}</span>
                </div>
                ${selectedBooking.patientPhone ? `
                <div class="info-item">
                  <span class="label">Phone:</span>
                  <span class="value">${selectedBooking.patientPhone}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="section">
                <div class="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
                  </svg>
                  APPOINTMENT DETAILS
                </div>
                <div class="info-item">
                  <span class="label">Date:</span>
                  <span class="value">${format(new Date(selectedBooking.appointmentDate), 'MMMM dd, yyyy')}</span>
                </div>
                ${selectedBooking.appointmentTime && selectedBooking.appointmentTime !== 'Pending' ? `
                <div class="info-item">
                  <span class="label">Time:</span>
                  <span class="value">${selectedBooking.appointmentTime}</span>
                </div>
                ` : ''}
                <div class="info-item">
                  <span class="label">Doctor:</span>
                  <span class="value">Dr. ${selectedBooking.doctor?.name}</span>
                </div>
                <div class="info-item">
                  <span class="label">Specialization:</span>
                  <span class="value">${selectedBooking.doctor?.specialization}</span>
                </div>
                <div class="info-item">
                  <span class="label">Status:</span>
                  <span class="value"><span class="status-badge status-${selectedBooking.status}">${selectedBooking.status}</span></span>
                </div>
              </div>
            </div>
            
            ${selectedBooking.notes ? `
            <div class="section">
              <div class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>
                </svg>
                PATIENT NOTES
              </div>
              <div class="notes-box">${selectedBooking.notes}</div>
            </div>
            ` : ''}
            
            <div class="section">
              <div class="prescription-header">
                <div style="display: flex; align-items: center;">
                  <span class="rx-symbol">Rx</span>
                  <span class="prescription-title">PRESCRIPTION / TREATMENT PLAN</span>
                </div>
                <div class="prescription-date">Date: ${format(new Date(), 'MMMM dd, yyyy')}</div>
              </div>
              
              <div class="treatment-box">
                <div class="treatment-section">
                  <div class="label">Diagnosis:</div>
                  <div class="treatment-line"></div>
                </div>
                
                <div class="treatment-section">
                  <div class="label">Treatment Plan:</div>
                  <div class="treatment-line"></div>
                  <div class="treatment-line"></div>
                  <div class="treatment-line"></div>
                </div>
                
                <div class="treatment-section">
                  <div class="label">Medication:</div>
                  <div class="treatment-line"></div>
                  <div class="treatment-line"></div>
                  <div class="treatment-line"></div>
                  <div class="treatment-line"></div>
                </div>
                
                <div class="treatment-section">
                  <div class="label">Dosage & Instructions:</div>
                  <div class="treatment-line"></div>
                  <div class="treatment-line"></div>
                </div>
                
                <div class="treatment-section">
                  <div class="label">Follow-up:</div>
                  <div class="treatment-line"></div>
                </div>
                
                <div class="treatment-section">
                  <div class="label">Additional Notes:</div>
                  <div class="treatment-line"></div>
                  <div class="treatment-line"></div>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="hospital-info-footer">
                <div>KRS Multi Speciality Hospital</div>
                <div>123 Health Street, Medical City</div>
                <div>+1 (555) 123-4567 | www.krshospital.com</div>
              </div>
              <div class="signature-section">
                <div class="signature-label">Doctor's Signature</div>
                <div class="signature-line"></div>
                <div class="doctor-name">Dr. ${selectedBooking.doctor?.name}</div>
                <div class="doctor-name">${selectedBooking.doctor?.specialization}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for the content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Function to handle opening time slot modal
  const handleConfirmBooking = (booking) => {
    setSelectedBooking(booking);
    setShowTimeModal(true);
  };

  // Function to submit time selection
  const submitTimeSelection = async () => {
    if (!selectedBooking) return;
    
    let appointmentTime = '';
    if (timeSlotType === 'predefined') {
      switch(timeSlot) {
        case 'morning':
          appointmentTime = '10:00 AM - 12:00 PM';
          break;
        case 'afternoon':
          appointmentTime = '1:00 PM - 3:00 PM';
          break;
        case 'evening':
          appointmentTime = '4:00 PM - 6:00 PM';
          break;
        default:
          appointmentTime = '10:00 AM - 12:00 PM';
      }
    } else {
      // Validate custom time
      if (!customTime || customTime.trim() === '') {
        showNotification('Please enter a valid time', 'error');
        return;
      }
      appointmentTime = customTime;
    }
    
    try {
      await updateStatus(selectedBooking._id, 'confirmed', appointmentTime);
      showNotification('Booking confirmed successfully', 'success');
      setShowTimeModal(false);
      setSelectedBooking(null);
    } catch (error) {
      showNotification('Failed to confirm booking', 'error');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Apply status filter
    if (filter !== 'all' && booking.status !== filter) return false;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const patientMatch = booking.patientName.toLowerCase().includes(searchLower);
      const doctorMatch = booking.doctor?.name.toLowerCase().includes(searchLower);
      const emailMatch = booking.patientEmail.toLowerCase().includes(searchLower);
      const phoneMatch = booking.patientPhone && booking.patientPhone.toLowerCase().includes(searchLower);
      const trackingMatch = booking.trackingId && booking.trackingId.toLowerCase().includes(searchLower);
      
      if (!patientMatch && !doctorMatch && !emailMatch && !phoneMatch && !trackingMatch) return false;
    }
    
    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      const bookingDate = new Date(booking.appointmentDate);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (startDate && bookingDate < startDate) return false;
      if (endDate && bookingDate > endDate) return false;
    }
    
    return true;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: <FaClock className="mr-1" />,
    confirmed: <FaCheck className="mr-1" />,
    rejected: <FaTimes className="mr-1" />,
  };

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
          <p className="mt-6 text-lg font-medium text-gray-700">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                <span className="font-medium">Total:</span>
                <span className="ml-1 font-bold">{bookings.length}</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                <span className="font-medium">Pending:</span>
                <span className="ml-1 font-bold">{bookings.filter(b => b.status === 'pending').length}</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full">
                <span className="font-medium">Confirmed:</span>
                <span className="ml-1 font-bold">{bookings.filter(b => b.status === 'confirmed').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg shadow-sm flex items-center justify-between backdrop-blur-sm ${
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-6 border border-slate-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === status
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
                </button>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or tracking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all duration-300"
                />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="date"
                  placeholder="Start date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
                <input
                  type="date"
                  placeholder="End date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Appointment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-20"></div>
                          <div className="relative flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.patientName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1 text-xs" />
                            {booking.patientEmail}
                          </div>
                          {booking.patientPhone && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <FaPhone className="mr-1 text-xs" />
                              {booking.patientPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-green-500 rounded-full blur opacity-20"></div>
                          <div className="relative flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaStethoscope className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {booking.doctor?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.doctor?.specialization}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-purple-500 rounded-full blur opacity-20"></div>
                          <div className="relative flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaIdCard className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            #{booking.trackingId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <div>
                          <div>{format(new Date(booking.appointmentDate), 'MMM dd, yyyy')}</div>
                          {booking.appointmentTime && booking.appointmentTime !== 'Pending' && (
                            <div className="text-xs text-gray-500">{booking.appointmentTime}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusColors[booking.status]}`}>
                        {statusIcons[booking.status]}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmBooking(booking)}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
                              title="Confirm Booking"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => updateStatus(booking._id, 'rejected')}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                              title="Reject Booking"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-blue-500 rounded-full blur-xl opacity-10"></div>
                  <div className="relative flex items-center justify-center h-16 w-16 bg-slate-100 rounded-full">
                    <FaCalendarCheck className="h-8 w-8 text-slate-400" />
                  </div>
                </div>
                <p className="mt-4 text-lg font-medium text-gray-900">No bookings found</p>
                <p className="text-sm text-gray-500">
                  {filter !== 'all' || searchTerm || dateRange.start || dateRange.end
                    ? 'Try adjusting your filters'
                    : 'There are no bookings in the system'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                    <FaUser className="h-4 w-4 mr-2" />
                    Patient Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-24">Name:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedBooking.patientName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-24">Email:</span>
                      <span className="text-sm text-gray-900">{selectedBooking.patientEmail}</span>
                    </div>
                    {selectedBooking.patientPhone && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Phone:</span>
                        <span className="text-sm text-gray-900">{selectedBooking.patientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                  <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                    <FaStethoscope className="h-4 w-4 mr-2" />
                    Appointment Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-24">Doctor:</span>
                      <span className="text-sm font-medium text-gray-900">
                        Dr. {selectedBooking.doctor?.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-24">Specialty:</span>
                      <span className="text-sm text-gray-900">{selectedBooking.doctor?.specialization}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-24">Date:</span>
                      <span className="text-sm text-gray-900">
                        {format(new Date(selectedBooking.appointmentDate), 'MMMM dd, yyyy')}
                      </span>
                    </div>
                    {selectedBooking.appointmentTime && selectedBooking.appointmentTime !== 'Pending' && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Time:</span>
                        <span className="text-sm text-gray-900">{selectedBooking.appointmentTime}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-100">
                  <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                    <FaIdCard className="h-4 w-4 mr-2" />
                    Tracking Information
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">#{selectedBooking.trackingId}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBooking.trackingId)}
                      className="p-2 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                      title="Copy tracking ID"
                    >
                      <FaCopy className="h-4 w-4" />
                    </button>
                  </div>
                  {copied && (
                    <div className="mt-2 text-xs text-green-600 font-medium flex items-center">
                      <FaCheck className="mr-1" />
                      Copied to clipboard!
                    </div>
                  )}
                </div>
                
                {selectedBooking.notes && (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border border-yellow-100">
                    <h4 className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
                      <FaNotesMedical className="h-4 w-4 mr-2" />
                      Notes
                    </h4>
                    <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusColors[selectedBooking.status]}`}>
                    {statusIcons[selectedBooking.status]}
                    {selectedBooking.status}
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={printDoctorSlip}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center shadow-md hover:shadow-blue-500/20"
                    >
                      <FaPrint className="mr-2" />
                      Print Slip
                    </button>
                    <button
                      onClick={() => deleteBooking(selectedBooking._id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center shadow-md hover:shadow-red-500/20"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Slot Selection Modal */}
      {showTimeModal && selectedBooking && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowTimeModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Select Appointment Time</h3>
                <button
                  onClick={() => setShowTimeModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaUser className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-gray-900">{selectedBooking.patientName}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaCalendarAlt className="h-4 w-4" />
                  </div>
                  <span className="text-gray-900">{format(new Date(selectedBooking.appointmentDate), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Time Slot Type</h4>
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setTimeSlotType('predefined')}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      timeSlotType === 'predefined'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Predefined Slots
                  </button>
                  <button
                    onClick={() => setTimeSlotType('custom')}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      timeSlotType === 'custom'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Custom Time
                  </button>
                </div>
                
                {timeSlotType === 'predefined' ? (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Select Time Slot</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'morning', label: 'Morning (10:00 AM - 12:00 PM)' },
                        { id: 'afternoon', label: 'Afternoon (1:00 PM - 3:00 PM)' },
                        { id: 'evening', label: 'Evening (4:00 PM - 6:00 PM)' }
                      ].map((slot) => (
                        <div key={slot.id} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <input
                            type="radio"
                            id={slot.id}
                            name="timeSlot"
                            checked={timeSlot === slot.id}
                            onChange={() => setTimeSlot(slot.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor={slot.id} className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                            {slot.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Enter Custom Time</h4>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        placeholder="e.g., 10:30 AM"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Enter time in 12-hour format (e.g., 10:30 AM, 2:15 PM)
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTimeModal(false)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTimeSelection}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-blue-500/20"
                >
                  Confirm Booking
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
        
        /* Purple accent colors */
        .bg-purple-100 {
          background-color: #e0e7ff;
        }
        .text-purple-600 {
          color: #4f46e5;
        }
        
        /* Red accent colors */
        .bg-red-600 {
          background-color: #dc2626;
        }
        .bg-red-700 {
          background-color: #b91c1c;
        }
        
        /* Indigo accent colors */
        .bg-indigo-50 {
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
      `}</style>
    </div>
  );
};

export default BookingManagement;