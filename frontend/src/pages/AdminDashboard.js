import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({ students: 0, faculty: 0, admins: 0 });
  const [addingUser, setAddingUser] = useState(false);
  const [addUserMessage, setAddUserMessage] = useState(null);
  const [newUser, setNewUser] = useState({
    userType: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    usn: '',
    facultyId: '',
    adminId: '',
    semester: '',
    areasOfExpertise: ''
  });

  // Course Management State
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [addingCourse, setAddingCourse] = useState(false);
  const [courseMessage, setCourseMessage] = useState(null);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: '',
    type: 'core',
    seatLimit: '',
    semester: '',
    facultyIds: []
  });

  // Gradesheet Management State
  const [gradesheets, setGradesheets] = useState([]);
  const [students, setStudents] = useState([]);
  const [generatingGradesheet, setGeneratingGradesheet] = useState(false);
  const [gradesheetMessage, setGradesheetMessage] = useState(null);
  const [gradesheetForm, setGradesheetForm] = useState({
    studentId: '',
    semester: '',
    department: ''
  });

  // Feedback System State
  const [feedbackStats, setFeedbackStats] = useState({});
  const [releasingFeedback, setReleasingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    facultyId: '',
    courseId: '',
    startDate: '',
    endDate: ''
  });

  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    targetAudience: 'All',
    courseId: '',
    googleFormLink: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await adminAPI.getUserStats();
        if (response.data.success) {
          setUserStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (activeTab === 'users') {
      fetchUserStats();
    }
  }, [activeTab]);

  // Fetch courses and faculty for course management
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [coursesResponse, facultyResponse] = await Promise.all([
          adminAPI.getAllCourses(),
          adminAPI.getAllFaculty()
        ]);
        
        if (coursesResponse.data) {
          setCourses(coursesResponse.data);
        }
        if (facultyResponse.data) {
          setFaculty(facultyResponse.data);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    if (activeTab === 'courses') {
      fetchCourseData();
    }
  }, [activeTab]);

  // Fetch gradesheets and students
  useEffect(() => {
    const fetchGradesheetData = async () => {
      try {
        const [gradesheetsResponse, studentsResponse] = await Promise.all([
          adminAPI.getAllGradesheets(),
          adminAPI.getAllStudents()
        ]);
        
        if (gradesheetsResponse.data) {
          setGradesheets(gradesheetsResponse.data);
        }
        if (studentsResponse.data) {
          setStudents(studentsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching gradesheet data:', error);
      }
    };

    if (activeTab === 'gradesheets') {
      fetchGradesheetData();
    }
  }, [activeTab]);

  // Fetch feedback statistics
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await adminAPI.getFeedbackStats();
        if (response.data) {
          setFeedbackStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching feedback stats:', error);
      }
    };

    if (activeTab === 'feedback') {
      fetchFeedbackData();
    }
  }, [activeTab]);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await adminAPI.getAllAnnouncements();
        if (response.data) {
          setAnnouncements(response.data);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [activeTab]);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
    setAddUserMessage(null); // Clear any previous messages
  };

  const resetNewUserForm = () => {
    setNewUser({
      userType: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      password: '',
      usn: '',
      facultyId: '',
      adminId: '',
      semester: '',
      areasOfExpertise: ''
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setAddUserMessage(null);

    try {
      let userData = {
        name: newUser.name,
        password: newUser.password,
        phone: newUser.phone
      };

      // Add role-specific fields
      switch (newUser.userType) {
        case 'student':
          userData = {
            ...userData,
            collegeEmail: newUser.email, // Student model expects collegeEmail
            usn: newUser.usn,
            department: newUser.department,
            semester: parseInt(newUser.semester)
          };
          break;
        case 'faculty':
          userData = {
            ...userData,
            email: newUser.email, // Faculty model expects email
            facultyId: newUser.facultyId,
            department: newUser.department,
            areasOfExpertise: newUser.areasOfExpertise.split(',').map(s => s.trim())
          };
          break;
        case 'admin':
          userData = {
            ...userData,
            email: newUser.email, // Admin model expects email
            adminId: newUser.adminId
          };
          break;
        default:
          throw new Error('Invalid user type');
      }

      console.log('Sending user data to backend:', { userType: newUser.userType, userData });
      const response = await adminAPI.createUser(newUser.userType, userData);

      if (response.data.success) {
        setAddUserMessage({
          type: 'success',
          text: `${newUser.userType.charAt(0).toUpperCase() + newUser.userType.slice(1)} created successfully!`
        });
        resetNewUserForm();
        
        // Refresh user stats
        const statsResponse = await adminAPI.getUserStats();
        if (statsResponse.data.success) {
          setUserStats(statsResponse.data.stats);
        }
      } else {
        setAddUserMessage({
          type: 'error',
          text: response.data.message || 'Failed to create user'
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setAddUserMessage({
        type: 'error',
        text: error.response?.data?.message || 'An error occurred while creating the user'
      });
    } finally {
      setAddingUser(false);
    }
  };

  // Course Management Handlers
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    console.log('Course field change:', { name, value });
    setNewCourse(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      console.log('Updated course state:', updated);
      return updated;
    });
    setCourseMessage(null); // Clear any previous messages
  };

  const handleFacultySelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    console.log('Faculty selection change:', selectedOptions);
    setNewCourse(prev => ({
      ...prev,
      facultyIds: selectedOptions
    }));
    setCourseMessage(null);
  };

  const resetCourseForm = () => {
    setNewCourse({
      code: '',
      name: '',
      department: '',
      type: 'core',
      seatLimit: '',
      semester: '',
      facultyIds: []
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    setAddingCourse(true);
    setCourseMessage(null);

    try {
      console.log('Form data:', newCourse);
      // Validate required fields
      if (!newCourse.code || !newCourse.name || !newCourse.department || !newCourse.seatLimit || !newCourse.semester) {
        console.log('Missing required fields');
        setCourseMessage({
          type: 'error',
          text: 'Please fill in all required fields'
        });
        return;
      }

      const courseData = {
        code: newCourse.code,
        name: newCourse.name,
        department: newCourse.department,
        type: newCourse.type,
        seatLimit: parseInt(newCourse.seatLimit),
        semester: parseInt(newCourse.semester),
        facultyIds: newCourse.facultyIds || []
      };

      console.log('Sending course data to backend:', courseData);
      console.log('API call to createCourse...');
      const response = await adminAPI.createCourse(courseData);

      console.log('Backend response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.data.message === 'Course created successfully') {
        setCourseMessage({
          type: 'success',
          text: 'Course created successfully!'
        });
        resetCourseForm();
        
        // Refresh course data
        const coursesResponse = await adminAPI.getAllCourses();
        if (coursesResponse.data) {
          setCourses(coursesResponse.data);
        }
      } else {
        setCourseMessage({
          type: 'error',
          text: response.data.message || 'Failed to create course'
        });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      setCourseMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'An error occurred while creating the course'
      });
    } finally {
      setAddingCourse(false);
    }
  };

  // Gradesheet Management Handlers
  const handleGradesheetChange = (e) => {
    const { name, value } = e.target;
    setGradesheetForm(prev => ({
      ...prev,
      [name]: value
    }));
    setGradesheetMessage(null);
  };

  const handleGenerateGradesheet = async (e) => {
    e.preventDefault();
    setGeneratingGradesheet(true);
    setGradesheetMessage(null);

    try {
      // Validate required fields
      if (!gradesheetForm.semester || !gradesheetForm.department) {
        setGradesheetMessage({
          type: 'error',
          text: 'Please select both semester and department'
        });
        return;
      }

      const gradesheetData = {
        semester: parseInt(gradesheetForm.semester),
        department: gradesheetForm.department
      };

      console.log('Generating gradesheets for:', gradesheetData);
      const response = await adminAPI.generateGradesheet(gradesheetData);

      console.log('Backend response:', response);

      if (response.data.message && response.data.message.includes('Successfully generated')) {
        setGradesheetMessage({
          type: 'success',
          text: response.data.message
        });
        
        // Reset form
        setGradesheetForm({
          studentId: '',
          semester: '',
          department: ''
        });
        
        // Refresh gradesheet data
        const gradesheetsResponse = await adminAPI.getAllGradesheets();
        if (gradesheetsResponse.data) {
          setGradesheets(gradesheetsResponse.data);
        }
      } else {
        setGradesheetMessage({
          type: 'error',
          text: response.data.message || 'Failed to generate gradesheets'
        });
      }
    } catch (error) {
      console.error('Error generating gradesheets:', error);
      setGradesheetMessage({
        type: 'error',
        text: error.response?.data?.message || 'An error occurred while generating gradesheets'
      });
    } finally {
      setGeneratingGradesheet(false);
    }
  };

  const handleReleaseGradesheet = async (gradesheetId) => {
    try {
      const response = await adminAPI.releaseGradesheet(gradesheetId);
      
      if (response.data.message === 'Gradesheet released successfully') {
        // Refresh gradesheet data
        const gradesheetsResponse = await adminAPI.getAllGradesheets();
        if (gradesheetsResponse.data) {
          setGradesheets(gradesheetsResponse.data);
        }
        
        // Show success message
        setGradesheetMessage({
          type: 'success',
          text: 'Gradesheet released successfully!'
        });
      }
    } catch (error) {
      console.error('Error releasing gradesheet:', error);
      setGradesheetMessage({
        type: 'error',
        text: error.response?.data?.message || 'An error occurred while releasing the gradesheet'
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'courses', label: 'Course Management', icon: '📚' },
    { id: 'gradesheets', label: 'Gradesheets', icon: '📝' },
    { id: 'feedback', label: 'Feedback System', icon: '💬' },
    { id: 'announcements', label: 'Announcements', icon: '📢' }
  ];

  const mockData = {
    totalStudents: 450,
    totalFaculty: 25,
    totalCourses: 35,
    pendingGradesheets: 8,
    feedbackResponses: 156,
    recentAnnouncements: [
      { title: 'Placement Drive Registration', content: 'Tech companies visiting campus next week', date: '2024-10-10' },
      { title: 'Mid-semester break', content: 'College will be closed from 15th to 20th Oct', date: '2024-10-08' }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Students</h3>
                <p className="text-3xl font-bold text-blue-600">{mockData.totalStudents}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Total Faculty</h3>
                <p className="text-3xl font-bold text-green-600">{mockData.totalFaculty}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Total Courses</h3>
                <p className="text-3xl font-bold text-purple-600">{mockData.totalCourses}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Pending Actions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Gradesheets to Review</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {mockData.pendingGradesheets}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Feedback Responses</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {mockData.feedbackResponses}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>New faculty member added</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Course allocation updated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Global announcement sent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Add New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Type
                    </label>
                    <select 
                      name="userType"
                      value={newUser.userType}
                      onChange={handleNewUserChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select User Type</option>
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={newUser.name}
                      onChange={handleNewUserChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={newUser.phone}
                      onChange={handleNewUserChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select 
                      name="department"
                      value={newUser.department}
                      onChange={handleNewUserChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Science">Information Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                  
                  {/* Role-specific fields */}
                  {newUser.userType === 'student' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          USN
                        </label>
                        <input 
                          type="text" 
                          name="usn"
                          value={newUser.usn}
                          onChange={handleNewUserChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., 1CS22CS001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Semester
                        </label>
                        <select 
                          name="semester"
                          value={newUser.semester}
                          onChange={handleNewUserChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select Semester</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  
                  {newUser.userType === 'faculty' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Faculty ID
                        </label>
                        <input 
                          type="text" 
                          name="facultyId"
                          value={newUser.facultyId}
                          onChange={handleNewUserChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., FAC001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Areas of Expertise
                        </label>
                        <input 
                          type="text" 
                          name="areasOfExpertise"
                          value={newUser.areasOfExpertise}
                          onChange={handleNewUserChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., Machine Learning, Data Mining"
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {newUser.userType === 'admin' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin ID
                      </label>
                      <input 
                        type="text" 
                        name="adminId"
                        value={newUser.adminId}
                        onChange={handleNewUserChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., ADM001"
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter password"
                    required
                  />
                </div>
                
                {addUserMessage && (
                  <div className={`p-3 rounded-md ${
                    addUserMessage.type === 'success' 
                      ? 'bg-green-100 border border-green-400 text-green-700' 
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    {addUserMessage.text}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={addingUser}
                  className={`px-6 py-2 rounded-md text-white ${
                    addingUser 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {addingUser ? 'Adding User...' : 'Add User'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">User Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{userStats.students}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{userStats.faculty}</p>
                  <p className="text-sm text-gray-600">Faculty</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{userStats.admins}</p>
                  <p className="text-sm text-gray-600">Admins</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Add New Course</h3>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input 
                      type="text" 
                      name="code"
                      value={newCourse.code}
                      onChange={handleCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., CS201"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Name
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={newCourse.name}
                      onChange={handleCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter course name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select 
                      name="department"
                      value={newCourse.department}
                      onChange={handleCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Science">Information Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Type
                    </label>
                    <select 
                      name="type"
                      value={newCourse.type}
                      onChange={handleCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="core">Core</option>
                      <option value="elective">Elective</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seat Limit
                    </label>
                    <input 
                      type="number" 
                      name="seatLimit"
                      value={newCourse.seatLimit}
                      onChange={handleCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter seat limit"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <select 
                      name="semester"
                      value={newCourse.semester}
                      onChange={handleCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allocate Faculty (Optional)
                    </label>
                    <select 
                      multiple
                      name="facultyIds"
                      value={newCourse.facultyIds}
                      onChange={handleFacultySelection}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      size="3"
                    >
                      {faculty.map(f => (
                        <option key={f._id} value={f._id}>
                          {f.name} - {f.department}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple faculty members
                    </p>
                  </div>
                </div>
                
                {courseMessage && (
                  <div className={`p-3 rounded-md ${
                    courseMessage.type === 'success' 
                      ? 'bg-green-100 border border-green-400 text-green-700' 
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    {courseMessage.text}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={addingCourse}
                  className={`px-6 py-2 rounded-md text-white ${
                    addingCourse 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {addingCourse ? 'Adding Course...' : 'Add Course'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">All Courses</h3>
              {courses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No courses found. Add your first course above.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{course.name} ({course.code})</h4>
                          <p className="text-sm text-gray-600">
                            {course.department} • {course.type.charAt(0).toUpperCase() + course.type.slice(1)} • Semester {course.semester}
                          </p>
                          <p className="text-sm text-gray-600">
                            Seats: {course.seatsFilled || 0}/{course.seatLimit}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {course.faculty && course.faculty.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Allocated Faculty:</p>
                          <div className="flex flex-wrap gap-2">
                            {course.faculty.map((facultyMember, index) => (
                              <span 
                                key={facultyMember._id || index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {facultyMember.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {course.students && course.students.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Enrolled Students:</p>
                          <div className="flex flex-wrap gap-2">
                            {course.students.slice(0, 5).map((student, index) => (
                              <span 
                                key={student._id || index}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {student.name}
                              </span>
                            ))}
                            {course.students.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                +{course.students.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'gradesheets':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Generate Gradesheets</h3>
              <form onSubmit={handleGenerateGradesheet} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Semester
                    </label>
                    <select 
                      name="semester"
                      value={gradesheetForm.semester}
                      onChange={handleGradesheetChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Department
                    </label>
                    <select 
                      name="department"
                      value={gradesheetForm.department}
                      onChange={handleGradesheetChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Science">Information Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                </div>
                
                {gradesheetMessage && (
                  <div className={`p-3 rounded-md ${
                    gradesheetMessage.type === 'success' 
                      ? 'bg-green-100 border border-green-400 text-green-700' 
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    {gradesheetMessage.text}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={generatingGradesheet}
                  className={`px-6 py-2 rounded-md text-white ${
                    generatingGradesheet 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {generatingGradesheet ? 'Generating...' : 'Generate Gradesheets'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">All Gradesheets</h3>
              {gradesheets.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No gradesheets found. Generate gradesheets above.</p>
              ) : (
                <div className="space-y-4">
                  {gradesheets.map((gradesheet) => (
                    <div key={gradesheet._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">
                            {gradesheet.student?.name || 'Unknown Student'} - {gradesheet.student?.usn || 'N/A'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Semester {gradesheet.semester} • {gradesheet.student?.department || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            CGPA: {gradesheet.cgpa ? gradesheet.cgpa.toFixed(2) : 'Not calculated'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {gradesheet.released ? 
                              <span className="text-green-600 font-medium">Released</span> : 
                              <span className="text-yellow-600 font-medium">Pending Review</span>
                            }
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!gradesheet.released && (
                            <button 
                              onClick={() => handleReleaseGradesheet(gradesheet._id)}
                              className="text-green-600 hover:text-green-900 text-sm font-medium"
                            >
                              Release
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {gradesheet.courses && gradesheet.courses.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Course Grades:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {gradesheet.courses.map((courseGrade, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm">
                                  {courseGrade.course?.code || 'N/A'} - {courseGrade.course?.name || 'Unknown Course'}
                                </span>
                                <div className="flex space-x-2">
                                  <span className="text-sm text-gray-600">
                                    Marks: {courseGrade.marks || 'N/A'}
                                  </span>
                                  <span className={`text-sm font-medium ${
                                    courseGrade.grade === 'A' ? 'text-green-600' :
                                    courseGrade.grade === 'B' ? 'text-blue-600' :
                                    courseGrade.grade === 'C' ? 'text-yellow-600' :
                                    courseGrade.grade === 'D' ? 'text-orange-600' :
                                    courseGrade.grade === 'F' ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {courseGrade.grade || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Release Feedback Forms</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Faculty
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>All Faculty</option>
                    <option>Dr. Smith</option>
                    <option>Dr. Johnson</option>
                    <option>Dr. Williams</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course (Optional)
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>All Courses</option>
                    <option>Data Structures</option>
                    <option>Web Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Period
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="date" 
                      className="p-2 border border-gray-300 rounded-md"
                      placeholder="Start Date"
                    />
                    <input 
                      type="date" 
                      className="p-2 border border-gray-300 rounded-md"
                      placeholder="End Date"
                    />
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                  Release Feedback Forms
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Feedback Responses</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Responses</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {mockData.feedbackResponses}
                  </span>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Dr. Smith - Data Structures</h4>
                  <p className="text-sm text-gray-600 mb-2">45 responses received</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Teaching Quality</span>
                      <span className="text-green-600">4.2/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span className="text-green-600">4.0/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Overall Satisfaction</span>
                      <span className="text-green-600">4.1/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Send Global Announcement</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Announcement Title
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>All Students</option>
                    <option>All Faculty</option>
                    <option>Specific Department</option>
                    <option>Specific Course</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea 
                    rows="4" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your announcement message..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Form Link (Optional)
                  </label>
                  <input 
                    type="url" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="https://forms.google.com/..."
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                  Send Announcement
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Announcements</h3>
              <div className="space-y-4">
                {mockData.recentAnnouncements.map((announcement, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-3">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <p className="text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-sm text-gray-500 mt-2">{announcement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Auxia
                </span>
              </h1>
              <span className="text-gray-600">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
