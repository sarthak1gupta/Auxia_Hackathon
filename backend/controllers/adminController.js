const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Gradesheet = require('../models/Gradesheet');
const Feedback = require('../models/Feedback');
const Announcement = require('../models/Announcement');
const bcrypt = require('bcryptjs');

// Get admin profile
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update admin profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const admin = await Admin.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new course
const createCourse = async (req, res) => {
  try {
    const { code, name, department, type, seatLimit, facultyIds } = req.body;
    
    // Check if course code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }
    
    // Validate faculty allocation (max 3 courses per faculty)
    if (facultyIds && facultyIds.length > 0) {
      for (const facultyId of facultyIds) {
        const faculty = await Faculty.findById(facultyId);
        if (faculty.coursesAllocated.length >= 3) {
          return res.status(400).json({ 
            message: `Faculty ${faculty.name} already has maximum 3 courses allocated` 
          });
        }
      }
    }
    
    const course = new Course({
      code,
      name,
      department,
      type,
      seatLimit,
      faculty: facultyIds || []
    });
    
    await course.save();
    
    // Update faculty courses if faculty are allocated
    if (facultyIds && facultyIds.length > 0) {
      await Faculty.updateMany(
        { _id: { $in: facultyIds } },
        { $push: { coursesAllocated: course._id } }
      );
    }
    
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('faculty', 'name department')
      .populate('students', 'name usn');
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, department, seatLimit, facultyIds } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Remove old faculty allocations
    if (course.faculty.length > 0) {
      await Faculty.updateMany(
        { _id: { $in: course.faculty } },
        { $pull: { coursesAllocated: courseId } }
      );
    }
    
    // Validate new faculty allocation
    if (facultyIds && facultyIds.length > 0) {
      for (const facultyId of facultyIds) {
        const faculty = await Faculty.findById(facultyId);
        if (faculty.coursesAllocated.length >= 3) {
          return res.status(400).json({ 
            message: `Faculty ${faculty.name} already has maximum 3 courses allocated` 
          });
        }
      }
    }
    
    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { name, department, seatLimit, faculty: facultyIds || [] },
      { new: true, runValidators: true }
    );
    
    // Update new faculty allocations
    if (facultyIds && facultyIds.length > 0) {
      await Faculty.updateMany(
        { _id: { $in: facultyIds } },
        { $push: { coursesAllocated: courseId } }
      );
    }
    
    res.json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Remove faculty allocations
    if (course.faculty.length > 0) {
      await Faculty.updateMany(
        { _id: { $in: course.faculty } },
        { $pull: { coursesAllocated: courseId } }
      );
    }
    
    // Remove student enrollments
    if (course.students.length > 0) {
      await Student.updateMany(
        { _id: { $in: course.students } },
        { $pull: { electiveCourses: courseId } }
      );
    }
    
    await Course.findByIdAndDelete(courseId);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all faculty
const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate('coursesAllocated', 'code name department')
      .select('-password');
    
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('coreCourses', 'code name')
      .populate('electiveCourses', 'code name')
      .select('-password');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate gradesheet for a student
const generateGradesheet = async (req, res) => {
  try {
    const { studentId, semester } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if gradesheet already exists
    let gradesheet = await Gradesheet.findOne({ student: studentId, semester });
    
    if (gradesheet) {
      return res.status(400).json({ message: 'Gradesheet already exists for this semester' });
    }
    
    // Get all courses for the student in this semester
    const allCourses = [...student.coreCourses, ...student.electiveCourses];
    
    // Find existing gradesheet entries for these courses
    const existingGrades = await Gradesheet.find({
      student: studentId,
      'courses.course': { $in: allCourses }
    });
    
    // Create new gradesheet
    gradesheet = new Gradesheet({
      student: studentId,
      semester,
      courses: [],
      cgpa: null,
      released: false
    });
    
    // Add course grades if they exist
    if (existingGrades.length > 0) {
      for (const grade of existingGrades) {
        for (const courseGrade of grade.courses) {
          if (allCourses.includes(courseGrade.course)) {
            gradesheet.courses.push({
              course: courseGrade.course,
              marks: courseGrade.marks,
              grade: courseGrade.grade
            });
          }
        }
      }
    }
    
    await gradesheet.save();
    
    res.json({ message: 'Gradesheet generated successfully', gradesheet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Release gradesheet to student
const releaseGradesheet = async (req, res) => {
  try {
    const { gradesheetId } = req.params;
    
    const gradesheet = await Gradesheet.findById(gradesheetId);
    if (!gradesheet) {
      return res.status(404).json({ message: 'Gradesheet not found' });
    }
    
    gradesheet.released = true;
    await gradesheet.save();
    
    res.json({ message: 'Gradesheet released successfully', gradesheet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all gradesheets
const getAllGradesheets = async (req, res) => {
  try {
    const gradesheets = await Gradesheet.find()
      .populate('student', 'name usn semester')
      .populate('courses.course', 'code name department');
    
    res.json(gradesheets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get feedback statistics
const getFeedbackStats = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('faculty', 'name department')
      .populate('course', 'code name');
    
    // Group feedback by faculty
    const facultyStats = {};
    feedbacks.forEach(feedback => {
      const facultyId = feedback.faculty._id.toString();
      if (!facultyStats[facultyId]) {
        facultyStats[facultyId] = {
          faculty: feedback.faculty,
          totalFeedback: 0,
          courses: {}
        };
      }
      
      facultyStats[facultyId].totalFeedback++;
      
      if (feedback.course) {
        const courseId = feedback.course._id.toString();
        if (!facultyStats[facultyId].courses[courseId]) {
          facultyStats[facultyId].courses[courseId] = {
            course: feedback.course,
            feedbackCount: 0
          };
        }
        facultyStats[facultyId].courses[courseId].feedbackCount++;
      }
    });
    
    res.json({ facultyStats, totalFeedbacks: feedbacks.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create global announcement
const createGlobalAnnouncement = async (req, res) => {
  try {
    const { title, description, targetAudience } = req.body;
    
    const announcement = new Announcement({
      title,
      description,
      createdBy: 'Admin',
      targetAudience: targetAudience || 'All'
    });
    
    await announcement.save();
    
    res.json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    await Announcement.findByIdAndDelete(announcementId);
    
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const [students, faculty, admins] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Admin.countDocuments()
    ]);
    
    res.json({
      success: true,
      stats: { students, faculty, admins }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    console.log('Admin createUser called with:', req.body);
    const { userType, ...userData } = req.body;
    
    // Validate required fields
    if (!userData.name || !userData.password) {
      return res.status(400).json({
        success: false,
        message: 'Name and password are required for all users'
      });
    }
    
    let newUser;
    let responseMessage;
    
    switch (userType) {
      case 'student':
        // Validate student-specific required fields
        if (!userData.usn || !userData.department || !userData.semester || !userData.collegeEmail) {
          return res.status(400).json({
            success: false,
            message: 'USN, department, semester, and college email are required for students'
          });
        }
        
        // Check if USN already exists
        const existingStudent = await Student.findOne({ usn: userData.usn });
        if (existingStudent) {
          return res.status(400).json({ 
            success: false,
            message: 'Student with this USN already exists' 
          });
        }
        
        // Check if email already exists
        const existingStudentEmail = await Student.findOne({ collegeEmail: userData.collegeEmail });
        if (existingStudentEmail) {
          return res.status(400).json({ 
            success: false,
            message: 'Student with this email already exists' 
          });
        }
        
        newUser = new Student(userData);
        responseMessage = 'Student created successfully';
        break;
        
      case 'faculty':
        // Validate faculty-specific required fields
        if (!userData.facultyId || !userData.department || !userData.email) {
          return res.status(400).json({
            success: false,
            message: 'Faculty ID, department, and email are required for faculty'
          });
        }
        
        // Check if faculty ID already exists
        const existingFaculty = await Faculty.findOne({ facultyId: userData.facultyId });
        if (existingFaculty) {
          return res.status(400).json({ 
            success: false,
            message: 'Faculty with this ID already exists' 
          });
        }
        
        // Check if email already exists
        const existingFacultyEmail = await Faculty.findOne({ email: userData.email });
        if (existingFacultyEmail) {
          return res.status(400).json({ 
            success: false,
            message: 'Faculty with this email already exists' 
          });
        }
        
        newUser = new Faculty(userData);
        responseMessage = 'Faculty created successfully';
        break;
        
      case 'admin':
        // Validate admin-specific required fields
        if (!userData.adminId || !userData.email) {
          return res.status(400).json({
            success: false,
            message: 'Admin ID and email are required for admins'
          });
        }
        
        // Check if admin ID already exists
        const existingAdmin = await Admin.findOne({ adminId: userData.adminId });
        if (existingAdmin) {
          return res.status(400).json({ 
            success: false,
            message: 'Admin with this ID already exists' 
          });
        }
        
        // Check if email already exists
        const existingAdminEmail = await Admin.findOne({ email: userData.email });
        if (existingAdminEmail) {
          return res.status(400).json({ 
            success: false,
            message: 'Admin with this email already exists' 
          });
        }
        
        newUser = new Admin(userData);
        responseMessage = 'Admin created successfully';
        break;
        
      default:
        return res.status(400).json({ 
          success: false,
          message: 'Invalid user type' 
        });
    }
    
    // Hash password before saving
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(userData.password, salt);
    }
    
    await newUser.save();
    
    res.status(201).json({
      success: true,
      message: responseMessage,
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
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
};
