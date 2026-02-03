# School Management System

A comprehensive full-stack School Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). Designed for efficient management of students, teachers, courses, attendance, and grades with role-based access control.

## 🚀 Features

### Admin Features
- User management (create/update students, teachers, admins)
- Course creation and management
- Student enrollment management
- View all attendance records and reports
- Grade management oversight
- System-wide announcements
- Comprehensive reporting and analytics

### Teacher Features
- View assigned courses and enrolled students
- Mark and manage attendance
- Create and publish grades
- View student performance analytics
- Create announcements for students
- Manage course schedules

### Student Features
- View enrolled courses
- Check attendance records
- View grades and transcripts
- Access course materials
- View announcements and notifications
- Personal profile management

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **date-fns** - Date manipulation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager
- Git (for version control)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd school-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Configure your .env file:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:5173
```

**Start MongoDB:**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Run the backend server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Configure your .env file:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Run the frontend development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🗄️ Database Setup

### Create Default Admin User

After starting the backend, you can create a default admin user through the MongoDB shell or a database client:

```javascript
use school_management

db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@school.com",
  password: "$2a$10$5Q8xKZ9kZxKxKxKxKxKxKe...", // Hashed: Admin@123
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the seed script (create this file):

```bash
# Create seed file
node backend/scripts/seed.js
```

## 🎯 Usage

### Login Credentials (Demo)

**Admin:**
- Email: `admin@school.com`
- Password: `Admin@123`

**Teacher:**
- Email: `teacher@school.com`
- Password: `Teacher@123`

**Student:**
- Email: `student@school.com`
- Password: `Student@123`

### First Steps

1. **Login** as admin using the credentials above
2. **Create Users**: Navigate to Students/Teachers section to add new users
3. **Create Courses**: Add courses with schedules and assign teachers
4. **Enroll Students**: Assign students to courses
5. **Mark Attendance**: Teachers can mark attendance for their courses
6. **Manage Grades**: Teachers can create and publish grades

## 📁 Project Structure

```
school-management-system/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── .env.example     # Environment variables template
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── .env.example     # Environment variables template
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
│
├── PROJECT_DOCUMENTATION.md  # Complete project documentation
└── README.md                 # This file
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Granular permissions by user role
- **Input Validation**: Server-side validation using express-validator
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet.js**: Security headers

## 📊 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Key Endpoints

**Authentication:**
- POST `/auth/register` - Register new user (Admin only)
- POST `/auth/login` - User login
- GET `/auth/me` - Get current user
- PUT `/auth/change-password` - Change password

**Students:**
- GET `/students` - Get all students
- POST `/students` - Create student
- GET `/students/:id` - Get student by ID
- PUT `/students/:id` - Update student
- GET `/students/:id/courses` - Get student courses

**Teachers:**
- GET `/teachers` - Get all teachers
- POST `/teachers` - Create teacher
- GET `/teachers/:id` - Get teacher by ID
- PUT `/teachers/:id` - Update teacher
- GET `/teachers/:id/courses` - Get teacher courses

**Courses:**
- GET `/courses` - Get all courses
- POST `/courses` - Create course
- GET `/courses/:id` - Get course by ID
- PUT `/courses/:id` - Update course
- DELETE `/courses/:id` - Delete course

**Enrollments:**
- GET `/enrollments` - Get enrollments
- POST `/enrollments` - Create enrollment
- PUT `/enrollments/:id` - Update enrollment
- DELETE `/enrollments/:id` - Delete enrollment

**Attendance:**
- POST `/attendance` - Mark attendance
- GET `/attendance` - Get attendance records
- GET `/attendance/summary` - Get attendance summary

**Grades:**
- GET `/grades` - Get grades
- POST `/grades` - Create grade
- PUT `/grades/:id` - Update grade
- PUT `/grades/:id/publish` - Publish grade

**Announcements:**
- GET `/announcements` - Get announcements
- POST `/announcements` - Create announcement
- PUT `/announcements/:id` - Update announcement
- DELETE `/announcements/:id` - Delete announcement

**Reports:**
- GET `/reports/dashboard` - Get dashboard statistics

For complete API documentation, see `PROJECT_DOCUMENTATION.md`

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd backend
# Set NODE_ENV to production in .env
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

### Deployment Platforms

**Backend Options:**
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

**Frontend Options:**
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Database:**
- MongoDB Atlas (Recommended)
- Self-hosted MongoDB

### Environment Variables for Production

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=24h
CORS_ORIGIN=<your-frontend-url>
```

**Frontend (.env):**
```env
VITE_API_URL=<your-backend-api-url>
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Performance Optimization

- Database indexes on frequently queried fields
- Pagination for large datasets
- Connection pooling for database
- CDN for static assets
- Image optimization
- Code splitting in React

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern school management needs
- Built with best practices in mind

## 📞 Support

For support, email support@schoolms.com or open an issue in the repository.

## 🔄 Updates and Maintenance

This project is actively maintained. Check the releases page for updates.

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Known Issues

See the [Issues](../../issues) page for known bugs and feature requests.

## 🗺️ Roadmap

- [ ] Mobile application (React Native)
- [ ] Real-time notifications (Socket.io)
- [ ] Email notifications
- [ ] File upload for assignments
- [ ] Video conferencing integration
- [ ] Advanced analytics dashboard
- [ ] Parent portal
- [ ] Library management module
- [ ] Fee management module
- [ ] Automated timetable generation
