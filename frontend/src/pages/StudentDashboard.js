import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'grades', label: 'Grades', icon: '📝' },
    { id: 'clubs', label: 'Clubs', icon: '🎯' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'announcements', label: 'Announcements', icon: '📢' }
  ];

  const mockData = {
    courses: [
      { id: 1, name: 'Data Structures', code: 'CS201', type: 'core', faculty: 'Dr. Smith' },
      { id: 2, name: 'Web Development', code: 'CS301', type: 'elective', faculty: 'Dr. Johnson' }
    ],
    grades: [
      { course: 'Data Structures', marks: 85, grade: 'A' },
      { course: 'Web Development', marks: 92, grade: 'A+' }
    ],
    clubs: [
      { name: 'Coding Club', status: 'Member' },
      { name: 'Robotics Club', status: 'Pending' }
    ],
    announcements: [
      { title: 'Mid-semester break', content: 'College will be closed from 15th to 20th Oct', date: '2024-10-10' },
      { title: 'Placement drive', content: 'Tech companies visiting campus next week', date: '2024-10-08' }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Courses</h3>
                <p className="text-3xl font-bold text-blue-600">{mockData.courses.length}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">CGPA</h3>
                <p className="text-3xl font-bold text-green-600">8.5</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Clubs Joined</h3>
                <p className="text-3xl font-bold text-purple-600">{mockData.clubs.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Registered for Web Development elective</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Joined Coding Club</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Submitted feedback for Data Structures</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Core Courses</h3>
              <div className="space-y-3">
                {mockData.courses.filter(c => c.type === 'core').map(course => (
                  <div key={course.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-gray-600">Code: {course.code} | Faculty: {course.faculty}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Elective Courses</h3>
              <div className="space-y-3">
                {mockData.courses.filter(c => c.type === 'elective').map(course => (
                  <div key={course.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-gray-600">Code: {course.code} | Faculty: {course.faculty}</p>
                    <p className="text-sm text-green-600">Seats Available: 15</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'grades':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Current Semester Grades</h3>
            <div className="space-y-4">
              {mockData.grades.map((grade, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{grade.course}</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{grade.grade}</p>
                      <p className="text-sm text-gray-600">Marks: {grade.marks}/100</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Semester CGPA</h4>
              <p className="text-2xl font-bold text-green-600">8.5</p>
            </div>
          </div>
        );

      case 'clubs':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">My Clubs</h3>
              <div className="space-y-4">
                {mockData.clubs.map((club, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{club.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        club.status === 'Member' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {club.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Available Clubs</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Photography Club</h4>
                  <p className="text-sm text-gray-600 mb-3">Capture moments, learn techniques</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                    Request to Join
                  </button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Music Club</h4>
                  <p className="text-sm text-gray-600 mb-3">Express through music</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                    Request to Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Submit Feedback</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Faculty
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Dr. Smith - Data Structures</option>
                  <option>Dr. Johnson - Web Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea 
                  rows="4" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Share your experience and suggestions..."
                ></textarea>
              </div>
              <button className="bg-green-600 text-white px-6 py-2 rounded-md">
                Submit Feedback
              </button>
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Announcements</h3>
            <div className="space-y-4">
              {mockData.announcements.map((announcement, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-3">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-sm text-gray-500 mt-2">{announcement.date}</p>
                </div>
              ))}
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
              <span className="text-gray-600">Student Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'Student'}</span>
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
                    ? 'bg-blue-100 text-blue-700'
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

export default StudentDashboard;
