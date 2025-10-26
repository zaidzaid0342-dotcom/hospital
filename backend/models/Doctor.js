const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true,
    enum: ['Cardiologist', 'Physician', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Dermatologist', 'General']
  },
  available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);