import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClubDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'events', label: 'Events', icon: '🎉' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'announcements', label: 'Announcements', icon: '📢' }
  ];

  const mockData = {
    totalMembers: 45,
    totalEvents: 8,
    activeProjects: 3,
    pendingRequests: 5,
    recentEvents: [
      { name: 'Coding Workshop', type: 'open', date: '2024-10-15', attendees: 32 },
      { name: 'Team Building', type: 'members-only', date: '2024-10-20', attendees: 25 }
    ],
    projects: [
      { name: 'AI Chatbot', status: 'active', members: 8, requests: 3 },
      { name: 'Mobile App', status: 'active', members: 6, requests: 2 },
      { name: 'Web Platform', status: 'planning', members: 4, requests: 1 }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Members</h3>
                <p className="text-3xl font-bold text-blue-600">{mockData.totalMembers}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Total Events</h3>
                <p className="text-3xl font-bold text-green-600">{mockData.totalEvents}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Active Projects</h3>
                <p className="text-3xl font-bold text-purple-600">{mockData.activeProjects}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800">Pending Requests</h3>
                <p className="text-3xl font-bold text-orange-600">{mockData.pendingRequests}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Recent Events</h3>
                <div className="space-y-3">
                  {mockData.recentEvents.map((event, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.type === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.type === 'open' ? 'Open to All' : 'Members Only'}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{event.attendees} attendees</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Active Projects</h3>
                <div className="space-y-3">
                  {mockData.projects.filter(p => p.status === 'active').map((project, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium">{project.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{project.members} members</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {project.requests} requests
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Member Management</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Members
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Search by name or USN"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Department
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>All Departments</option>
                      <option>Computer Science</option>
                      <option>Information Science</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Name</option>
                      <option>Join Date</option>
                      <option>Department</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Current Members</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">John Doe</div>
                        <div className="text-sm text-gray-500">1MS21CS001</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Computer Science</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">2024-09-01</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                          Remove
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                        <div className="text-sm text-gray-500">1MS21CS002</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Computer Science</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">2024-09-05</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                          Remove
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Pending Join Requests</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Bob Johnson</h4>
                    <p className="text-sm text-gray-600">1MS21CS003 - Computer Science</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                      Approve
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter event name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Members Only</option>
                      <option>Open to All</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Attendees
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter max attendees"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Description
                  </label>
                  <textarea 
                    rows="3" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describe the event..."
                  ></textarea>
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-md">
                  Create Event
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {mockData.recentEvents.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-medium">{event.name}</h4>
                        <p className="text-gray-600">{event.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        event.type === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {event.type === 'open' ? 'Open to All' : 'Members Only'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">Expected attendees: {event.attendees}</p>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                        Edit Event
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
                        Cancel Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Status
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Planning</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Team Size
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter max team size"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Category
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Web Development</option>
                      <option>Mobile App</option>
                      <option>AI/ML</option>
                      <option>IoT</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea 
                    rows="4" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describe the project goals and requirements..."
                  ></textarea>
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-md">
                  Create Project
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Active Projects</h3>
              <div className="space-y-4">
                {mockData.projects.filter(p => p.status === 'active').map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-medium">{project.name}</h4>
                        <p className="text-gray-600">Team Size: {project.members}/10</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{project.requests} join requests</span>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                          Manage Team
                        </button>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm">
                          View Requests
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Project Requests</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">AI Chatbot Project</h4>
                  <p className="text-sm text-gray-600 mb-3">Request from: Alice Brown (1MS21CS004)</p>
                  <div className="flex space-x-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                      Approve
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
                      Reject
                    </button>
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
              <h3 className="text-xl font-semibold mb-4">Send Club Announcement</h3>
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
                    <option>All Members</option>
                    <option>Project Teams Only</option>
                    <option>Event Participants Only</option>
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
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                  Send Announcement
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Announcements</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-3">
                  <h4 className="font-medium">Coding Workshop Registration</h4>
                  <p className="text-gray-600 mt-1">Registration for the upcoming coding workshop is now open. Limited seats available!</p>
                  <p className="text-sm text-gray-500 mt-2">2024-10-10</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-3">
                  <h4 className="font-medium">Project Team Meeting</h4>
                  <p className="text-gray-600 mt-1">Weekly project team meeting scheduled for Friday at 3 PM in Room 301.</p>
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
              <span className="text-gray-600">Club Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'Club'}</span>
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
                    ? 'bg-orange-100 text-orange-700'
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

export default ClubDashboard;
