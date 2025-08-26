// facultyRoutes.js - Enhanced version
const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const {
  getProfile,
  updateProfile,
  getAllocatedCourses,
  getCourseStudents,
  uploadMarks,
  uploadResource,
  createAnnouncement,
  getCourseAnnouncements,
  bulkUploadMarks
} = require('../controllers/facultyController');

// Configure multer for bulk marks upload
const bulkUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed for bulk marks upload'));
    }
  }
});

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
router.post('/courses/marks/bulk', bulkUpload.single('file'), bulkUploadMarks);

// Resource upload
router.post('/courses/resource', uploadResource);

// Announcement routes
router.post('/courses/:courseId/announcements', createAnnouncement);
router.get('/courses/:courseId/announcements', getCourseAnnouncements);

module.exports = router;