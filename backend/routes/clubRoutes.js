const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getMembers,
  addMember,
  removeMember,
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectRequests,
  createAnnouncement,
  getAnnouncements
} = require('../controllers/clubController');

// All routes require authentication and club role
router.use(auth);
router.use(authorize('club'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Member management routes
router.get('/members', getMembers);
router.post('/members', addMember);
router.delete('/members/:studentId', removeMember);

// Event management routes
router.post('/events', createEvent);
router.get('/events', getEvents);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId', deleteEvent);

// Project management routes
router.post('/projects', createProject);
router.get('/projects', getProjects);
router.put('/projects/:projectId', updateProject);
router.delete('/projects/:projectId', deleteProject);

// Project member management
router.post('/projects/:projectId/members', addProjectMember);
router.delete('/projects/:projectId/members/:studentId', removeProjectMember);
router.get('/projects/:projectId/requests', getProjectRequests);

// Announcement routes
router.post('/announcements', createAnnouncement);
router.get('/announcements', getAnnouncements);

module.exports = router;
