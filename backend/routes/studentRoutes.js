const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getElectiveCourses,
  registerCourse,
  dropCourse,
  getGradesheet,
  getClubs,
  requestJoinClub,
  submitFeedback,
  getAnnouncements
} = require('../controllers/studentController');

// All routes require authentication and student role
router.use(auth);
router.use(authorize('student'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Course routes
router.get('/courses/elective', getElectiveCourses);
router.post('/courses/register', registerCourse);
router.delete('/courses/drop', dropCourse);

// Gradesheet routes
router.get('/gradesheet', getGradesheet);

// Club routes
router.get('/clubs', getClubs);
router.post('/clubs/join', requestJoinClub);

// Feedback routes
router.post('/feedback', submitFeedback);

// Announcement routes
router.get('/announcements', getAnnouncements);

module.exports = router;
