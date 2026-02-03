require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Course.deleteMany({});

    // Create Admin User
    console.log("Creating admin user...");
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@school.com",
      password: "Admin@123",
      role: "admin",
      phone: "+1234567890",
      isActive: true,
    });

    console.log("Admin created:", adminUser.email);

    // Create Teachers
    console.log("Creating teachers...");
    const teacherUsers = [];
    const teacherData = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@school.com",
        department: "Mathematics",
        subjects: ["Algebra", "Calculus"],
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@school.com",
        department: "Science",
        subjects: ["Physics", "Chemistry"],
      },
      {
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@school.com",
        department: "English",
        subjects: ["Literature", "Grammar"],
      },
      {
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@school.com",
        department: "History",
        subjects: ["World History", "Geography"],
      },
      {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@school.com",
        department: "Computer Science",
        subjects: ["Programming", "Web Development"],
      },
    ];

    for (const data of teacherData) {
      const user = await User.create({
        ...data,
        password: "Admin@123",
        role: "teacher",
        phone: `+1${Math.floor(Math.random() * 1000000000)}`,
        isActive: true,
      });
      teacherUsers.push(user);

      await Teacher.create({
        userId: user._id,
        department: data.department,
        subjects: data.subjects,
        joiningDate: new Date("2023-01-01"),
        qualification: "Masters",
        experience: Math.floor(Math.random() * 10) + 5,
        isActive: true,
      });
    }

    console.log(`${teacherUsers.length} teachers created`);

    // Create Students
    console.log("Creating students...");
    const studentUsers = [];
    const grades = ["9", "10", "11", "12"];
    const sections = ["A", "B", "C"];

    for (let i = 1; i <= 20; i++) {
      const user = await User.create({
        firstName: `Student${i}`,
        lastName: `Test`,
        email: `student${i}@school.com`,
        password: "Admin@123",
        role: "student",
        phone: `+1${Math.floor(Math.random() * 1000000000)}`,
        dateOfBirth: new Date(
          `200${Math.floor(Math.random() * 5) + 3}-0${Math.floor(Math.random() * 9) + 1}-15`,
        ),
        isActive: true,
      });
      studentUsers.push(user);

      await Student.create({
        userId: user._id,
        grade: grades[Math.floor(Math.random() * grades.length)],
        section: sections[Math.floor(Math.random() * sections.length)],
        enrollmentDate: new Date("2024-09-01"),
        parentName: `Parent of Student${i}`,
        parentEmail: `parent${i}@example.com`,
        parentPhone: `+1${Math.floor(Math.random() * 1000000000)}`,
        isActive: true,
      });
    }

    console.log(`${studentUsers.length} students created`);

    // Create Courses
    console.log("Creating courses...");
    const teachers = await Teacher.find();
    const courses = [
      {
        courseCode: "MATH101",
        courseName: "Algebra I",
        grade: "9",
        department: "Mathematics",
        credits: 3,
      },
      {
        courseCode: "MATH201",
        courseName: "Geometry",
        grade: "10",
        department: "Mathematics",
        credits: 3,
      },
      {
        courseCode: "SCI101",
        courseName: "Physics I",
        grade: "9",
        department: "Science",
        credits: 4,
      },
      {
        courseCode: "SCI201",
        courseName: "Chemistry I",
        grade: "10",
        department: "Science",
        credits: 4,
      },
      {
        courseCode: "ENG101",
        courseName: "English Literature",
        grade: "9",
        department: "English",
        credits: 3,
      },
      {
        courseCode: "ENG201",
        courseName: "Advanced English",
        grade: "10",
        department: "English",
        credits: 3,
      },
      {
        courseCode: "HIS101",
        courseName: "World History",
        grade: "9",
        department: "History",
        credits: 3,
      },
      {
        courseCode: "CS101",
        courseName: "Introduction to Programming",
        grade: "10",
        department: "Computer Science",
        credits: 4,
      },
    ];

    for (const courseData of courses) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      await Course.create({
        ...courseData,
        teacherId: teacher._id,
        academicYear: "2024-2025",
        semester: "Fall",
        capacity: 30,
        schedule: [
          {
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00",
            room: `Room ${Math.floor(Math.random() * 20) + 100}`,
          },
          {
            day: "Wednesday",
            startTime: "09:00",
            endTime: "10:00",
            room: `Room ${Math.floor(Math.random() * 20) + 100}`,
          },
          {
            day: "Friday",
            startTime: "09:00",
            endTime: "10:00",
            room: `Room ${Math.floor(Math.random() * 20) + 100}`,
          },
        ],
        isActive: true,
      });
    }

    console.log(`${courses.length} courses created`);

    console.log("\n=================================");
    console.log("Database seeded successfully!");
    console.log("=================================");
    console.log("\nLogin Credentials:");
    console.log("Admin: admin@school.com / Admin@123");
    console.log("Teacher: john.smith@school.com / Admin@123");
    console.log("Student: student1@school.com / Admin@123");
    console.log("=================================\n");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seed function
connectDB().then(seedDatabase);
