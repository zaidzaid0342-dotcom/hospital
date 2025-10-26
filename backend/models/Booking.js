// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true,
    index: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true,
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  trackingId: {
    type: String,
    unique: true,
    index: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: String,
      default: 'system'
    }
  }]
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // Format date consistently across all outputs
      if (ret.appointmentDate) {
        ret.formattedDate = new Date(ret.appointmentDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return ret;
    }
  }
});

// Pre-save hook to generate tracking ID
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    let trackingId;
    let isUnique = false;
    
    while (!isUnique) {
      trackingId = Math.floor(1000 + Math.random() * 9000).toString();
      const existingBooking = await mongoose.model('Booking').findOne({ trackingId });
      if (!existingBooking) {
        isUnique = true;
      }
    }
    
    this.trackingId = trackingId;
    
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: 'patient'
    });
  }
  
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: 'admin'
    });
  }
  
  next();
});

// Static method to find booking by phone and tracking ID
bookingSchema.statics.findByPhoneAndTrackingId = function(phone, trackingId) {
  return this.findOne({ 
    patientPhone: phone, 
    trackingId: trackingId 
  }).populate('doctor', 'name specialization');
};

module.exports = mongoose.model('Booking', bookingSchema);