const Club = require('../models/Club');
const Student = require('../models/Student');
const Event = require('../models/Event');
const Project = require('../models/Project');
const Announcement = require('../models/Announcement');

// Get club profile
const getProfile = async (req, res) => {
  try {
    const club = await Club.findById(req.user._id)
      .populate('members', 'name usn semester')
      .populate('events', 'name description type date')
      .populate('projects', 'name description active');
    
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update club profile
const updateProfile = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const club = await Club.findByIdAndUpdate(
      req.user._id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get club members
const getMembers = async (req, res) => {
  try {
    const club = await Club.findById(req.user._id)
      .populate('members', 'name usn semester department collegeEmail');
    
    res.json(club.members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add member to club
const addMember = async (req, res) => {
  try {
    const { studentId } = req.body;
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if already a member
    const club = await Club.findById(req.user._id);
    if (club.members.includes(studentId)) {
      return res.status(400).json({ message: 'Student is already a member' });
    }
    
    // Add to club members
    await Club.findByIdAndUpdate(req.user._id, {
      $push: { members: studentId }
    });
    
    // Update student's clubs
    await Student.findByIdAndUpdate(studentId, {
      $push: { clubsJoined: req.user._id }
    });
    
    res.json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove member from club
const removeMember = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Remove from club members
    await Club.findByIdAndUpdate(req.user._id, {
      $pull: { members: studentId }
    });
    
    // Update student's clubs
    await Student.findByIdAndUpdate(studentId, {
      $pull: { clubsJoined: req.user._id }
    });
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const { name, description, type, date } = req.body;
    
    const event = new Event({
      club: req.user._id,
      name,
      description,
      type,
      date
    });
    
    await event.save();
    
    // Add event to club
    await Club.findByIdAndUpdate(req.user._id, {
      $push: { events: event._id }
    });
    
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get club events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ club: req.user._id })
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description, type, date } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event belongs to this club
    if (event.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { name, description, type, date },
      { new: true, runValidators: true }
    );
    
    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event belongs to this club
    if (event.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    await Event.findByIdAndDelete(eventId);
    
    // Remove from club events
    await Club.findByIdAndUpdate(req.user._id, {
      $pull: { events: eventId }
    });
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const project = new Project({
      club: req.user._id,
      name,
      description,
      active: true
    });
    
    await project.save();
    
    // Add project to club
    await Club.findByIdAndUpdate(req.user._id, {
      $push: { projects: project._id }
    });
    
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get club projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ club: req.user._id })
      .populate('members', 'name usn')
      .populate('requests', 'name usn');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, active } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project belongs to this club
    if (project.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, description, active },
      { new: true, runValidators: true }
    );
    
    res.json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project belongs to this club
    if (project.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await Project.findByIdAndDelete(projectId);
    
    // Remove from club projects
    await Club.findByIdAndUpdate(req.user._id, {
      $pull: { projects: projectId }
    });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add member to project
const addProjectMember = async (req, res) => {
  try {
    const { projectId, studentId } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project belongs to this club
    if (project.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }
    
    // Check if student is a club member
    const club = await Club.findById(req.user._id);
    if (!club.members.includes(studentId)) {
      return res.status(400).json({ message: 'Student is not a club member' });
    }
    
    // Check if already a project member
    if (project.members.includes(studentId)) {
      return res.status(400).json({ message: 'Student is already a project member' });
    }
    
    // Remove from requests if exists
    await Project.findByIdAndUpdate(projectId, {
      $pull: { requests: studentId }
    });
    
    // Add to members
    await Project.findByIdAndUpdate(projectId, {
      $push: { members: studentId }
    });
    
    res.json({ message: 'Member added to project successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove member from project
const removeProjectMember = async (req, res) => {
  try {
    const { projectId, studentId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project belongs to this club
    if (project.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }
    
    await Project.findByIdAndUpdate(projectId, {
      $pull: { members: studentId }
    });
    
    res.json({ message: 'Member removed from project successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get project requests
const getProjectRequests = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('requests', 'name usn semester department');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project belongs to this club
    if (project.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }
    
    res.json(project.requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create club announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const announcement = new Announcement({
      title,
      description,
      createdBy: 'Club',
      targetAudience: 'Club',
      club: req.user._id
    });
    
    await announcement.save();
    
    res.json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get club announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      club: req.user._id,
      createdBy: 'Club'
    }).sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMembers,
  addMember,
  removeMember,
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectRequests,
  createAnnouncement,
  getAnnouncements
};
