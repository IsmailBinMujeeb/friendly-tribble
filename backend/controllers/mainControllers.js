// This file contains controllers for Student, Teacher, Course, Enrollment, Attendance, and Grade management

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Announcement = require('../models/Announcement');

// ==================== STUDENT CONTROLLERS ====================

exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const { grade, section, isActive, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (grade) query.grade = grade;
    if (section) query.section = section;
    if (isActive !== undefined) query.isActive = isActive;
    
    const students = await Student.find(query)
      .populate('userId', 'firstName lastName email phone profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Student.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone address dateOfBirth profileImage');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.params.id,
      status: 'enrolled'
    }).populate('courseId');
    
    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// ==================== TEACHER CONTROLLERS ====================

exports.createTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

exports.getTeachers = async (req, res, next) => {
  try {
    const { department, isActive, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive;
    
    const teachers = await Teacher.find(query)
      .populate('userId', 'firstName lastName email phone profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Teacher.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: teachers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone address profileImage');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

exports.getTeacherCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      teacherId: req.params.id,
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// ==================== COURSE CONTROLLERS ====================

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const { grade, department, teacherId, academicYear, semester, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (grade) query.grade = grade;
    if (department) query.department = department;
    if (teacherId) query.teacherId = teacherId;
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = semester;
    
    const courses = await Course.find(query)
      .populate('teacherId')
      .populate({
        path: 'teacherId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Course.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'teacherId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email phone'
        }
      })
      .populate({
        path: 'enrolledStudents',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ENROLLMENT CONTROLLERS ====================

exports.createEnrollment = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
      status: 'enrolled'
    });
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }
    
    // Get course and check capacity
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    if (course.isFull()) {
      return res.status(400).json({
        success: false,
        message: 'Course is full'
      });
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      academicYear: course.academicYear,
      semester: course.semester,
      credits: course.credits
    });
    
    // Add student to course
    await course.addStudent(studentId);
    
    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

exports.getEnrollments = async (req, res, next) => {
  try {
    const { studentId, courseId, status, academicYear, semester } = req.query;
    
    const query = {};
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = semester;
    
    const enrollments = await Enrollment.find(query);
    
    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    // Remove student from course
    const course = await Course.findById(enrollment.courseId);
    await course.removeStudent(enrollment.studentId);
    
    // Update enrollment status
    enrollment.status = 'dropped';
    await enrollment.save();
    
    res.status(200).json({
      success: true,
      message: 'Enrollment dropped successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ATTENDANCE CONTROLLERS ====================

exports.markAttendance = async (req, res, next) => {
  try {
    const { courseId, date, records } = req.body;
    
    // Verify teacher teaches this course
    const course = await Course.findById(courseId).populate('teacherId');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    if (course.teacherId.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance for this course'
      });
    }
    
    // Mark attendance for each student
    const attendanceRecords = [];
    
    for (const record of records) {
      const attendance = await Attendance.findOneAndUpdate(
        {
          courseId,
          studentId: record.studentId,
          date: new Date(date)
        },
        {
          status: record.status,
          remarks: record.remarks,
          markedBy: course.teacherId._id
        },
        { upsert: true, new: true }
      );
      
      attendanceRecords.push(attendance);
    }
    
    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendanceRecords
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const { courseId, studentId, date, startDate, endDate } = req.query;
    
    const query = {};
    if (courseId) query.courseId = courseId;
    if (studentId) query.studentId = studentId;
    
    if (date) {
      query.date = new Date(date);
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const attendance = await Attendance.find(query).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceSummary = async (req, res, next) => {
  try {
    const { courseId, studentId, startDate, endDate } = req.query;
    
    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Course ID are required'
      });
    }
    
    const percentage = await Attendance.calculateAttendancePercentage(
      studentId,
      courseId,
      startDate,
      endDate
    );
    
    const query = { studentId, courseId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const statusCounts = await Attendance.aggregate([
      { $match: query },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        percentage,
        statusCounts
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GRADE CONTROLLERS ====================

exports.createGrade = async (req, res, next) => {
  try {
    const grade = await Grade.create({
      ...req.body,
      teacherId: req.user.role === 'teacher' ? 
        (await Teacher.findOne({ userId: req.user._id }))._id : 
        req.body.teacherId
    });
    
    res.status(201).json({
      success: true,
      message: 'Grade created successfully',
      data: grade
    });
  } catch (error) {
    next(error);
  }
};

exports.getGrades = async (req, res, next) => {
  try {
    const { studentId, courseId, academicYear, semester, isPublished } = req.query;
    
    const query = {};
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = semester;
    if (isPublished !== undefined) query.isPublished = isPublished;
    
    // Students can only see published grades
    if (req.user.role === 'student') {
      query.isPublished = true;
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student._id;
    }
    
    const grades = await Grade.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: grades
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Grade updated successfully',
      data: grade
    });
  } catch (error) {
    next(error);
  }
};

exports.publishGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      {
        isPublished: true,
        publishedDate: new Date()
      },
      { new: true }
    );
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    // Update enrollment with final grade
    await Enrollment.findByIdAndUpdate(grade.enrollmentId, {
      finalGrade: grade.letterGrade
    });
    
    res.status(200).json({
      success: true,
      message: 'Grade published successfully',
      data: grade
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ANNOUNCEMENT CONTROLLERS ====================

exports.createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnnouncements = async (req, res, next) => {
  try {
    const { targetAudience, priority, isActive } = req.query;
    
    const query = { isActive: true };
    
    // Filter by user role
    if (targetAudience) {
      query.targetAudience = { $in: [targetAudience, 'all'] };
    } else {
      query.targetAudience = { $in: [req.user.role, 'all'] };
    }
    
    if (priority) query.priority = priority;
    if (isActive !== undefined) query.isActive = isActive;
    
    // Exclude expired announcements
    query.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gte: new Date() } }
    ];
    
    const announcements = await Announcement.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(20);
    
    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check authorization
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }
    
    Object.assign(announcement, req.body);
    await announcement.save();
    
    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check authorization
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }
    
    announcement.isActive = false;
    await announcement.save();
    
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
