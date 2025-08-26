const Student = require('../models/Student');
const Course = require('../models/Course');
const Gradesheet = require('../models/Gradesheet');
const Club = require('../models/Club');
const Feedback = require('../models/Feedback');
const Announcement = require('../models/Announcement');

// Get student profile
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate('coreCourses', 'code name department')
      .populate('electiveCourses', 'code name department')
      .populate('clubsJoined', 'name description')
      .select('-password');
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student profile
const updateProfile = async (req, res) => {
  try {
    const { name, personalEmail, phone, interests } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { name, personalEmail, phone, interests },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available elective courses
const getElectiveCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      type: 'elective',
      department: req.user.department,
      seatsFilled: { $lt: '$seatLimit' }
    }).populate('faculty', 'name department');
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register for elective course
const registerCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.seatsFilled >= course.seatLimit) {
      return res.status(400).json({ message: 'Course is full' });
    }
    
    if (course.type !== 'elective') {
      return res.status(400).json({ message: 'Can only register for elective courses' });
    }
    
    // Check if already registered
    const student = await Student.findById(req.user._id);
    if (student.electiveCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }
    
    // Update course seats
    await Course.findByIdAndUpdate(courseId, {
      $inc: { seatsFilled: 1 },
      $push: { students: req.user._id }
    });
    
    // Update student courses
    await Student.findByIdAndUpdate(req.user._id, {
      $push: { electiveCourses: courseId }
    });
    
    res.json({ message: 'Course registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Drop elective course
const dropCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update course seats
    await Course.findByIdAndUpdate(courseId, {
      $inc: { seatsFilled: -1 },
      $pull: { students: req.user._id }
    });
    
    // Update student courses
    await Student.findByIdAndUpdate(req.user._id, {
      $pull: { electiveCourses: courseId }
    });
    
    res.json({ message: 'Course dropped successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get gradesheet
const getGradesheet = async (req, res) => {
  try {
    const gradesheet = await Gradesheet.findOne({ 
      student: req.user._id,
      semester: req.query.semester || req.user.semester
    }).populate('courses.course', 'code name department');
    
    if (!gradesheet) {
      return res.status(404).json({ message: 'Gradesheet not found' });
    }
    
    if (!gradesheet.released) {
      return res.status(403).json({ message: 'Gradesheet not yet released' });
    }
    
    res.json(gradesheet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available clubs
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('members', 'name usn');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Request to join club
const requestJoinClub = async (req, res) => {
  try {
    const { clubId } = req.body;
    
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    // Check if already a member
    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member of this club' });
    }
    
    // Add to members (in real system, this would be a request that needs approval)
    await Club.findByIdAndUpdate(clubId, {
      $push: { members: req.user._id }
    });
    
    // Update student clubs
    await Student.findByIdAndUpdate(req.user._id, {
      $push: { clubsJoined: clubId }
    });
    
    res.json({ message: 'Successfully joined club' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { facultyId, courseId, feedbackText } = req.body;
    
    const feedback = new Feedback({
      faculty: facultyId,
      course: courseId,
      feedbackText,
      anonymous: true
    });
    
    await feedback.save();
    
    // Update student's feedbacks
    await Student.findByIdAndUpdate(req.user._id, {
      $push: { feedbacksSubmitted: feedback._id }
    });
    
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      $or: [
        { targetAudience: 'All' },
        { targetAudience: 'Students' },
        { course: { $in: [...req.user.coreCourses, ...req.user.electiveCourses] } },
        { club: { $in: req.user.clubsJoined } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};
