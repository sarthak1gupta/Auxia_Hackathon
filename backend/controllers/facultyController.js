const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Gradesheet = require('../models/Gradesheet');
const Announcement = require('../models/Announcement');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|ppt|pptx|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, PPT, and DOC files are allowed'));
    }
  }
}).single('resource');

// Get faculty profile
const getProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user._id)
      .populate('coursesAllocated', 'code name department')
      .select('-password');
    
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update faculty profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, areasOfExpertise } = req.body;
    
    const faculty = await Faculty.findByIdAndUpdate(
      req.user._id,
      { name, phone, areasOfExpertise },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get allocated courses
const getAllocatedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user._id })
      .populate('students', 'name usn semester')
      .populate('faculty', 'name department');
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students in a specific course
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId)
      .populate('students', 'name usn semester collegeEmail')
      .populate('faculty', 'name department');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if faculty is allocated to this course
    if (!course.faculty.some(f => f._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this course' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload/update student marks
const uploadMarks = async (req, res) => {
  try {
    const { courseId, studentId, marks } = req.body;
    
    if (marks < 0 || marks > 100) {
      return res.status(400).json({ message: 'Marks must be between 0 and 100' });
    }
    
    // Check if faculty is allocated to this course
    const course = await Course.findById(courseId);
    if (!course.faculty.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this course' });
    }
    
    // Check if student is enrolled in this course
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student not enrolled in this course' });
    }
    
    // Find or create gradesheet for the student
    let gradesheet = await Gradesheet.findOne({
      student: studentId,
      semester: req.body.semester
    });
    
    if (!gradesheet) {
      gradesheet = new Gradesheet({
        student: studentId,
        semester: req.body.semester,
        courses: []
      });
    }
    
    // Update or add course marks
    const courseIndex = gradesheet.courses.findIndex(
      c => c.course.toString() === courseId
    );
    
    if (courseIndex > -1) {
      gradesheet.courses[courseIndex].marks = marks;
      gradesheet.courses[courseIndex].grade = calculateGrade(marks);
    } else {
      gradesheet.courses.push({
        course: courseId,
        marks: marks,
        grade: calculateGrade(marks)
      });
    }
    
    await gradesheet.save();
    
    res.json({ message: 'Marks uploaded successfully', gradesheet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload course resource (notes, PPT, PDF)
const uploadResource = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { courseId, title, description } = req.body;
      
      // Check if faculty is allocated to this course
      const course = await Course.findById(courseId);
      if (!course.faculty.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized for this course' });
      }
      
      // Create announcement for the resource
      const announcement = new Announcement({
        title: `New Resource: ${title}`,
        description: `${description}\n\nFile: ${req.file.filename}`,
        createdBy: 'Faculty',
        targetAudience: 'Course',
        course: courseId
      });
      
      await announcement.save();
      
      res.json({ 
        message: 'Resource uploaded successfully',
        filename: req.file.filename,
        announcement: announcement
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create course announcement
const createAnnouncement = async (req, res) => {
  try {
    const { courseId, title, description } = req.body;
    
    // Check if faculty is allocated to this course
    const course = await Course.findById(courseId);
    if (!course.faculty.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this course' });
    }
    
    const announcement = new Announcement({
      title,
      description,
      createdBy: 'Faculty',
      targetAudience: 'Course',
      course: courseId
    });
    
    await announcement.save();
    
    res.json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course announcements
const getCourseAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if faculty is allocated to this course
    const course = await Course.findById(courseId);
    if (!course.faculty.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this course' });
    }
    
    const announcements = await Announcement.find({
      course: courseId,
      createdBy: 'Faculty'
    }).sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to calculate grade
const calculateGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C+';
  if (marks >= 40) return 'C';
  if (marks >= 35) return 'D';
  return 'F';
};

module.exports = {
  getProfile,
  updateProfile,
  getAllocatedCourses,
  getCourseStudents,
  uploadMarks,
  uploadResource,
  createAnnouncement,
  getCourseAnnouncements
};
