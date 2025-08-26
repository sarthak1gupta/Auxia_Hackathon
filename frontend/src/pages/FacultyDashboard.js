import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { facultyAPI } from '../services/api';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for real data
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [resources, setResources] = useState([]);

  // Fetch faculty's allocated courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await facultyAPI.getAllocatedCourses();
        if (response.data) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    if (activeTab === 'courses' || activeTab === 'marks') {
      fetchCourses();
    }
  }, [activeTab]);

  // Fetch students when course is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) {
        setStudents([]);
        return;
      }

      try {
        const response = await facultyAPI.getCourseStudents(selectedCourse);
        if (response.data && response.data.students) {
          setStudents(response.data.students);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (activeTab === 'marks') {
      fetchStudents();
    }
  }, [selectedCourse, activeTab]);

  // Handle marks update
  const handleUpdateMarks = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse || !selectedStudent || !marks) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (marks < 0 || marks > 100) {
      setMessage({ type: 'error', text: 'Marks must be between 0 and 100' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await facultyAPI.uploadMarks({
        courseId: selectedCourse,
        studentId: selectedStudent,
        marks: parseInt(marks),
        semester: 1 // Default semester, can be made dynamic
      });

      if (response.data.message === 'Marks uploaded successfully') {
        setMessage({ type: 'success', text: 'Marks updated successfully!' });
        setMarks('');
        setSelectedStudent('');
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update marks' });
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'An error occurred while updating marks' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk marks upload
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      setMessage({ type: 'error', text: 'Please select a course first' });
      return;
    }

    const fileInput = document.getElementById('csvFile');
    if (!fileInput.files[0]) {
      setMessage({ type: 'error', text: 'Please select a CSV file' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('courseId', selectedCourse);
      formData.append('file', fileInput.files[0]);

      const response = await facultyAPI.bulkUploadMarks(formData);
      
      if (response.data.message) {
        setMessage({ type: 'success', text: 'Bulk marks uploaded successfully!' });
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error uploading bulk marks:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'An error occurred while uploading marks' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'marks', label: 'Marks', icon: '📝' },
    { id: 'resources', label: 'Resources', icon: '📁' },
    { id: 'announcements', label: 'Announcements', icon: '📢' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Courses</h3>
                <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Total Students</h3>
                <p className="text-3xl font-bold text-green-600">
                  {courses.reduce((total, course) => total + (course.students?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Resources</h3>
                <p className="text-3xl font-bold text-purple-600">{resources.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Uploaded Web Development PPT</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Updated marks for Data Structures</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Sent announcement to Web Development class</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            {courses.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">No courses allocated yet.</p>
              </div>
            ) : (
              courses.map(course => (
                <div key={course._id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{course.name}</h3>
                      <p className="text-gray-600">Code: {course.code} | Type: {course.type}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {course.students?.length || 0} Students
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{course.students?.length || 0}</p>
                      <p className="text-sm text-gray-600">Enrolled</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{course.seatLimit || 0}</p>
                      <p className="text-sm text-gray-600">Seat Limit</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{course.semester || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Semester</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'students':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Course Students</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedCourse && students.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          USN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.usn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.collegeEmail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {selectedCourse && students.length === 0 && (
                <p className="text-gray-500 text-center py-4">No students enrolled in this course.</p>
              )}
            </div>
          </div>
        );

      case 'marks':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Update Student Marks</h3>
              <form onSubmit={handleUpdateMarks} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedCourse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Student
                    </label>
                    <select 
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a student</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} ({student.usn})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks (out of 100)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter marks"
                    required
                  />
                </div>
                
                {message && (
                  <div className={`p-3 rounded-md ${
                    message.type === 'success' 
                      ? 'bg-green-100 border border-green-400 text-green-700' 
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    {message.text}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading || !selectedCourse || !selectedStudent || !marks}
                  className={`px-6 py-2 rounded-md text-white ${
                    loading || !selectedCourse || !selectedStudent || !marks
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Updating...' : 'Update Marks'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Bulk Upload Marks</h3>
              <form onSubmit={handleBulkUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input 
                    id="csvFile"
                    type="file" 
                    accept=".csv"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    CSV format: studentId,marks (e.g., 1MS21CS001,85)
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || !selectedCourse}
                  className={`px-6 py-2 rounded-md text-white ${
                    loading || !selectedCourse
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Uploading...' : 'Upload and Process'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Upload New Resource</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Title
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter resource title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea 
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter resource description"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <input 
                    type="file" 
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, PPT, PPTX, DOC, DOCX
                  </p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Upload Resource
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Uploaded Resources</h3>
              {resources.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No resources uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-gray-600">{resource.type} • {resource.uploaded}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Send Course Announcement</h3>
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
                    Select Course
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
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
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Send Announcement
                </button>
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
              <span className="text-gray-600">Faculty Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'Faculty'}</span>
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

export default FacultyDashboard;
