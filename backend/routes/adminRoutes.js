const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getAllFaculty,
  getAllStudents,
  generateGradesheet,
  releaseGradesheet,
  getAllGradesheets,
  getFeedbackStats,
  createGlobalAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  getUserStats,
  createUser
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Course management routes
router.post('/courses', createCourse);
router.get('/courses', getAllCourses);
router.put('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);

// User management routes
router.get('/faculty', getAllFaculty);
router.get('/students', getAllStudents);
router.get('/users/stats', getUserStats);
router.post('/users', createUser);

// Gradesheet management routes
router.post('/gradesheets/generate', generateGradesheet);
router.put('/gradesheets/:gradesheetId/release', releaseGradesheet);
router.get('/gradesheets', getAllGradesheets);

// Feedback system routes
router.get('/feedback/stats', getFeedbackStats);

// Announcement management routes
router.post('/announcements', createGlobalAnnouncement);
router.get('/announcements', getAllAnnouncements);
router.delete('/announcements/:announcementId', deleteAnnouncement);

module.exports = router;
