# Quick Start Guide - School Management System

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (2 minutes)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### Step 2: Setup Environment (1 minute)

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/school_management
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

### Step 3: Start MongoDB (30 seconds)

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Step 4: Seed Database (30 seconds)

```bash
cd backend
node scripts/seed.js
```

This creates:
- 1 Admin user
- 5 Teachers
- 20 Students
- 8 Courses

### Step 5: Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Login 🎉

Open browser: `http://localhost:5173`

**Admin Login:**
- Email: `admin@school.com`
- Password: `Admin@123`

**Teacher Login:**
- Email: `john.smith@school.com`
- Password: `Admin@123`

**Student Login:**
- Email: `student1@school.com`
- Password: `Admin@123`

## 🎯 What to Try First

### As Admin:
1. Go to **Students** → View all students
2. Go to **Courses** → Create a new course
3. Go to **Enrollments** → Enroll students in courses
4. Go to **Announcements** → Create school-wide announcement

### As Teacher:
1. View **My Courses** → See assigned courses
2. Go to **Attendance** → Mark student attendance
3. Go to **Grades** → Create and publish grades
4. Create **Announcements** for students

### As Student:
1. View **My Courses** → See enrolled courses
2. Check **Attendance** → View attendance record
3. View **Grades** → See published grades
4. Read **Announcements** from teachers

## 📚 Key Features to Explore

### User Management
- Admin can create users with different roles
- Profile management for all users
- Password change functionality

### Course Management
- Create courses with schedules
- Assign teachers to courses
- Set capacity limits
- Define academic year and semester

### Enrollment System
- Enroll students in courses
- Check available seats
- View enrollment history
- Drop/complete enrollments

### Attendance Tracking
- Mark attendance with status (present/absent/late/excused)
- View attendance summaries
- Calculate attendance percentages
- Filter by date ranges

### Grade Management
- Create multiple assessments (assignments, quizzes, exams)
- Automatic GPA calculation
- Letter grade assignment
- Publish/unpublish grades

### Announcements
- Target specific audiences
- Set priority levels
- Add expiry dates
- Rich text content

## 🔧 Common Tasks

### Create a New Student
1. Login as Admin
2. Go to Students → Add Student
3. Fill in student details
4. Submit and student ID is auto-generated

### Enroll Student in Course
1. Go to Enrollments
2. Click "New Enrollment"
3. Select student and course
4. Confirm enrollment

### Mark Attendance
1. Login as Teacher
2. Go to Attendance
3. Select course and date
4. Mark each student's status
5. Save attendance

### Create and Publish Grades
1. Go to Grades → Create Grade
2. Select student and course
3. Add assessments with marks
4. Save grade (students can't see yet)
5. Click "Publish" to make visible to students

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh
# or
mongo
```

### Port Already in Use
```bash
# Backend (Port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (Port 5173)
lsof -ti:5173 | xargs kill -9
```

### Clear Browser Cache
If you see old data, clear cache: `Ctrl/Cmd + Shift + R`

### Reset Database
```bash
cd backend
node scripts/seed.js
```

## 📱 Mobile Responsive

The application is fully responsive. Try resizing your browser or access from mobile device!

## 🎨 Customization

### Change Color Theme
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these values
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  }
}
```

### Change School Name
Edit `frontend/src/App.jsx` and search for "SchoolMS"

## 📊 Sample Data Overview

After seeding, you'll have:

**Students:** 20 students across grades 9-12
**Teachers:** 5 teachers across different departments
**Courses:** 8 courses covering major subjects
**Admin:** 1 administrator account

## 🚀 Next Steps

1. Explore all features with different user roles
2. Customize the application for your needs
3. Add more data through the admin interface
4. Check the full documentation for advanced features
5. Deploy to production (see README.md)

## 💡 Pro Tips

- Use the search functionality in lists
- Try the dashboard for quick overview
- Announcements support markdown formatting
- Attendance can be marked for multiple students at once
- Grades are automatically calculated based on assessments

## 📞 Need Help?

- Check `PROJECT_DOCUMENTATION.md` for detailed info
- Review `README.md` for complete setup guide
- Check API endpoints in documentation
- Review the code comments for implementation details

## 🎓 Learning Resources

This project demonstrates:
- RESTful API design
- JWT authentication
- Role-based access control
- MongoDB schema design
- React hooks and context
- Responsive UI with Tailwind CSS
- Full-stack integration

Study the code to learn these patterns!

---

**Enjoy using the School Management System! 🎉**
