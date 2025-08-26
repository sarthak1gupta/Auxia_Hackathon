const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getAllocatedCourses,
  getCourseStudents,
  uploadMarks,
  uploadResource,
  createAnnouncement,
  getCourseAnnouncements
} = require('../controllers/facultyController');

// All routes require authentication and faculty role
router.use(auth);
router.use(authorize('faculty'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Course routes
router.get('/courses', getAllocatedCourses);
router.get('/courses/:courseId/students', getCourseStudents);

// Marks management
router.post('/courses/marks', uploadMarks);

// Resource upload
router.post('/courses/resource', uploadResource);

// Announcement routes
router.post('/courses/:courseId/announcements', createAnnouncement);
router.get('/courses/:courseId/announcements', getCourseAnnouncements);

module.exports = router;
