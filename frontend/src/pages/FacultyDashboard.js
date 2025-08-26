import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
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
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'marks', label: 'Marks', icon: '📝' },
    { id: 'resources', label: 'Resources', icon: '📁' },
    { id: 'announcements', label: 'Announcements', icon: '📢' }
  ];

  const mockData = {
    courses: [
      { id: 1, name: 'Data Structures', code: 'CS201', students: 45, type: 'core' },
      { id: 2, name: 'Web Development', code: 'CS301', students: 32, type: 'elective' }
    ],
    students: [
      { id: 1, name: 'John Doe', usn: '1MS21CS001', marks: 85 },
      { id: 2, name: 'Jane Smith', usn: '1MS21CS002', marks: 92 },
      { id: 3, name: 'Bob Johnson', usn: '1MS21CS003', marks: 78 }
    ],
    resources: [
      { name: 'Data Structures Notes.pdf', type: 'PDF', uploaded: '2024-10-01' },
      { name: 'Web Development PPT.pptx', type: 'PPT', uploaded: '2024-10-05' }
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
                <h3 className="text-lg font-semibold text-green-800">Total Students</h3>
                <p className="text-3xl font-bold text-green-600">77</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Resources</h3>
                <p className="text-3xl font-bold text-purple-600">{mockData.resources.length}</p>
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
            {mockData.courses.map(course => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{course.name}</h3>
                    <p className="text-gray-600">Code: {course.code} | Type: {course.type}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {course.students} Students
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{course.students}</p>
                    <p className="text-sm text-gray-600">Enrolled</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">85%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">8.2</p>
                    <p className="text-sm text-gray-600">Avg Grade</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'students':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Student List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      USN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockData.students.map(student => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.usn}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.marks}/100</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Update Marks
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'marks':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Update Student Marks</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Data Structures</option>
                    <option>Web Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>John Doe (1MS21CS001)</option>
                    <option>Jane Smith (1MS21CS002)</option>
                    <option>Bob Johnson (1MS21CS003)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks (out of 100)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter marks"
                  />
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-md">
                  Update Marks
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Bulk Upload Marks</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input 
                    type="file" 
                    accept=".csv"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                  Upload and Process
                </button>
              </div>
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
                    <option>Data Structures</option>
                    <option>Web Development</option>
                  </select>
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
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-md">
                  Upload Resource
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">My Resources</h3>
              <div className="space-y-4">
                {mockData.resources.map((resource, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-gray-600">Type: {resource.type} | Uploaded: {resource.uploaded}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Download
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Send Announcement</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>All Courses</option>
                    <option>Data Structures</option>
                    <option>Web Development</option>
                  </select>
                </div>
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
                    Message
                  </label>
                  <textarea 
                    rows="4" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your announcement message..."
                  ></textarea>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                  Send Announcement
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Announcements</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-3">
                  <h4 className="font-medium">Class Cancellation</h4>
                  <p className="text-gray-600 mt-1">Web Development class on Friday is cancelled due to faculty meeting.</p>
                  <p className="text-sm text-gray-500 mt-2">2024-10-10</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-3">
                  <h4 className="font-medium">Assignment Deadline</h4>
                  <p className="text-gray-600 mt-1">Data Structures assignment submission deadline extended to next Monday.</p>
                  <p className="text-sm text-gray-500 mt-2">2024-10-08</p>
                </div>
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
                    ? 'bg-green-100 text-green-700'
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
