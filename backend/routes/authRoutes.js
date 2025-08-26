const express = require('express');
const router = express.Router();
const { 
  studentSignup, 
  facultySignup, 
  adminSignup, 
  clubSignup, 
  login 
} = require('../controllers/authController');

// Student signup
router.post('/student/signup', studentSignup);

// Faculty signup
router.post('/faculty/signup', facultySignup);

// Admin signup
router.post('/admin/signup', adminSignup);

// Club signup
router.post('/club/signup', clubSignup);

// Login for all user types
router.post('/login', login);

module.exports = router;
