const express = require("express");
const router = express.Router();

// Import controllers
const authController = require("../controllers/authController");
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  getStudentCourses,
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  getTeacherCourses,
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  createEnrollment,
  getEnrollments,
  updateEnrollment,
  deleteEnrollment,
  markAttendance,
  getAttendance,
  getAttendanceSummary,
  createGrade,
  getGrades,
  updateGrade,
  publishGrade,
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/mainControllers");

// Import middleware
const { protect, authorize } = require("../middleware/auth");
const {
  validate,
  userValidation,
  studentValidation,
  teacherValidation,
  courseValidation,
  attendanceValidation,
  gradeValidation,
  idValidation,
  paginationValidation,
} = require("../middleware/validation");

// ==================== AUTHENTICATION ROUTES ====================
router.post(
  "/auth/register",
  protect,
  authorize("admin"),
  userValidation.register,
  validate,
  authController.register,
);

router.post(
  "/auth/login",
  userValidation.login,
  validate,
  authController.login,
);

router.get("/auth/me", protect, authController.getMe);

router.put(
  "/auth/change-password",
  protect,
  userValidation.changePassword,
  validate,
  authController.changePassword,
);

router.post("/auth/logout", protect, authController.logout);

// ==================== STUDENT ROUTES ====================
router
  .route("/students")
  .get(
    protect,
    authorize("admin", "teacher"),
    paginationValidation,
    validate,
    getStudents,
  )
  .post(
    protect,
    authorize("admin"),
    studentValidation.create,
    validate,
    createStudent,
  );

router
  .route("/students/:id")
  .get(protect, idValidation, validate, getStudent)
  .put(protect, authorize("admin"), idValidation, validate, updateStudent);

router.get(
  "/students/:id/courses",
  protect,
  idValidation,
  validate,
  getStudentCourses,
);

// ==================== TEACHER ROUTES ====================
router
  .route("/teachers")
  .get(
    protect,
    authorize("admin", "teacher"),
    paginationValidation,
    validate,
    getTeachers,
  )
  .post(
    protect,
    authorize("admin"),
    teacherValidation.create,
    validate,
    createTeacher,
  );

router
  .route("/teachers/:id")
  .get(
    protect,
    authorize("admin", "teacher"),
    idValidation,
    validate,
    getTeacher,
  )
  .put(protect, authorize("admin"), idValidation, validate, updateTeacher);

router.get(
  "/teachers/:id/courses",
  protect,
  authorize("admin", "teacher"),
  idValidation,
  validate,
  getTeacherCourses,
);

// ==================== COURSE ROUTES ====================
router
  .route("/courses")
  .get(protect, paginationValidation, validate, getCourses)
  .post(
    protect,
    authorize("admin"),
    courseValidation.create,
    validate,
    createCourse,
  );

router
  .route("/courses/:id")
  .get(protect, idValidation, validate, getCourse)
  .put(protect, authorize("admin"), idValidation, validate, updateCourse)
  .delete(protect, authorize("admin"), idValidation, validate, deleteCourse);

// ==================== ENROLLMENT ROUTES ====================
router
  .route("/enrollments")
  .get(protect, authorize("admin", "teacher", "student"), getEnrollments)
  .post(protect, authorize("admin", "teacher"), createEnrollment);

router
  .route("/enrollments/:id")
  .put(protect, authorize("admin"), idValidation, validate, updateEnrollment)
  .delete(
    protect,
    authorize("admin"),
    idValidation,
    validate,
    deleteEnrollment,
  );

// ==================== ATTENDANCE ROUTES ====================
router.post(
  "/attendance",
  protect,
  authorize("teacher", "admin"),
  attendanceValidation.mark,
  validate,
  markAttendance,
);

router.get(
  "/attendance",
  protect,
  authorize("admin", "teacher", "student"),
  getAttendance,
);

router.get(
  "/attendance/summary",
  protect,
  authorize("admin", "teacher", "student"),
  getAttendanceSummary,
);

// ==================== GRADE ROUTES ====================
router
  .route("/grades")
  .get(protect, getGrades)
  .post(
    protect,
    authorize("teacher", "admin"),
    gradeValidation.create,
    validate,
    createGrade,
  );

router
  .route("/grades/:id")
  .put(
    protect,
    authorize("teacher", "admin"),
    idValidation,
    validate,
    updateGrade,
  );

router.put(
  "/grades/:id/publish",
  protect,
  authorize("teacher", "admin"),
  idValidation,
  validate,
  publishGrade,
);

// ==================== ANNOUNCEMENT ROUTES ====================
router
  .route("/announcements")
  .get(protect, getAnnouncements)
  .post(protect, authorize("admin", "teacher"), createAnnouncement);

router
  .route("/announcements/:id")
  .put(
    protect,
    authorize("admin", "teacher"),
    idValidation,
    validate,
    updateAnnouncement,
  )
  .delete(
    protect,
    authorize("admin", "teacher"),
    idValidation,
    validate,
    deleteAnnouncement,
  );

// ==================== DASHBOARD/REPORTS ROUTES ====================
router.get("/reports/dashboard", protect, async (req, res) => {
  try {
    const Student = require("../models/Student");
    const Teacher = require("../models/Teacher");
    const Course = require("../models/Course");
    const Announcement = require("../models/Announcement");

    let data = {};

    if (req.user.role === "admin") {
      data = {
        totalStudents: await Student.countDocuments({ isActive: true }),
        totalTeachers: await Teacher.countDocuments({ isActive: true }),
        totalCourses: await Course.countDocuments({ isActive: true }),
        recentAnnouncements: await Announcement.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(5),
      };
    } else if (req.user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      const courses = await Course.find({
        teacherId: teacher._id,
        isActive: true,
      });

      data = {
        myCourses: courses.length,
        totalStudents: courses.reduce(
          (sum, course) => sum + course.enrolledStudents.length,
          0,
        ),
        courses: courses,
        recentAnnouncements: await Announcement.find({
          isActive: true,
          targetAudience: { $in: ["teachers", "all"] },
        })
          .sort({ createdAt: -1 })
          .limit(5),
      };
    } else if (req.user.role === "student") {
      const student = await Student.findOne({ userId: req.user._id });
      const Enrollment = require("../models/Enrollment");
      const enrollments = await Enrollment.find({
        studentId: student._id,
        status: "enrolled",
      }).populate("courseId");

      data = {
        enrolledCourses: enrollments.length,
        courses: enrollments,
        recentAnnouncements: await Announcement.find({
          isActive: true,
          targetAudience: { $in: ["students", "all"] },
        })
          .sort({ createdAt: -1 })
          .limit(5),
      };
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
