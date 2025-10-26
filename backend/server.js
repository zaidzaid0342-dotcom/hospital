const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://hospital-4tj4.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/bookings', bookingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  autoIndex: true,
})


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));