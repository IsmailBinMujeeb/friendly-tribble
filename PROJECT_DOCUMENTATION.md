# School Management System - Complete Documentation

## Project Overview

A full-stack School Management System built with the MERN stack designed for 500 students and 50 teachers. Features role-based access control with three user types: Administrators, Teachers, and Students.

## Technology Stack

### Backend
- **Node.js** (v18+): Runtime environment
- **Express.js** (v4.18+): Web application framework
- **MongoDB** (v6+): NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend
- **React** (v18+): UI library
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **Context API**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **date-fns**: Date manipulation
- **recharts**: Charts and graphs

## Database Schema

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['admin', 'teacher', 'student'], required),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  dateOfBirth: Date,
  profileImage: String (URL),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- email (unique)
- role
- isActive
```

### 2. Students Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  studentId: String (unique, auto-generated),
  enrollmentDate: Date (required),
  grade: String (required),
  section: String,
  parentName: String,
  parentEmail: String,
  parentPhone: String,
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalInfo: String,
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- userId (unique)
- studentId (unique)
- grade
- isActive
```

### 3. Teachers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  teacherId: String (unique, auto-generated),
  employeeId: String (unique),
  department: String (required),
  joiningDate: Date (required),
  qualification: String,
  specialization: String,
  experience: Number (years),
  subjects: [String],
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- userId (unique)
- teacherId (unique)
- department
- isActive
```

### 4. Courses Collection
```javascript
{
  _id: ObjectId,
  courseCode: String (unique, required),
  courseName: String (required),
  description: String,
  grade: String (required),
  department: String,
  credits: Number,
  teacherId: ObjectId (ref: 'Teacher', required),
  schedule: [{
    day: String (enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    startTime: String (HH:MM format),
    endTime: String (HH:MM format),
    room: String
  }],
  capacity: Number (default: 40),
  enrolledStudents: [ObjectId] (ref: 'Student'),
  academicYear: String (required),
  semester: String (enum: ['Spring', 'Fall', 'Summer']),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- courseCode (unique)
- teacherId
- grade
- academicYear
- isActive
```

### 5. Enrollments Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'Student', required),
  courseId: ObjectId (ref: 'Course', required),
  enrollmentDate: Date (default: Date.now),
  status: String (enum: ['enrolled', 'dropped', 'completed'], default: 'enrolled'),
  finalGrade: String,
  credits: Number,
  academicYear: String,
  semester: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- studentId
- courseId
- status
- Compound: (studentId, courseId) - unique
```

### 6. Attendance Collection
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: 'Course', required),
  studentId: ObjectId (ref: 'Student', required),
  date: Date (required),
  status: String (enum: ['present', 'absent', 'late', 'excused'], required),
  remarks: String,
  markedBy: ObjectId (ref: 'Teacher', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- courseId
- studentId
- date
- Compound: (courseId, studentId, date) - unique
```

### 7. Grades Collection
```javascript
{
  _id: ObjectId,
  enrollmentId: ObjectId (ref: 'Enrollment', required),
  studentId: ObjectId (ref: 'Student', required),
  courseId: ObjectId (ref: 'Course', required),
  assessments: [{
    name: String (required),
    type: String (enum: ['assignment', 'quiz', 'midterm', 'final', 'project', 'other']),
    maxMarks: Number (required),
    obtainedMarks: Number (required),
    weight: Number (percentage),
    date: Date,
    remarks: String
  }],
  totalMarks: Number (calculated),
  percentage: Number (calculated),
  letterGrade: String (calculated: A+, A, B+, B, C+, C, D, F),
  gpa: Number (calculated),
  teacherId: ObjectId (ref: 'Teacher', required),
  academicYear: String,
  semester: String,
  publishedDate: Date,
  isPublished: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- enrollmentId
- studentId
- courseId
- teacherId
- isPublished
```

### 8. Announcements Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  createdBy: ObjectId (ref: 'User', required),
  targetAudience: [String] (enum: ['all', 'students', 'teachers', 'admin']),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  expiryDate: Date,
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- targetAudience
- priority
- isActive
- expiryDate
```

## API Endpoints

### Authentication & Authorization

#### POST /api/auth/register
- **Description**: Register a new user
- **Access**: Admin only
- **Body**: 
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    "role": "admin|teacher|student",
    "phone": "string",
    "dateOfBirth": "date"
  }
  ```
- **Response**: User object + JWT token

#### POST /api/auth/login
- **Description**: User login
- **Access**: Public
- **Body**: 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object + JWT token

#### GET /api/auth/me
- **Description**: Get current user profile
- **Access**: Authenticated users
- **Response**: User object with role-specific data

#### PUT /api/auth/change-password
- **Description**: Change user password
- **Access**: Authenticated users
- **Body**: 
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```

### User Management

#### GET /api/users
- **Description**: Get all users (with filters)
- **Access**: Admin only
- **Query Params**: role, isActive, search, page, limit
- **Response**: Paginated user list

#### GET /api/users/:id
- **Description**: Get user by ID
- **Access**: Admin, or own profile
- **Response**: User object

#### PUT /api/users/:id
- **Description**: Update user
- **Access**: Admin, or own profile (limited fields)
- **Body**: User fields to update
- **Response**: Updated user object

#### DELETE /api/users/:id
- **Description**: Soft delete user (set isActive to false)
- **Access**: Admin only
- **Response**: Success message

### Student Management

#### POST /api/students
- **Description**: Create student profile (after user registration)
- **Access**: Admin only
- **Body**: 
  ```json
  {
    "userId": "objectId",
    "grade": "string",
    "section": "string",
    "enrollmentDate": "date",
    "parentName": "string",
    "parentEmail": "string",
    "parentPhone": "string"
  }
  ```

#### GET /api/students
- **Description**: Get all students (with filters)
- **Access**: Admin, Teacher
- **Query Params**: grade, section, isActive, search, page, limit

#### GET /api/students/:id
- **Description**: Get student by ID
- **Access**: Admin, Teacher, own profile

#### PUT /api/students/:id
- **Description**: Update student
- **Access**: Admin only

#### GET /api/students/:id/courses
- **Description**: Get courses enrolled by student
- **Access**: Admin, Teacher, own profile

#### GET /api/students/:id/attendance
- **Description**: Get attendance record
- **Access**: Admin, Teacher, own profile
- **Query Params**: courseId, startDate, endDate

#### GET /api/students/:id/grades
- **Description**: Get grades
- **Access**: Admin, Teacher, own profile
- **Query Params**: courseId, academicYear, semester

### Teacher Management

#### POST /api/teachers
- **Description**: Create teacher profile
- **Access**: Admin only

#### GET /api/teachers
- **Description**: Get all teachers
- **Access**: Admin, Teacher
- **Query Params**: department, isActive, search, page, limit

#### GET /api/teachers/:id
- **Description**: Get teacher by ID
- **Access**: Admin, Teacher (own profile)

#### PUT /api/teachers/:id
- **Description**: Update teacher
- **Access**: Admin only

#### GET /api/teachers/:id/courses
- **Description**: Get courses taught by teacher
- **Access**: Admin, Teacher (own)

### Course Management

#### POST /api/courses
- **Description**: Create new course
- **Access**: Admin only
- **Body**: 
  ```json
  {
    "courseCode": "string",
    "courseName": "string",
    "description": "string",
    "grade": "string",
    "department": "string",
    "credits": "number",
    "teacherId": "objectId",
    "schedule": [
      {
        "day": "Monday",
        "startTime": "09:00",
        "endTime": "10:00",
        "room": "101"
      }
    ],
    "capacity": "number",
    "academicYear": "2024-2025",
    "semester": "Fall"
  }
  ```

#### GET /api/courses
- **Description**: Get all courses
- **Access**: All authenticated users
- **Query Params**: grade, department, teacherId, academicYear, semester, page, limit

#### GET /api/courses/:id
- **Description**: Get course by ID
- **Access**: All authenticated users

#### PUT /api/courses/:id
- **Description**: Update course
- **Access**: Admin only

#### DELETE /api/courses/:id
- **Description**: Soft delete course
- **Access**: Admin only

#### GET /api/courses/:id/students
- **Description**: Get enrolled students
- **Access**: Admin, Course teacher

### Enrollment Management

#### POST /api/enrollments
- **Description**: Enroll student in course
- **Access**: Admin, Teacher
- **Body**: 
  ```json
  {
    "studentId": "objectId",
    "courseId": "objectId"
  }
  ```

#### GET /api/enrollments
- **Description**: Get enrollments
- **Access**: Admin, Teacher
- **Query Params**: studentId, courseId, status, academicYear, semester

#### PUT /api/enrollments/:id
- **Description**: Update enrollment (change status, etc.)
- **Access**: Admin only

#### DELETE /api/enrollments/:id
- **Description**: Drop enrollment
- **Access**: Admin only

### Attendance Management

#### POST /api/attendance
- **Description**: Mark attendance
- **Access**: Teacher (for their courses)
- **Body**: 
  ```json
  {
    "courseId": "objectId",
    "date": "date",
    "records": [
      {
        "studentId": "objectId",
        "status": "present|absent|late|excused",
        "remarks": "string"
      }
    ]
  }
  ```

#### GET /api/attendance
- **Description**: Get attendance records
- **Access**: Admin, Teacher
- **Query Params**: courseId, studentId, date, startDate, endDate

#### PUT /api/attendance/:id
- **Description**: Update attendance record
- **Access**: Teacher (for their courses)

#### GET /api/attendance/summary
- **Description**: Get attendance summary
- **Access**: Admin, Teacher
- **Query Params**: courseId, studentId, startDate, endDate

### Grade Management

#### POST /api/grades
- **Description**: Create grade entry
- **Access**: Teacher (for their courses)
- **Body**: 
  ```json
  {
    "enrollmentId": "objectId",
    "studentId": "objectId",
    "courseId": "objectId",
    "assessments": [
      {
        "name": "Midterm Exam",
        "type": "midterm",
        "maxMarks": 100,
        "obtainedMarks": 85,
        "weight": 30,
        "date": "date"
      }
    ]
  }
  ```

#### GET /api/grades
- **Description**: Get grades
- **Access**: Admin, Teacher, Student (own)
- **Query Params**: studentId, courseId, academicYear, semester

#### PUT /api/grades/:id
- **Description**: Update grade
- **Access**: Teacher (for their courses)

#### PUT /api/grades/:id/publish
- **Description**: Publish grades to students
- **Access**: Teacher (for their courses)

#### GET /api/grades/:id/transcript
- **Description**: Get student transcript
- **Access**: Admin, Student (own)

### Announcement Management

#### POST /api/announcements
- **Description**: Create announcement
- **Access**: Admin, Teacher
- **Body**: 
  ```json
  {
    "title": "string",
    "content": "string",
    "targetAudience": ["all"],
    "priority": "high",
    "expiryDate": "date"
  }
  ```

#### GET /api/announcements
- **Description**: Get announcements for user
- **Access**: All authenticated users
- **Query Params**: targetAudience, priority, isActive

#### PUT /api/announcements/:id
- **Description**: Update announcement
- **Access**: Admin, Announcement creator

#### DELETE /api/announcements/:id
- **Description**: Delete announcement
- **Access**: Admin, Announcement creator

### Reports & Analytics

#### GET /api/reports/dashboard
- **Description**: Get dashboard statistics
- **Access**: Role-specific data
- **Response**: 
  - Admin: Total students, teachers, courses, recent activity
  - Teacher: My courses, attendance summary, pending grades
  - Student: My courses, attendance, recent grades

#### GET /api/reports/attendance-summary
- **Description**: Attendance analytics
- **Access**: Admin, Teacher
- **Query Params**: courseId, grade, startDate, endDate

#### GET /api/reports/grade-distribution
- **Description**: Grade distribution analytics
- **Access**: Admin, Teacher
- **Query Params**: courseId, grade, academicYear, semester

#### GET /api/reports/student-performance
- **Description**: Individual student performance report
- **Access**: Admin, Teacher, Student (own)
- **Query Params**: studentId, academicYear

## Frontend Components Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── Card.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── DatePicker.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Alert.jsx
│   │   └── Pagination.jsx
│   │
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleBasedRoute.jsx
│   │
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── UserManagement.jsx
│   │   ├── StudentList.jsx
│   │   ├── StudentForm.jsx
│   │   ├── TeacherList.jsx
│   │   ├── TeacherForm.jsx
│   │   ├── CourseList.jsx
│   │   ├── CourseForm.jsx
│   │   ├── EnrollmentManagement.jsx
│   │   └── Reports.jsx
│   │
│   ├── teacher/
│   │   ├── Dashboard.jsx
│   │   ├── MyCourses.jsx
│   │   ├── CourseDetail.jsx
│   │   ├── AttendanceMarking.jsx
│   │   ├── GradeEntry.jsx
│   │   ├── StudentList.jsx
│   │   └── ClassSchedule.jsx
│   │
│   ├── student/
│   │   ├── Dashboard.jsx
│   │   ├── MyCourses.jsx
│   │   ├── CourseDetail.jsx
│   │   ├── MyAttendance.jsx
│   │   ├── MyGrades.jsx
│   │   ├── Transcript.jsx
│   │   └── Schedule.jsx
│   │
│   └── shared/
│       ├── Profile.jsx
│       ├── ChangePassword.jsx
│       ├── Announcements.jsx
│       └── AnnouncementDetail.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── studentService.js
│   ├── teacherService.js
│   ├── courseService.js
│   ├── enrollmentService.js
│   ├── attendanceService.js
│   ├── gradeService.js
│   └── announcementService.js
│
├── utils/
│   ├── helpers.js
│   ├── validators.js
│   ├── constants.js
│   └── formatters.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useDebounce.js
│
├── App.jsx
└── main.jsx
```

## Security Implementation

### Authentication
- JWT tokens with httpOnly cookies or localStorage
- Token expiration: 24 hours
- Refresh token mechanism
- Password hashing with bcrypt (10 rounds)
- Password complexity requirements

### Authorization
- Role-based access control (RBAC)
- Middleware for route protection
- Resource ownership validation
- API endpoint permissions

### Input Validation
- Server-side validation with express-validator
- Client-side validation with form libraries
- SQL injection prevention (using Mongoose)
- XSS protection (sanitize inputs)

### Additional Security
- CORS configuration
- Rate limiting on API endpoints
- Helmet.js for HTTP headers
- HTTPS in production
- Environment variables for sensitive data

## Deployment Architecture

### Development Environment
- Node.js v18+
- MongoDB local instance or MongoDB Atlas
- React dev server (Vite)
- Environment variables in .env

### Production Environment (Moderate Scale)

**Backend:**
- Platform: AWS EC2 (t3.medium) or Heroku
- Database: MongoDB Atlas (M10 cluster)
- Node.js with PM2 process manager
- Nginx as reverse proxy
- SSL certificate (Let's Encrypt)

**Frontend:**
- Platform: Vercel, Netlify, or AWS S3 + CloudFront
- Build: Optimized production build
- CDN for static assets

**Database Optimization:**
- Indexes on frequently queried fields
- Connection pooling
- Query optimization
- Data archiving strategy

**Performance:**
- Expected concurrent users: 50-100
- Average response time: <200ms
- Database connections: 20-30
- Memory: 2-4GB for backend

## Installation & Setup

### Prerequisites
- Node.js v18 or higher
- MongoDB v6 or higher
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint
npm run dev
```

### Environment Variables

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## Testing Strategy

### Backend Testing
- Unit tests with Jest
- Integration tests for API endpoints
- Authentication flow testing
- Database operations testing

### Frontend Testing
- Component tests with React Testing Library
- E2E tests with Cypress
- User flow testing
- Responsive design testing

## Future Enhancements

1. Real-time notifications (Socket.io)
2. Email notifications
3. File upload for assignments
4. Video conferencing integration
5. Mobile application
6. Advanced analytics dashboard
7. Parent portal
8. Library management
9. Fee management
10. Timetable auto-generation
