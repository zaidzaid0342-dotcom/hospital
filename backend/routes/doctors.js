const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDoctors, addDoctor, deleteDoctor } = require('../controllers/doctorController');

// Get all doctors (public)
router.get('/', getDoctors);

// Add doctor (admin only)
router.post('/', auth, addDoctor);

// Delete doctor (admin only)
router.delete('/:id', auth, deleteDoctor);

module.exports = router;