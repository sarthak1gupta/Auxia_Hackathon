# 🎓 Auxia College Management System

A comprehensive full-stack college management system built with React.js, Node.js, Express, and MongoDB Atlas.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Student, Faculty, Admin, Club)
- Secure password hashing with bcrypt
- Protected routes for each user type

### 🧑‍🎓 Student Module
- **Profile Management**: View and update personal information
- **Course Registration**: Auto-registered for core courses, manual registration for electives
- **Real-time Seat Availability**: See available seats for elective courses
- **Gradesheet**: View released gradesheets with course-wise marks and grades
- **Club Management**: Browse clubs, request to join, participate in projects
- **Feedback System**: Submit anonymous feedback for faculty
- **Announcements**: View relevant announcements from admin, faculty, and clubs

### 👨‍🏫 Faculty Module
- **Profile Management**: Update personal information and expertise areas
- **Course Management**: View allocated courses and enrolled students
- **Marks Management**: Upload and update student marks with automatic grade calculation
- **Resource Upload**: Share course materials (PDF, PPT, DOC) with students
- **Announcements**: Create course-specific announcements for enrolled students

### 🛠️ Admin Module
- **Course Management**: Create, update, and delete courses with faculty allocation
- **Faculty Allocation**: Assign faculty to courses (max 3 courses per faculty)
- **Student Management**: View all student profiles and course enrollments
- **Gradesheet Management**: Generate and release gradesheets to students
- **Feedback Analytics**: View feedback statistics and trends
- **Global Announcements**: Create announcements for all users or specific audiences

### 🎯 Club Module
- **Member Management**: Add/remove club members
- **Event Management**: Create and manage club events (members-only or open)
- **Project Management**: Create projects and manage team members
- **Announcements**: Club-specific announcements for members

## 🚀 Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks and functional components
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **React Context API** - State management for authentication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database service
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
auxia/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication & authorization
│   ├── uploads/         # File storage
│   ├── config.js        # Configuration
│   ├── server.js        # Main server file
│   ├── seeder.js        # Database seeder
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   ├── public/          # Static files
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd auxia
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file (or update config.js)
# Replace <db_password> with your actual MongoDB password
echo "MONGODB_URI=mongodb+srv://hgupta2505:<db_password>@cluster0.runupqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" > .env
echo "JWT_SECRET=your_super_secret_jwt_key_here" >> .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Database Seeding (Optional)
```bash
cd backend

# Seed the database with sample data
npm run seed
```

## 🔑 Default Login Credentials

After running the seeder, you can use these credentials:

### Student Login
- **Email**: `john.doe@auxia.edu`
- **Password**: `student123`
- **USN**: `1CS22CS001`

### Faculty Login
- **Email**: `sarah.wilson@auxia.edu`
- **Password**: `faculty123`
- **Faculty ID**: `FAC001`

### Admin Login
- **Email**: `admin@auxia.edu`
- **Password**: `admin123`
- **Admin ID**: `ADM001`

### Club Login
- **Email**: `club@auxia.edu`
- **Password**: `club123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/faculty/signup` - Faculty registration
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/club/signup` - Club registration
- `POST /api/auth/login` - Universal login

### Student Routes
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/courses/elective` - Get available elective courses
- `POST /api/student/courses/register` - Register for elective course
- `DELETE /api/student/courses/drop` - Drop elective course
- `GET /api/student/gradesheet` - Get gradesheet
- `GET /api/student/clubs` - Get available clubs
- `POST /api/student/clubs/join` - Join club
- `POST /api/student/feedback` - Submit feedback
- `GET /api/student/announcements` - Get announcements

### Faculty Routes
- `GET /api/faculty/profile` - Get faculty profile
- `PUT /api/faculty/profile` - Update faculty profile
- `GET /api/faculty/courses` - Get allocated courses
- `GET /api/faculty/courses/:courseId/students` - Get course students
- `POST /api/faculty/courses/marks` - Upload student marks
- `POST /api/faculty/courses/resource` - Upload course resource
- `POST /api/faculty/courses/:courseId/announcements` - Create course announcement
- `GET /api/faculty/courses/:courseId/announcements` - Get course announcements

### Admin Routes
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile
- `POST /api/admin/courses` - Create course
- `GET /api/admin/courses` - Get all courses
- `PUT /api/admin/courses/:courseId` - Update course
- `DELETE /api/admin/courses/:courseId` - Delete course
- `GET /api/admin/faculty` - Get all faculty
- `GET /api/admin/students` - Get all students
- `POST /api/admin/gradesheets/generate` - Generate gradesheet
- `PUT /api/admin/gradesheets/:gradesheetId/release` - Release gradesheet
- `GET /api/admin/gradesheets` - Get all gradesheets
- `GET /api/admin/feedback/stats` - Get feedback statistics
- `POST /api/admin/announcements` - Create global announcement
- `GET /api/admin/announcements` - Get all announcements
- `DELETE /api/admin/announcements/:announcementId` - Delete announcement

### Club Routes
- `GET /api/club/profile` - Get club profile
- `PUT /api/club/profile` - Update club profile
- `GET /api/club/members` - Get club members
- `POST /api/club/members` - Add member
- `DELETE /api/club/members/:studentId` - Remove member
- `POST /api/club/events` - Create event
- `GET /api/club/events` - Get club events
- `PUT /api/club/events/:eventId` - Update event
- `DELETE /api/club/events/:eventId` - Delete event
- `POST /api/club/projects` - Create project
- `GET /api/club/projects` - Get club projects
- `PUT /api/club/projects/:projectId` - Update project
- `DELETE /api/club/projects/:projectId` - Delete project
- `POST /api/club/projects/:projectId/members` - Add project member
- `DELETE /api/club/projects/:projectId/members/:studentId` - Remove project member
- `GET /api/club/projects/:projectId/requests` - Get project requests
- `POST /api/club/announcements` - Create club announcement
- `GET /api/club/announcements` - Get club announcements

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt for password security
- **Role-based Access Control**: Different permissions for each user role
- **Input Validation**: Comprehensive regex validation for all inputs
- **CORS Protection**: Cross-origin resource sharing configuration
- **File Upload Security**: File type and size validation

## 📱 UI/UX Features

- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Modern Interface**: Clean, intuitive user interface
- **Role-based Dashboards**: Customized dashboards for each user type
- **Real-time Updates**: Live data updates for course availability
- **File Management**: Easy file upload and download system
- **Search & Filter**: Advanced search and filtering capabilities

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables in production
2. Use PM2 or similar process manager
3. Configure MongoDB Atlas production cluster
4. Set up proper CORS for production domain

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update API base URL for production

## 📊 Database Schema

The system uses MongoDB with Mongoose ODM. Key schemas include:

- **Student**: Personal info, courses, clubs, grades
- **Faculty**: Profile, allocated courses, expertise
- **Admin**: System administration capabilities
- **Club**: Member management, events, projects
- **Course**: Course details, faculty, students, seats
- **Gradesheet**: Student performance records
- **Feedback**: Anonymous faculty feedback
- **Announcement**: System-wide communications
- **Event**: Club events and activities
- **Project**: Club project management

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### File Upload Configuration
- Supported formats: PDF, PPT, PPTX, DOC, DOCX
- Upload directory: `backend/uploads/`
- File size limits configurable in multer settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments

## 🚀 Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed reporting and analytics dashboard
- **Integration APIs**: Third-party service integrations
- **Multi-language Support**: Internationalization support
- **Advanced Security**: Two-factor authentication, rate limiting
- **Performance Optimization**: Caching, database indexing
- **Automated Testing**: Comprehensive test suite with CI/CD

---

**Auxia College Management System** - Empowering educational institutions with modern technology solutions.
