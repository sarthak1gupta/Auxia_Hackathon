import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // Student signup
  studentSignup: (data) => api.post('/auth/student/signup', data),
  
  // Faculty signup
  facultySignup: (data) => api.post('/auth/faculty/signup', data),
  
  // Admin signup
  adminSignup: (data) => api.post('/auth/admin/signup', data),
  
  // Club signup
  clubSignup: (data) => api.post('/auth/club/signup', data),
  
  // Login
  login: (data) => api.post('/auth/login', data),
};

// Student APIs
export const studentAPI = {
  // Profile
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  
  // Courses
  getElectiveCourses: () => api.get('/student/courses/elective'),
  registerCourse: (courseId) => api.post('/student/courses/register', { courseId }),
  dropCourse: (courseId) => api.delete('/student/courses/drop', { data: { courseId } }),
  
  // Gradesheet
  getGradesheet: (semester) => api.get(`/student/gradesheet?semester=${semester}`),
  
  // Clubs
  getClubs: () => api.get('/student/clubs'),
  joinClub: (clubId) => api.post('/student/clubs/join', { clubId }),
  
  // Feedback
  submitFeedback: (data) => api.post('/student/feedback', data),
  
  // Announcements
  getAnnouncements: () => api.get('/student/announcements'),
};

// Faculty APIs
export const facultyAPI = {
  // Profile
  getProfile: () => api.get('/faculty/profile'),
  updateProfile: (data) => api.put('/faculty/profile', data),
  
  // Courses
  getAllocatedCourses: () => api.get('/faculty/courses'),
  getCourseStudents: (courseId) => api.get(`/faculty/courses/${courseId}/students`),
  
  // Marks
  uploadMarks: (data) => api.post('/faculty/courses/marks', data),
  
  // Resources
  uploadResource: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/faculty/courses/resource', formData, config);
  },
  
  // Announcements
  createAnnouncement: (courseId, data) => api.post(`/faculty/courses/${courseId}/announcements`, data),
  getCourseAnnouncements: (courseId) => api.get(`/faculty/courses/${courseId}/announcements`),
};

// Admin APIs
export const adminAPI = {
  // Profile
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  
  // Course Management
  createCourse: (data) => api.post('/admin/courses', data),
  getAllCourses: () => api.get('/admin/courses'),
  updateCourse: (courseId, data) => api.put(`/admin/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),
  
  // User Management
  getAllFaculty: () => api.get('/admin/faculty'),
  getAllStudents: () => api.get('/admin/students'),
  getUserStats: () => api.get('/admin/users/stats'),
  createUser: (userType, userData) => api.post('/admin/users', { userType, ...userData }),
  
  // Gradesheet Management
  generateGradesheet: (data) => api.post('/admin/gradesheets/generate', data),
  releaseGradesheet: (gradesheetId) => api.put(`/admin/gradesheets/${gradesheetId}/release`),
  getAllGradesheets: () => api.get('/admin/gradesheets'),
  
  // Feedback System
  getFeedbackStats: () => api.get('/admin/feedback/stats'),
  
  // Announcements
  createGlobalAnnouncement: (data) => api.post('/admin/announcements', data),
  getAllAnnouncements: () => api.get('/admin/announcements'),
  deleteAnnouncement: (announcementId) => api.delete(`/admin/announcements/${announcementId}`),
};

// Club APIs
export const clubAPI = {
  // Profile
  getProfile: () => api.get('/club/profile'),
  updateProfile: (data) => api.put('/club/profile', data),
  
  // Member Management
  getMembers: () => api.get('/club/members'),
  addMember: (studentId) => api.post('/club/members', { studentId }),
  removeMember: (studentId) => api.delete(`/club/members/${studentId}`),
  
  // Event Management
  createEvent: (data) => api.post('/club/events', data),
  getEvents: () => api.get('/club/events'),
  updateEvent: (eventId, data) => api.put(`/club/events/${eventId}`, data),
  deleteEvent: (eventId) => api.delete(`/club/events/${eventId}`),
  
  // Project Management
  createProject: (data) => api.post('/club/projects', data),
  getProjects: () => api.get('/club/projects'),
  updateProject: (projectId, data) => api.put(`/club/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/club/projects/${projectId}`),
  
  // Project Member Management
  addProjectMember: (projectId, studentId) => api.post(`/club/projects/${projectId}/members`, { studentId }),
  removeProjectMember: (projectId, studentId) => api.delete(`/club/projects/${projectId}/members/${studentId}`),
  getProjectRequests: (projectId) => api.get(`/club/projects/${projectId}/requests`),
  
  // Announcements
  createAnnouncement: (data) => api.post('/club/announcements', data),
  getAnnouncements: () => api.get('/club/announcements'),
};

// Health check
export const healthCheck = () => api.get('/health');

// File upload helper
export const uploadFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Error handler
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

export default api;
