const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Admin = require('../models/Admin');
const Club = require('../models/Club');

// Helper function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Student Signup
const studentSignup = async (req, res) => {
  try {
    const { name, usn, semester, collegeEmail, personalEmail, phone, department, password } = req.body;

    // Validation
    if (!name || !usn || !semester || !collegeEmail || !department || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // USN format validation (e.g., 1MS21CS001)
    const usnRegex = /^\d{1}[A-Z]{2}\d{2}[A-Z]{2}\d{3}$/;
    if (!usnRegex.test(usn)) {
      return res.status(400).json({ message: 'Invalid USN format' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(collegeEmail)) {
      return res.status(400).json({ message: 'Invalid college email format' });
    }

    if (personalEmail && !emailRegex.test(personalEmail)) {
      return res.status(400).json({ message: 'Invalid personal email format' });
    }

    // Phone validation
    if (phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be 10 digits' });
      }
    }

    // Check if user already exists
    const existingStudent = await Student.findOne({
      $or: [{ usn }, { collegeEmail }]
    });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this USN or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const student = new Student({
      name,
      usn,
      semester,
      collegeEmail,
      personalEmail,
      phone,
      department,
      password: hashedPassword
    });

    await student.save();

    // Generate token
    const token = generateToken(student._id, 'student');

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: student._id,
        name: student.name,
        usn: student.usn,
        role: 'student'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Faculty Signup
const facultySignup = async (req, res) => {
  try {
    const { name, facultyId, email, phone, department, areasOfExpertise, password } = req.body;

    // Validation
    if (!name || !facultyId || !email || !department || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Faculty ID validation (e.g., FAC001)
    const facultyIdRegex = /^[A-Z]{3}\d{3}$/;
    if (!facultyIdRegex.test(facultyId)) {
      return res.status(400).json({ message: 'Invalid faculty ID format (e.g., FAC001)' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Phone validation
    if (phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be 10 digits' });
      }
    }

    // Check if user already exists
    const existingFaculty = await Faculty.findOne({
      $or: [{ facultyId }, { email }]
    });

    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty with this ID or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create faculty
    const faculty = new Faculty({
      name,
      facultyId,
      email,
      phone,
      department,
      areasOfExpertise: areasOfExpertise || [],
      password: hashedPassword
    });

    await faculty.save();

    // Generate token
    const token = generateToken(faculty._id, 'faculty');

    res.status(201).json({
      message: 'Faculty registered successfully',
      token,
      user: {
        id: faculty._id,
        name: faculty.name,
        facultyId: faculty.facultyId,
        role: 'faculty'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Signup
const adminSignup = async (req, res) => {
  try {
    const { name, adminId, email, phone, password } = req.body;

    // Validation
    if (!name || !adminId || !email || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Admin ID validation (e.g., ADM001)
    const adminIdRegex = /^[A-Z]{3}\d{3}$/;
    if (!adminIdRegex.test(adminId)) {
      return res.status(400).json({ message: 'Invalid admin ID format (e.g., ADM001)' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Phone validation
    if (phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be 10 digits' });
      }
    }

    // Check if user already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ adminId }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this ID or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new Admin({
      name,
      adminId,
      email,
      phone,
      password: hashedPassword
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        adminId: admin.adminId,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Club Signup
const clubSignup = async (req, res) => {
  try {
    const { name, description, password } = req.body;

    // Validation
    if (!name || !password) {
      return res.status(400).json({ message: 'Club name and password are required' });
    }

    // Check if club already exists
    const existingClub = await Club.findOne({ name });

    if (existingClub) {
      return res.status(400).json({ message: 'Club with this name already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create club
    const club = new Club({
      name,
      description,
      password: hashedPassword
    });

    await club.save();

    // Generate token
    const token = generateToken(club._id, 'club');

    res.status(201).json({
      message: 'Club registered successfully',
      token,
      user: {
        id: club._id,
        name: club.name,
        role: 'club'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login for all user types
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    let user;
    let userRole;

    // Find user based on role
    switch (role) {
      case 'student':
        user = await Student.findOne({ collegeEmail: email });
        userRole = 'student';
        break;
      case 'faculty':
        user = await Faculty.findOne({ email });
        userRole = 'faculty';
        break;
      case 'admin':
        user = await Admin.findOne({ email });
        userRole = 'admin';
        break;
      case 'club':
        user = await Club.findOne({ name: email }); // For clubs, email field is used for club name
        userRole = 'club';
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, userRole);

    // Return user data based on role
    let userData = {
      id: user._id,
      name: user.name,
      role: userRole
    };

    if (userRole === 'student') {
      userData.usn = user.usn;
      userData.semester = user.semester;
      userData.department = user.department;
    } else if (userRole === 'faculty') {
      userData.facultyId = user.facultyId;
      userData.department = user.department;
    } else if (userRole === 'admin') {
      userData.adminId = user.adminId;
    }

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  studentSignup,
  facultySignup,
  adminSignup,
  clubSignup,
  login
};
