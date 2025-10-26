import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hospital-98we.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  createAdmin: (adminData) => api.post('/auth/create', adminData),
};

// Doctor APIs
export const doctorAPI = {
  getDoctors: () => api.get('/doctors'),
  addDoctor: (doctorData) => api.post('/doctors', doctorData),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
};

// Booking APIs
export const bookingAPI = {
  getAllBookings: () => api.get('/bookings'),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBookingStatus: (id, status, appointmentTime = null) => {
    const updateData = { status };
    if (appointmentTime) {
      updateData.appointmentTime = appointmentTime;
    }
    return api.patch(`/bookings/${id}`, updateData);
  },
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  trackBooking: (trackingData) => api.post('/bookings/track', trackingData),
};

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;