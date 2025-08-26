import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      switch (role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'faculty':
          navigate('/faculty/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'club':
          navigate('/club/dashboard');
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, role, navigate]);

  const tabs = [
    { id: 'student', label: 'Student', icon: '🎓', color: 'bg-blue-500' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫', color: 'bg-green-500' },
    { id: 'admin', label: 'Admin', icon: '⚙️', color: 'bg-purple-500' },
    { id: 'club', label: 'Club', icon: '🎯', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Auxia
                </span>
              </h1>
              <span className="ml-3 text-lg text-gray-600">College Management System</span>
            </div>
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Auxia
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive college management system designed to streamline academic operations, 
            enhance student-faculty collaboration, and provide seamless administrative control.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${tab.color} rounded-xl p-6 text-white text-center transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <div className="text-4xl mb-4">{tab.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{tab.label}</h3>
              <p className="text-sm opacity-90">
                {tab.id === 'student' && 'Access courses, grades, and clubs'}
                {tab.id === 'faculty' && 'Manage courses and student progress'}
                {tab.id === 'admin' && 'Oversee system operations and users'}
                {tab.id === 'club' && 'Organize events and manage projects'}
              </p>
            </div>
          ))}
        </div>

        {/* Login Portal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Access Your Dashboard
          </h3>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="text-center">
            {activeTab === 'student' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Student Portal Features
                </h4>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>• Course Registration & Management</li>
                  <li>• Gradesheet Access</li>
                  <li>• Club Participation</li>
                  <li>• Faculty Feedback</li>
                  <li>• Announcements & Updates</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'faculty' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Faculty Portal Features
                </h4>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>• Course Management</li>
                  <li>• Student Progress Tracking</li>
                  <li>• Marks Upload & Management</li>
                  <li>• Resource Sharing</li>
                  <li>• Student Announcements</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'admin' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Admin Portal Features
                </h4>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>• User Management</li>
                  <li>• Course Allocation</li>
                  <li>• Gradesheet Generation</li>
                  <li>• Feedback System Management</li>
                  <li>• Global Announcements</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'club' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Club Portal Features
                </h4>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>• Member Management</li>
                  <li>• Event Organization</li>
                  <li>• Project Management</li>
                  <li>• Club Announcements</li>
                  <li>• Student Engagement</li>
                </ul>
              </div>
            )}

            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>&copy; 2024 Auxia College Management System. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
