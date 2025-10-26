// controllers/bookingController.js
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, doctorId, appointmentDate, notes } = req.body;

    if (!patientName || !patientEmail || !patientPhone || !doctorId || !appointmentDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const booking = new Booking({
      patientName,
      patientEmail,
      patientPhone,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      notes,
      appointmentTime: 'Pending' // Default value until admin assigns a time
    });

    await booking.save();
    await booking.populate('doctor', 'name specialization');
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update booking status and time (admin)
// controllers/bookingController.js

// Update booking status and time (admin)
// controllers/bookingController.js

const updateBookingStatus = async (req, res) => {
  try {
    const { status, appointmentTime } = req.body;
    
    // console.log('Update request received:', { 
    //   id: req.params.id, 
    //   status, 
    //   appointmentTime,
    //   body: req.body 
    // });
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // console.log('Current booking before update:', {
    //   status: booking.status,
    //   appointmentTime: booking.appointmentTime
    // });

    // Update status
    booking.status = status;
    
    // Always update appointmentTime if provided
    if (appointmentTime !== undefined && appointmentTime !== null && appointmentTime.trim() !== '') {
      booking.appointmentTime = appointmentTime;
      //console.log('Setting appointmentTime to:', appointmentTime);
    }

    // console.log('Booking before save:', {
    //   status: booking.status,
    //   appointmentTime: booking.appointmentTime
    // });
    
    await booking.save();
    //console.log('Booking saved successfully');
    
    // Refetch the booking to ensure we have the latest data
    const updatedBooking = await Booking.findById(req.params.id)
      .populate('doctor', 'name specialization');
    
    // console.log('Updated booking after refetch:', {
    //   status: updatedBooking.status,
    //   appointmentTime: updatedBooking.appointmentTime
    // });
    
    res.json(updatedBooking);
  } catch (error) {
    //console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Delete booking (admin)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Track booking status (public)
// controllers/bookingController.js

// Track booking status (public)
const trackBooking = async (req, res) => {
  try {
    const { patientPhone, trackingId } = req.body;
    
    if (!patientPhone && !trackingId) {
      return res.status(400).json({ 
        message: 'Please provide either phone number or tracking ID' 
      });
    }
    
    let booking;
    
    if (patientPhone && trackingId) {
      booking = await Booking.findByPhoneAndTrackingId(patientPhone, trackingId);
    } else if (patientPhone) {
      booking = await Booking.findOne({ patientPhone: patientPhone })
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 });
    } else {
      booking = await Booking.findOne({ trackingId: trackingId })
        .populate('doctor', 'name specialization');
    }
    
    if (!booking) {
      return res.status(404).json({ 
        message: 'Booking not found. Please check your information.' 
      });
    }
    
    // Ensure we're returning a plain object to avoid any Mongoose document issues
    const bookingObject = booking.toObject();
    res.json(bookingObject);
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  trackBooking
};