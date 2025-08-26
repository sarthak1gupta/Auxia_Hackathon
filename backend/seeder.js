const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');

// Import models
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Admin = require('./models/Admin');
const Club = require('./models/Club');
const Course = require('./models/Course');
const Gradesheet = require('./models/Gradesheet');
const Feedback = require('./models/Feedback');
const Announcement = require('./models/Announcement');
const Event = require('./models/Event');
const Project = require('./models/Project');

// Sample data
const sampleData = {
  students: [
    {
      name: 'John Doe',
      usn: '1CS22CS001',
      semester: 3,
      collegeEmail: 'john.doe@auxia.edu',
      personalEmail: 'john.doe@gmail.com',
      phone: '9876543210',
      department: 'Computer Science',
      cgpa: 8.5,
      interests: ['Web Development', 'Machine Learning', 'Data Science']
    },
    {
      name: 'Jane Smith',
      usn: '1CS22CS002',
      semester: 3,
      collegeEmail: 'jane.smith@auxia.edu',
      personalEmail: 'jane.smith@gmail.com',
      phone: '9876543211',
      department: 'Computer Science',
      cgpa: 9.2,
      interests: ['Artificial Intelligence', 'Robotics', 'Computer Vision']
    },
    {
      name: 'Mike Johnson',
      usn: '1EC22EC001',
      semester: 5,
      collegeEmail: 'mike.johnson@auxia.edu',
      personalEmail: 'mike.johnson@gmail.com',
      phone: '9876543212',
      department: 'Electronics',
      cgpa: 8.8,
      interests: ['Embedded Systems', 'IoT', 'Signal Processing']
    }
  ],
  
  faculty: [
    {
      name: 'Dr. Sarah Wilson',
      facultyId: 'FAC001',
      email: 'sarah.wilson@auxia.edu',
      phone: '9876543220',
      department: 'Computer Science',
      areasOfExpertise: ['Machine Learning', 'Data Mining', 'Statistics']
    },
    {
      name: 'Prof. Robert Chen',
      facultyId: 'FAC002',
      email: 'robert.chen@auxia.edu',
      phone: '9876543221',
      department: 'Computer Science',
      areasOfExpertise: ['Web Development', 'Database Systems', 'Software Engineering']
    },
    {
      name: 'Dr. Emily Brown',
      facultyId: 'FAC003',
      email: 'emily.brown@auxia.edu',
      phone: '9876543222',
      department: 'Electronics',
      areasOfExpertise: ['Digital Electronics', 'Microprocessors', 'VLSI Design']
    }
  ],
  
  admins: [
    {
      name: 'Admin User',
      adminId: 'ADM001',
      email: 'admin@auxia.edu',
      phone: '9876543300'
    }
  ],
  
  clubs: [
    {
      name: 'Tech Club',
      description: 'A club for technology enthusiasts to collaborate on projects and learn new skills.'
    },
    {
      name: 'Coding Club',
      description: 'Focused on programming competitions, hackathons, and coding challenges.'
    },
    {
      name: 'Robotics Club',
      description: 'Building robots, participating in competitions, and learning automation.'
    }
  ],
  
  courses: [
    {
      code: 'CS301',
      name: 'Data Structures and Algorithms',
      department: 'Computer Science',
      type: 'core',
      seatLimit: 60,
      seatsFilled: 45,
      semester: 3
    },
    {
      code: 'CS302',
      name: 'Database Management Systems',
      department: 'Computer Science',
      type: 'core',
      seatLimit: 60,
      seatsFilled: 42,
      semester: 3
    },
    {
      code: 'CS303',
      name: 'Machine Learning',
      department: 'Computer Science',
      type: 'elective',
      seatLimit: 40,
      seatsFilled: 35,
      semester: 5
    },
    {
      code: 'CS304',
      name: 'Web Development',
      department: 'Computer Science',
      type: 'elective',
      seatLimit: 35,
      seatsFilled: 28,
      semester: 5
    },
    {
      code: 'EC301',
      name: 'Digital Electronics',
      department: 'Electronics',
      type: 'core',
      seatLimit: 50,
      seatsFilled: 38,
      semester: 5
    }
  ],
  
  announcements: [
    {
      title: 'Welcome to New Semester',
      description: 'Welcome back students! We hope you had a great break. New semester starts from tomorrow.',
      createdBy: 'Admin',
      targetAudience: 'All'
    },
    {
      title: 'Hackathon Registration Open',
      description: 'Annual coding hackathon registration is now open. Register your teams by next Friday.',
      createdBy: 'Club',
      targetAudience: 'Students'
    },
    {
      title: 'Faculty Meeting',
      description: 'All faculty members are requested to attend the monthly meeting this Friday at 3 PM.',
      createdBy: 'Admin',
      targetAudience: 'All'
    }
  ]
};

// Hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Admin.deleteMany({});
    await Club.deleteMany({});
    await Course.deleteMany({});
    await Gradesheet.deleteMany({});
    await Feedback.deleteMany({});
    await Announcement.deleteMany({});
    await Event.deleteMany({});
    await Project.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create students
    const studentPasswords = await Promise.all(
      sampleData.students.map(() => hashPassword('student123'))
    );
    
    const students = await Student.create(
      sampleData.students.map((student, index) => ({
        ...student,
        password: studentPasswords[index]
      }))
    );
    console.log(`👥 Created ${students.length} students`);
    
    // Create faculty
    const facultyPasswords = await Promise.all(
      sampleData.faculty.map(() => hashPassword('faculty123'))
    );
    
    const faculty = await Faculty.create(
      sampleData.faculty.map((fac, index) => ({
        ...fac,
        password: facultyPasswords[index]
      }))
    );
    console.log(`👨‍🏫 Created ${faculty.length} faculty`);
    
    // Create admin
    const adminPassword = await hashPassword('admin123');
    const admin = await Admin.create({
      ...sampleData.admins[0],
      password: adminPassword
    });
    console.log(`👨‍💼 Created admin user`);
    
    // Create clubs
    const clubPasswords = await Promise.all(
      sampleData.clubs.map(() => hashPassword('club123'))
    );
    
    const clubs = await Club.create(
      sampleData.clubs.map((club, index) => ({
        ...club,
        password: clubPasswords[index]
      }))
    );
    console.log(`🎯 Created ${clubs.length} clubs`);
    
    // Create courses with faculty allocation
    const courses = await Course.create(
      sampleData.courses.map((course, index) => ({
        ...course,
        faculty: [faculty[index % faculty.length]._id]
      }))
    );
    console.log(`📚 Created ${courses.length} courses`);
    
    // Update faculty with allocated courses
    for (let i = 0; i < faculty.length; i++) {
      const courseIds = courses
        .filter((_, index) => index % faculty.length === i)
        .map(course => course._id);
      
      await Faculty.findByIdAndUpdate(faculty[i]._id, {
        coursesAllocated: courseIds
      });
    }
    
    // Assign core courses to students
    for (const student of students) {
      const coreCourses = courses.filter(course => 
        course.type === 'core' && course.department === student.department
      );
      
      await Student.findByIdAndUpdate(student._id, {
        coreCourses: coreCourses.map(course => course._id)
      });
    }
    
    // Create announcements
    const announcements = await Announcement.create(
      sampleData.announcements.map(announcement => ({
        ...announcement,
        club: announcement.createdBy === 'Club' ? clubs[0]._id : undefined
      }))
    );
    console.log(`📢 Created ${announcements.length} announcements`);
    
    // Create sample events
    const events = await Event.create([
      {
        club: clubs[0]._id,
        name: 'Tech Talk: AI in 2024',
        description: 'Join us for an exciting talk on the latest developments in AI',
        type: 'open',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        club: clubs[1]._id,
        name: 'Coding Competition',
        description: 'Monthly coding competition for all students',
        type: 'open',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      }
    ]);
    console.log(`🎉 Created ${events.length} events`);
    
    // Create sample projects
    const projects = await Project.create([
      {
        club: clubs[0]._id,
        name: 'Smart Attendance System',
        description: 'AI-powered attendance system using facial recognition',
        active: true
      },
      {
        club: clubs[2]._id,
        name: 'Line Following Robot',
        description: 'Autonomous robot that follows lines and avoids obstacles',
        active: true
      }
    ]);
    console.log(`🚀 Created ${projects.length} projects`);
    
    // Update clubs with events and projects
    await Club.findByIdAndUpdate(clubs[0]._id, {
      events: [events[0]._id],
      projects: [projects[0]._id]
    });
    
    await Club.findByIdAndUpdate(clubs[1]._id, {
      events: [events[1]._id]
    });
    
    await Club.findByIdAndUpdate(clubs[2]._id, {
      projects: [projects[1]._id]
    });
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Data Summary:');
    console.log(`   Students: ${students.length}`);
    console.log(`   Faculty: ${faculty.length}`);
    console.log(`   Admin: 1`);
    console.log(`   Clubs: ${clubs.length}`);
    console.log(`   Courses: ${courses.length}`);
    console.log(`   Announcements: ${announcements.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   Projects: ${projects.length}`);
    
    console.log('\n🔑 Default Passwords:');
    console.log('   Students: student123');
    console.log('   Faculty: faculty123');
    console.log('   Admin: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Connect to database and run seeder
const runSeeder = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');
    await seedDatabase();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedDatabase };
