const express = require('express');
const router = express.Router();
const { loginAdmin, createAdmin } = require('../controllers/authController');

// Login admin
router.post('/login', loginAdmin);

// Create admin (for initial setup)
router.post('/create', createAdmin);

module.exports = router;