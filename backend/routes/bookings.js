// routes/bookings.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getAllBookings, 
  createBooking, 
  updateBookingStatus, 
  deleteBooking,
  trackBooking 
} = require('../controllers/bookingController');

// Get all bookings (admin only)
router.get('/', auth, getAllBookings);

// Create booking (public)
router.post('/', createBooking);

// Track booking status (public)
router.post('/track', trackBooking);

// Update booking status (admin only)
router.patch('/:id', auth, updateBookingStatus);

// Delete booking (admin only)
router.delete('/:id', auth, deleteBooking);

module.exports = router;