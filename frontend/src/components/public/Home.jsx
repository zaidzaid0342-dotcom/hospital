import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHospital, 
  FaUserMd, 
  FaCalendarCheck, 
  FaClock, 
  FaHeartbeat,
  FaAmbulance,
  FaMicroscope,
  FaStethoscope,
  FaWheelchair,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaChevronRight,
  FaArrowRight,
  FaCheckCircle,
  FaAward,
  FaShieldAlt,
  FaUserFriends,
  FaHandHoldingMedical,
  FaChevronLeft,
  FaChevronRight as FaChevronRightIcon,
  FaSearch,
  FaIdCard,
  FaPhone,
  FaTimesCircle,
  FaCopy,
  FaCalendarAlt,
  FaUser,
  FaNotesMedical,
  FaInfoCircle,
  FaGraduationCap,
  FaLanguage,
  FaStar,
  FaMedal,
  FaBriefcaseMedical,
  FaCode,
  FaBars,
  FaTimes,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import { doctorAPI, bookingAPI } from '../../services/api';
import { format } from 'date-fns';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState({ phone: '', trackingId: '' });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [trackingMethod, setTrackingMethod] = useState('phone'); // 'phone' or 'id'
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showDoctorDialog, setShowDoctorDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Auto-slide intervals
  const featureIntervalRef = useRef(null);
  const serviceIntervalRef = useRef(null);

  // Helper function for consistent date formatting
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy');
  };

  // Helper function for consistent date and time formatting
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formattedDate = format(date, 'MMMM dd, yyyy');
    
    // Check if time is available and not the default "Pending" value
    if (timeString && timeString !== 'Pending' && timeString.trim() !== '') {
      return `${formattedDate} at ${timeString}`;
    }
    
    return formattedDate;
  };

  useEffect(() => {
    fetchDoctors();
    
    // Set up auto-slide for features carousel
    featureIntervalRef.current = setInterval(() => {
      setCurrentFeatureIndex(prevIndex => (prevIndex + 1) % features.length);
    }, 5000);
    
    // Set up auto-slide for services carousel
    serviceIntervalRef.current = setInterval(() => {
      setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 4000);
    
    // Clean up intervals on component unmount
    return () => {
      clearInterval(featureIntervalRef.current);
      clearInterval(serviceIntervalRef.current);
    };
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getDoctors();
      // Get only first 8 doctors for display
      setDoctors(response.data.slice(0, 8));
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const nextDoctor = () => {
    setCurrentDoctorIndex((prevIndex) => (prevIndex + 1) % doctors.length);
  };

  const prevDoctor = () => {
    setCurrentDoctorIndex((prevIndex) => (prevIndex - 1 + doctors.length) % doctors.length);
  };

  const goToDoctor = (index) => {
    setCurrentDoctorIndex(index);
  };

  const nextService = () => {
    setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
    // Reset the auto-slide timer when manually navigating
    clearInterval(serviceIntervalRef.current);
    serviceIntervalRef.current = setInterval(() => {
      setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 4000);
  };

  const prevService = () => {
    setCurrentServiceIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
    // Reset the auto-slide timer when manually navigating
    clearInterval(serviceIntervalRef.current);
    serviceIntervalRef.current = setInterval(() => {
      setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 4000);
  };

  const goToService = (index) => {
    setCurrentServiceIndex(index);
    // Reset the auto-slide timer when manually navigating
    clearInterval(serviceIntervalRef.current);
    serviceIntervalRef.current = setInterval(() => {
      setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 4000);
  };

  const nextFeature = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    // Reset the auto-slide timer when manually navigating
    clearInterval(featureIntervalRef.current);
    featureIntervalRef.current = setInterval(() => {
      setCurrentFeatureIndex(prevIndex => (prevIndex + 1) % features.length);
    }, 5000);
  };

  const prevFeature = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
    // Reset the auto-slide timer when manually navigating
    clearInterval(featureIntervalRef.current);
    featureIntervalRef.current = setInterval(() => {
      setCurrentFeatureIndex(prevIndex => (prevIndex + 1) % features.length);
    }, 5000);
  };

  const goToFeature = (index) => {
    setCurrentFeatureIndex(index);
    // Reset the auto-slide timer when manually navigating
    clearInterval(featureIntervalRef.current);
    featureIntervalRef.current = setInterval(() => {
      setCurrentFeatureIndex(prevIndex => (prevIndex + 1) % features.length);
    }, 5000);
  };

  const openTrackingModal = () => {
    setShowTrackingModal(true);
    setBookingDetails(null);
    setTrackingError('');
    setTrackingData({ phone: '', trackingId: '' });
    setTrackingMethod('phone');
    setCopied(false);
  };

  const closeTrackingModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowTrackingModal(false);
      setBookingDetails(null);
      setTrackingError('');
      setTrackingData({ phone: '', trackingId: '' });
      setCopied(false);
    }
  };

  const handleTrackingInputChange = (e) => {
    const { name, value } = e.target;
    setTrackingData(prev => ({ ...prev, [name]: value }));
  };

  const handleTrackBooking = async (e) => {
    e.preventDefault();
    
    // Validate that the required field is filled based on tracking method
    if (trackingMethod === 'phone' && !trackingData.phone) {
      setTrackingError('Please enter your phone number');
      return;
    }
    
    if (trackingMethod === 'id' && !trackingData.trackingId) {
      setTrackingError('Please enter your tracking ID');
      return;
    }

    setTrackingLoading(true);
    setTrackingError('');

    try {
      // Prepare the request data based on the tracking method
      const requestData = trackingMethod === 'phone' 
        ? { patientPhone: trackingData.phone }
        : { trackingId: trackingData.trackingId };

      const response = await bookingAPI.trackBooking(requestData);
      console.log('Booking details received:', response.data); // Debug log
      setBookingDetails(response.data);
    } catch (error) {
      console.error('Tracking error:', error); // Debug log
      setTrackingError(error.response?.data?.message || 'Failed to track booking');
      setBookingDetails(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const openServiceDialog = (service) => {
    setSelectedService(service);
    setShowServiceDialog(true);
  };

  const closeServiceDialog = (e) => {
    if (e.target === e.currentTarget) {
      setShowServiceDialog(false);
      setSelectedService(null);
    }
  };

  const openDoctorDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDialog(true);
  };

  const closeDoctorDialog = (e) => {
    if (e.target === e.currentTarget) {
      setShowDoctorDialog(false);
      setSelectedDoctor(null);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: <FaUserMd className="h-8 w-8 text-white" />,
      title: 'Expert Doctors',
      description: 'Highly qualified and experienced medical professionals',
      details: 'Our team consists of board-certified physicians with extensive experience in their respective fields. Each doctor undergoes rigorous credentialing and continuous education to stay updated with the latest medical advancements.'
    },
    {
      icon: <FaCalendarCheck className="h-8 w-8 text-white" />,
      title: 'Easy Booking',
      description: 'Book appointments online in just a few clicks',
      details: 'Our user-friendly online booking system allows you to schedule appointments 24/7. You can choose your preferred doctor, select a convenient time slot, and receive instant confirmation with reminders.'
    },
    {
      icon: <FaClock className="h-8 w-8 text-white" />,
      title: 'Quick Service',
      description: 'Minimal waiting time and efficient service',
      details: 'We value your time and have optimized our processes to ensure minimal waiting. Our average wait time is less than 15 minutes, and we offer express services for urgent cases.'
    },
    {
      icon: <FaHeartbeat className="h-8 w-8 text-white" />,
      title: 'Quality Care',
      description: 'Compassionate care with modern facilities',
      details: 'We combine cutting-edge medical technology with a human touch. Our facilities are equipped with state-of-the-art equipment, and our staff is trained to provide compassionate, patient-centered care.'
    },
  ];

  const services = [
    {
      icon: <FaAmbulance className="h-8 w-8 text-white" />,
      title: 'Emergency Care',
      description: '24/7 emergency services',
      color: 'bg-red-600',
      details: 'Our Emergency Department is staffed 24/7 with board-certified emergency physicians and specialized nurses. We are equipped to handle all types of medical emergencies, from minor injuries to life-threatening conditions. Our advanced trauma center features state-of-the-art diagnostic equipment and resuscitation facilities.',
      highlights: [
        '24/7 availability with specialized staff',
        'Advanced trauma and cardiac care facilities',
        'Average response time under 5 minutes',
        'Mobile ICU ambulance service',
        'Rapid triage system for critical cases'
      ]
    },
    {
      icon: <FaStethoscope className="h-8 w-8 text-white" />,
      title: 'General Consultation',
      description: 'Comprehensive health check-ups',
      color: 'bg-blue-600',
      details: 'Our General Medicine department provides comprehensive primary care services for patients of all ages. Our physicians focus on preventive care, health maintenance, and management of chronic conditions.',
      highlights: [
        'Comprehensive health assessments',
        'Preventive care and health screenings',
        'Management of chronic conditions',
        'Personalized treatment plans',
        'Health education and lifestyle counseling'
      ]
    },
    {
      icon: <FaMicroscope className="h-8 w-8 text-white" />,
      title: 'Laboratory Services',
      description: 'Advanced diagnostic testing',
      color: 'bg-green-600',
      details: 'Our state-of-the-art laboratory is equipped with the latest diagnostic technology to provide accurate and timely test results. We offer a comprehensive range of tests including blood work, pathology, microbiology, and genetic testing.',
      highlights: [
        'Advanced diagnostic technology',
        'Comprehensive test menu',
        '24/7 emergency lab services',
        'Digital reporting system',
        'Accredited by national quality standards'
      ]
    },
    {
      icon: <FaWheelchair className="h-8 w-8 text-white" />,
      title: 'Rehabilitation',
      description: 'Physical therapy services',
      color: 'bg-purple-600',
      details: 'Our Rehabilitation Center offers comprehensive therapy services to help patients recover function, mobility, and independence. Our multidisciplinary team includes physical therapists, occupational therapists, and rehabilitation specialists.',
      highlights: [
        'Physical, occupational, and speech therapy',
        'Cardiac and pulmonary rehabilitation',
        'Neurological rehabilitation programs',
        'Sports injury rehabilitation',
        'State-of-the-art therapy equipment'
      ]
    },
  ];

  const stats = [
    { number: '500+', label: 'Expert Doctors' },
    { number: '10,000+', label: 'Happy Patients' },
    { number: '24/7', label: 'Emergency Service' },
    { number: '15+', label: 'Years of Experience' },
  ];

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can easily book an appointment through our website by clicking on the "Book Appointment" button and filling out the form with your details.'
    },
    {
      question: 'Do you accept insurance?',
      answer: 'Yes, we accept most major insurance plans. Please contact our billing department for specific information about your coverage.'
    },
    {
      question: 'What should I bring to my appointment?',
      answer: 'Please bring your ID, insurance card, list of medications, and any relevant medical records or test results.'
    },
    {
      question: 'Is emergency care available 24/7?',
      answer: 'Yes, our emergency department is open 24 hours a day, 7 days a week to handle all types of medical emergencies.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white text-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-blue-400 rounded-full blur opacity-50"></div>
                  <div className="relative bg-white rounded-full p-1">
                    <FaHospital className="h-8 w-8 text-blue-500 mx-1" />
                  </div>
                </div>
                <span className="text-xl font-bold ml-2 text-blue-600">KRS Hospital</span>
              </div>
              <div className="hidden md:block md:ml-10">
                <div className="flex space-x-1">
                  {['services', 'doctors', 'about', 'contact'].map((item, index) => (
                    <a 
                      key={index}
                      href={`#${item}`} 
                      className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-50 relative group"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={openTrackingModal}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-50 flex items-center"
              >
                <FaSearch className="mr-2" />
                Track Booking
              </button>
              <Link
                to="/book-appointment"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
              >
                Book Appointment
              </Link>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
              >
                {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['services', 'doctors', 'about', 'contact'].map((item, index) => (
                <a 
                  key={index}
                  href={`#${item}`} 
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <div className="pt-2 pb-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    openTrackingModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <FaSearch className="mr-2" />
                  Track Booking
                </button>
                <Link
                  to="/book-appointment"
                  className="w-full flex items-center justify-center mt-2 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-700/50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
          <div className="bottom-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-white rounded-full blur-2xl opacity-20"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/30 shadow-xl">
                  <FaHospital className="h-20 w-20 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-white">KRS</span> Multi Speciality Hospital
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Your Health, Our Priority - Providing World-Class Healthcare with Compassion and Excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book-appointment"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gradient-to-r from-white to-blue-100 text-blue-600 hover:from-blue-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Book Appointment Now
                <FaArrowRight className="ml-2" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-lg font-medium rounded-md text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                Our Services
                <FaChevronRight className="ml-2" />
              </a>
              <button
                onClick={openTrackingModal}
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-lg font-medium rounded-md text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                Track Booking
                <FaSearch className="ml-2" />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-blue-50 fill-current" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
          </svg>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-white rounded-full blur opacity-25"></div>
              <div className="relative bg-red-700 rounded-full p-2 mr-3">
                <FaPhoneAlt className="h-5 w-5" />
              </div>
            </div>
            <span className="font-medium">Emergency Hotline: +1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Available 24/7 for all medical emergencies</span>
            <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with Advanced Carousel */}
      <div id="about" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">KRS</span> Multi Speciality Hospital?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We provide comprehensive healthcare services with a patient-first approach, ensuring you receive the best possible care
            </p>
          </div>
          
          {/* Advanced Features Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 flex items-center justify-center backdrop-blur-sm">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-white rounded-full blur-2xl opacity-20"></div>
                    <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
                      {features[currentFeatureIndex].icon}
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-b from-blue-500/90 to-indigo-600/90">
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    {features[currentFeatureIndex].title}
                  </h3>
                  <p className="text-blue-100 text-center mb-4">
                    {features[currentFeatureIndex].description}
                  </p>
                  <p className="text-white text-center">
                    {features[currentFeatureIndex].details}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevFeature}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-blue-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -ml-4 border border-blue-200"
              aria-label="Previous feature"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextFeature}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-blue-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -mr-4 border border-blue-200"
              aria-label="Next feature"
            >
              <FaChevronRightIcon />
            </button>
            
            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToFeature(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentFeatureIndex ? 'bg-blue-500 w-8' : 'bg-blue-200'}`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-in-out"
                style={{ width: `${((currentFeatureIndex + 1) / features.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section with Advanced Carousel */}
      <div id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We offer a comprehensive range of medical services to meet all your healthcare needs
            </p>
          </div>
          
          {/* Advanced Services Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden border border-blue-200">
                <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-500 rounded-full blur-2xl opacity-10"></div>
                    <div className={`relative ${services[currentServiceIndex].color} rounded-full p-4`}>
                      {services[currentServiceIndex].icon}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    {services[currentServiceIndex].title}
                  </h3>
                  <p className="text-gray-700 text-center mb-6">
                    {services[currentServiceIndex].description}
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => openServiceDialog(services[currentServiceIndex])}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
                    >
                      Learn More
                      <FaChevronRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevService}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-blue-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -ml-4 border border-blue-200"
              aria-label="Previous service"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextService}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-blue-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -mr-4 border border-blue-200"
              aria-label="Next service"
            >
              <FaChevronRightIcon />
            </button>
            
            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToService(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentServiceIndex ? 'bg-blue-500 w-8' : 'bg-blue-200'}`}
                  aria-label={`Go to service ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-in-out"
                style={{ width: `${((currentServiceIndex + 1) / services.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Specializations
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Expert care across multiple medical disciplines with specialized doctors
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Cardiology',
              'Neurology',
              'Pediatrics',
              'Orthopedics',
              'Dermatology',
              'General Medicine',
              'Physician',
              'Emergency Care',
            ].map((spec, index) => (
              <div key={index} className="bg-white p-6 rounded-xl text-center hover:bg-blue-50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-300">
                <p className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">{spec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Section */}
      <div id="doctors" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our team of highly qualified medical professionals is dedicated to providing you with the best care
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Desktop View - Grid Layout */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 group">
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="absolute -inset-4 bg-blue-500 rounded-full blur-2xl opacity-10"></div>
                        <div className="relative bg-white rounded-full p-3 border border-blue-200">
                          <FaUserMd className="h-16 w-16 text-blue-500" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Dr. {doctor.name}</h3>
                      <p className="text-blue-600 mb-2">{doctor.specialization}</p>
                      <p className="text-gray-600 text-sm mb-4">Experience: {doctor.experience || '15+ years'}</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openDoctorDialog(doctor)}
                          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-sm"
                        >
                          Know More
                          <FaChevronRight className="ml-2" />
                        </button>
                        <Link
                          to="/book-appointment"
                          className="inline-flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
                        >
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile View - Enhanced Carousel */}
              <div className="md:hidden">
                <div className="relative max-w-md mx-auto">
                  <div className="overflow-hidden rounded-2xl shadow-xl">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-200">
                      <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                        <div className="relative">
                          <div className="absolute -inset-4 bg-blue-500 rounded-full blur-2xl opacity-10"></div>
                          <div className="relative bg-white rounded-full p-3 border border-blue-200">
                            <FaUserMd className="h-20 w-20 text-blue-500" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">Dr. {doctors[currentDoctorIndex]?.name}</h3>
                        <p className="text-blue-600 mb-2">{doctors[currentDoctorIndex]?.specialization}</p>
                        <p className="text-gray-600 text-sm mb-4">Experience: {doctors[currentDoctorIndex]?.experience || '15+ years'}</p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openDoctorDialog(doctors[currentDoctorIndex])}
                            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-sm"
                          >
                            Know More
                            <FaChevronRight className="ml-2" />
                          </button>
                          <Link
                            to="/book-appointment"
                            className="inline-flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
                          >
                            Book Appointment
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Buttons */}
                  <button
                    onClick={prevDoctor}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-blue-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -ml-4 border border-blue-200"
                    aria-label="Previous doctor"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextDoctor}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-blue-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 -mr-4 border border-blue-200"
                    aria-label="Next doctor"
                  >
                    <FaChevronRightIcon />
                  </button>
                  
                  {/* Indicators */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {doctors.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToDoctor(index)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentDoctorIndex ? 'bg-blue-500 w-8' : 'bg-blue-200'}`}
                        aria-label={`Go to doctor ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/book-appointment"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
            >
              View All Doctors
              <FaChevronRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Find answers to common questions about our services and appointments
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 transition-all duration-300">
                <button
                  className="flex justify-between items-center w-full p-6 text-left hover:bg-blue-50 transition-colors duration-300"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <span className="text-blue-600 transition-transform duration-300">
                    {activeFaq === index ? <FaMinus /> : <FaPlus />}
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated With Health Tips
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Subscribe to our newsletter for health tips, medical news, and exclusive offers
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-all duration-300 shadow-md"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <div className="mt-4 flex items-center justify-center text-blue-200">
                <FaCheckCircle className="mr-2" />
                <span>Thank you for subscribing!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Have questions or need to schedule an appointment? We're here to help
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 group">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-blue-100 rounded-full p-3">
                    <FaPhoneAlt className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-700">+1 (555) 123-4567</p>
              <p className="text-gray-700">+1 (555) 765-4321</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 group">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-blue-100 rounded-full p-3">
                    <FaEnvelope className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-700">info@krshospital.com</p>
              <p className="text-gray-700">support@krshospital.com</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 group">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-blue-100 rounded-full p-3">
                    <FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-700">123 Health Street</p>
              <p className="text-gray-700">Medical City, MC 12345</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Medical Attention?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your appointment today and get the care you deserve from our expert medical team at KRS Multi Speciality Hospital
          </p>
          <Link
            to="/book-appointment"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Book Appointment
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white rounded-full blur opacity-50"></div>
                  <div className="relative bg-blue-700 rounded-full p-1">
                    <FaHospital className="h-8 w-8 text-white mx-1" />
                  </div>
                </div>
                <span className="text-xl font-bold ml-2 text-white">KRS Hospital</span>
              </div>
              <p className="text-blue-100 mb-4">
                Providing world-class healthcare with compassion and excellence for over 15 years.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebookF />, color: 'hover:text-blue-300' },
                  { icon: <FaTwitter />, color: 'hover:text-blue-300' },
                  { icon: <FaInstagram />, color: 'hover:text-pink-300' },
                  { icon: <FaLinkedinIn />, color: 'hover:text-blue-300' }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className={`text-blue-200 ${social.color} transition-colors duration-300`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Our Services', 'Our Doctors', 'Testimonials'].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-blue-200 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {['Emergency Care', 'General Consultation', 'Laboratory Services', 'Rehabilitation'].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-blue-200 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-blue-200">
                <li className="flex items-start">
                  <FaPhoneAlt className="mr-3 mt-1 text-blue-300 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <FaEnvelope className="mr-3 mt-1 text-blue-300 flex-shrink-0" />
                  <span>info@krshospital.com</span>
                </li>
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mr-3 mt-1 text-blue-300 flex-shrink-0" />
                  <span>123 Health Street, Medical City</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} KRS Multi Speciality Hospital. All rights reserved.</p>
            <div className="mt-2 flex items-center justify-center">
              <FaUser className="mr-2 text-blue-300" />
              <span>Developed by Mohammed Zaid</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeTrackingModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Track Your Booking</h3>
                <button
                  onClick={closeTrackingModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaInfoCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Track your appointment status using either your phone number or tracking ID
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Tracking Method Selection */}
              <div className="mb-6">
                <div className="flex space-x-2 bg-blue-50 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTrackingMethod('phone')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
                      trackingMethod === 'phone'
                        ? 'bg-white shadow text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <FaPhone className="mr-2" />
                      Phone
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackingMethod('id')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
                      trackingMethod === 'id'
                        ? 'bg-white shadow text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <FaIdCard className="mr-2" />
                      Tracking ID
                    </div>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleTrackBooking} className="space-y-6">
                {trackingMethod === 'phone' ? (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={trackingData.phone}
                        onChange={handleTrackingInputChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 border-gray-300 rounded-lg transition-all duration-300"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking ID
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="trackingId"
                        name="trackingId"
                        type="text"
                        value={trackingData.trackingId}
                        onChange={handleTrackingInputChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 border-gray-300 rounded-lg transition-all duration-300"
                        placeholder="1234"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300"
                  >
                    {trackingLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Tracking...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaSearch className="mr-2" />
                        Track Booking
                      </div>
                    )}
                  </button>
                </div>
              </form>

              {trackingError && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaTimesCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {trackingError}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {bookingDetails && (
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">ID:</span>
                      <div className="flex items-center">
                        <span className="font-mono font-bold text-gray-900">{bookingDetails.trackingId}</span>
                        <button 
                          onClick={() => copyToClipboard(bookingDetails.trackingId)}
                          className="ml-2 p-1.5 rounded-md bg-blue-100 text-gray-600 hover:bg-blue-200 transition-colors duration-300"
                          title="Copy to clipboard"
                        >
                          <FaCopy className="h-4 w-4" />
                        </button>
                      </div>
                      {copied && (
                        <span className="text-xs text-green-600 font-medium">Copied!</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                          <FaUser className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-500">Patient</h4>
                        <p className="text-lg font-medium text-gray-900">{bookingDetails.patientName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
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
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                          <FaCalendarAlt className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-500">Appointment Date & Time</h4>
                        <p className="text-lg font-medium text-gray-900">
                          {formatDateTime(bookingDetails.appointmentDate, bookingDetails.appointmentTime)}
                        </p>
                        {bookingDetails.status === 'pending' && (!bookingDetails.appointmentTime || bookingDetails.appointmentTime === 'Pending') && (
                          <p className="text-sm text-gray-600 mt-1">
                            Exact time will be assigned by hospital staff
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                          {getStatusIcon(bookingDetails.status)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingDetails.status)}`}>
                          {getStatusIcon(bookingDetails.status)}
                          <span className="ml-2">{getStatusText(bookingDetails.status)}</span>
                        </span>
                      </div>
                    </div>
                    
                    {bookingDetails.notes && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
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
                  
                  {bookingDetails.statusHistory && bookingDetails.statusHistory.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-blue-200">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Status History</h4>
                      <div className="space-y-3">
                        {bookingDetails.statusHistory.map((history, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(history.status)}`}>
                                {getStatusIcon(history.status)}
                                <span className="ml-1">{history.status.charAt(0).toUpperCase() + history.status.slice(1)}</span>
                              </span>
                            </div>
                            <span className="text-gray-500">
                              {formatDate(history.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Dialog */}
      {showServiceDialog && selectedService && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeServiceDialog}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedService.title}</h3>
                <button
                  onClick={closeServiceDialog}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-500 rounded-full blur-2xl opacity-10"></div>
                  <div className={`relative ${selectedService.color} rounded-full p-4`}>
                    {selectedService.icon}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{selectedService.details}</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {selectedService.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/book-appointment"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
                >
                  Book Appointment
                  <FaArrowRight className="ml-2" />
                </Link>
                <button
                  onClick={closeServiceDialog}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Dialog */}
      {showDoctorDialog && selectedDoctor && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeDoctorDialog}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Dr. {selectedDoctor.name}</h3>
                <button
                  onClick={closeDoctorDialog}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="h-40 w-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-blue-500 rounded-full blur-2xl opacity-10"></div>
                      <div className="relative bg-white rounded-full p-3 border border-blue-200">
                        <FaUserMd className="h-16 w-16 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Specialization</h4>
                    <p className="text-blue-600">{selectedDoctor.specialization}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Experience</h4>
                    <p className="text-gray-700">{selectedDoctor.experience || '15+ years'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Education</h4>
                    <p className="text-gray-700">{selectedDoctor.education || 'MD from University of Medical Sciences'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">About</h4>
                <p className="text-gray-700">
                  {selectedDoctor.bio || `Dr. ${selectedDoctor.name} is a highly skilled and compassionate physician specializing in ${selectedDoctor.specialization}. With a patient-centered approach, Dr. ${selectedDoctor.name} is committed to providing the highest quality care using the latest medical advancements and evidence-based practices.`}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/book-appointment"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
                >
                  Book Appointment
                  <FaArrowRight className="ml-2" />
                </Link>
                <button
                  onClick={closeDoctorDialog}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  Close
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
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced shadows for better depth */
        .shadow-blue-500\/20 {
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2), 0 8px 10px -6px rgba(59, 130, 246, 0.1);
        }
        
        /* Enhanced transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        /* Professional hospital color scheme - Light Blue/Purple */
        .bg-blue-50 {
          background-color: #eff6ff;
        }
        .bg-blue-100 {
          background-color: #dbeafe;
        }
        .bg-blue-200 {
          background-color: #bfdbfe;
        }
        .bg-blue-500 {
          background-color: #3b82f6;
        }
        .bg-blue-600 {
          background-color: #2563eb;
        }
        .bg-blue-700 {
          background-color: #1d4ed8;
        }
        .bg-indigo-50 {
          background-color: #eef2ff;
        }
        .bg-indigo-100 {
          background-color: #e0e7ff;
        }
        .bg-indigo-500 {
          background-color: #6366f1;
        }
        .bg-indigo-600 {
          background-color: #4f46e5;
        }
        .bg-indigo-700 {
          background-color: #4338ca;
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
        .text-indigo-500 {
          color: #6366f1;
        }
        .text-indigo-600 {
          color: #4f46e5;
        }
        .text-indigo-700 {
          color: #4338ca;
        }
        .border-blue-100 {
          border-color: #dbeafe;
        }
        .border-blue-200 {
          border-color: #bfdbfe;
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
        .border-indigo-100 {
          border-color: #e0e7ff;
        }
        .border-indigo-200 {
          border-color: #c7d2fe;
        }
        .border-indigo-500 {
          border-color: #6366f1;
        }
        .border-indigo-600 {
          border-color: #4f46e5;
        }
        .border-indigo-700 {
          border-color: #4338ca;
        }
        
        /* Hover effects */
        .hover\:bg-blue-50:hover {
          background-color: #eff6ff;
        }
        .hover\:bg-blue-500:hover {
          background-color: #3b82f6;
        }
        .hover\:bg-blue-600:hover {
          background-color: #2563eb;
        }
        .hover\:bg-blue-700:hover {
          background-color: #1d4ed8;
        }
        .hover\:bg-indigo-50:hover {
          background-color: #eef2ff;
        }
        .hover\:bg-indigo-500:hover {
          background-color: #6366f1;
        }
        .hover\:bg-indigo-600:hover {
          background-color: #4f46e5;
        }
        .hover\:bg-indigo-700:hover {
          background-color: #4338ca;
        }
        .hover\:text-blue-300:hover {
          color: #93c5fd;
        }
        .hover\:text-blue-400:hover {
          color: #60a5fa;
        }
        .hover\:text-blue-500:hover {
          color: #3b82f6;
        }
        .hover\:text-blue-600:hover {
          color: #2563eb;
        }
        .hover\:text-blue-700:hover {
          color: #1d4ed8;
        }
        .hover\:text-indigo-300:hover {
          color: #a5b4fc;
        }
        .hover\:text-indigo-400:hover {
          color: #818cf8;
        }
        .hover\:text-indigo-500:hover {
          color: #6366f1;
        }
        .hover\:text-indigo-600:hover {
          color: #4f46e5;
        }
        .hover\:text-indigo-700:hover {
          color: #4338ca;
        }
        .hover\:border-blue-300:hover {
          border-color: #93c5fd;
        }
        .hover\:border-blue-500:hover {
          border-color: #3b82f6;
        }
        .hover\:border-blue-600:hover {
          border-color: #2563eb;
        }
        .hover\:border-blue-700:hover {
          border-color: #1d4ed8;
        }
        .hover\:border-indigo-300:hover {
          border-color: #a5b4fc;
        }
        .hover\:border-indigo-500:hover {
          border-color: #6366f1;
        }
        .hover\:border-indigo-600:hover {
          border-color: #4f46e5;
        }
        .hover\:border-indigo-700:hover {
          border-color: #4338ca;
        }
        
        /* Focus effects */
        .focus\:ring-blue-500:focus {
          --tw-ring-color: #3b82f6;
        }
        .focus\:border-blue-500:focus {
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
        .from-indigo-400 {
          --tw-gradient-from: #818cf8;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(129, 140, 248, 0));
        }
        .from-indigo-500 {
          --tw-gradient-from: #6366f1;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(99, 102, 241, 0));
        }
        .from-indigo-600 {
          --tw-gradient-from: #4f46e5;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(79, 70, 229, 0));
        }
        .from-indigo-700 {
          --tw-gradient-from: #4338ca;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(67, 56, 202, 0));
        }
        .to-blue-300 {
          --tw-gradient-to: #93c5fd;
        }
        .to-blue-400 {
          --tw-gradient-to: #60a5fa;
        }
        .to-blue-500 {
          --tw-gradient-to: #3b82f6;
        }
        .to-blue-600 {
          --tw-gradient-to: #2563eb;
        }
        .to-blue-700 {
          --tw-gradient-to: #1d4ed8;
        }
        .to-indigo-300 {
          --tw-gradient-to: #a5b4fc;
        }
        .to-indigo-400 {
          --tw-gradient-to: #818cf8;
        }
        .to-indigo-500 {
          --tw-gradient-to: #6366f1;
        }
        .to-indigo-600 {
          --tw-gradient-to: #4f46e5;
        }
        .to-indigo-700 {
          --tw-gradient-to: #4338ca;
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
          @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300;
        }
        
        /* Improved card styles */
        .card {
          @apply bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 transition-all duration-300;
        }
        
        /* Improved modal styles */
        .modal {
          @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm;
        }
        
        /* Improved form styles */
        .form-input {
          @apply focus:ring-blue-500 focus:border-blue-500 block w-full p-3 border-gray-300 rounded-lg transition-all duration-300;
        }
      `}</style>
    </div>
  );
};

export default Home;