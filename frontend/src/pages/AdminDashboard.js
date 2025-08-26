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
    semester: ''
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., CS201"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Computer Science</option>
                    <option>Information Science</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Core</option>
                    <option>Elective</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seat Limit
                  </label>
                  <input 
                    type="number" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter seat limit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md">
                Add Course
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Course Allocation</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Data Structures (CS201)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allocate Faculty
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Dr. Smith</option>
                        <option>Dr. Johnson</option>
                        <option>Dr. Williams</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seat Limit
                      </label>
                      <input 
                        type="number" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="50"
                      />
                    </div>
                  </div>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                    Update Allocation
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'gradesheets':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Generate Gradesheets</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Semester
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Department
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Computer Science</option>
                    <option>Information Science</option>
                    <option>Electronics</option>
                  </select>
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-md">
                  Generate Gradesheets
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Pending Reviews</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">John Doe - CS201</h4>
                    <p className="text-sm text-gray-600">Data Structures | Semester 3</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Review
                    </button>
                    <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                      Approve
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Jane Smith - CS301</h4>
                    <p className="text-sm text-gray-600">Web Development | Semester 5</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Review
                    </button>
                    <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                      Approve
                    </button>
                  </div>
                </div>
              </div>
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
