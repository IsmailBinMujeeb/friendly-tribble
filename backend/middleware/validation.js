const { validationResult } = require("express-validator");

// Middleware to handle validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

// Common validation rules
const { body, param, query } = require("express-validator");

exports.userValidation = {
  register: [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .withMessage("Password must contain uppercase, lowercase, and number"),
    body("role")
      .isIn(["admin", "teacher", "student"])
      .withMessage("Invalid role"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
  ],

  login: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  changePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain uppercase, lowercase, and number"),
  ],
};

exports.studentValidation = {
  create: [
    body("userId").isMongoId().withMessage("Valid user ID is required"),
    body("grade").notEmpty().withMessage("Grade is required"),
    body("enrollmentDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format"),
    body("parentEmail")
      .optional()
      .isEmail()
      .withMessage("Invalid parent email"),
  ],
};

exports.teacherValidation = {
  create: [
    body("userId").isMongoId().withMessage("Valid user ID is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("joiningDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format"),
    body("experience")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Experience must be positive"),
  ],
};

exports.courseValidation = {
  create: [
    body("courseCode").trim().notEmpty().withMessage("Course code is required"),
    body("courseName").trim().notEmpty().withMessage("Course name is required"),
    body("grade").notEmpty().withMessage("Grade is required"),
    body("teacherId").isMongoId().withMessage("Valid teacher ID is required"),
    body("capacity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("academicYear").notEmpty().withMessage("Academic year is required"),
    body("semester")
      .isIn(["Spring", "Fall", "Summer"])
      .withMessage("Invalid semester"),
  ],
};

exports.attendanceValidation = {
  mark: [
    body("courseId").isMongoId().withMessage("Valid course ID is required"),
    body("date").isISO8601().withMessage("Invalid date format"),
    body("records")
      .isArray({ min: 1 })
      .withMessage("At least one record is required"),
    body("records.*.studentId")
      .isMongoId()
      .withMessage("Valid student ID is required"),
    body("records.*.status")
      .isIn(["present", "absent", "late", "excused"])
      .withMessage("Invalid status"),
  ],
};

exports.gradeValidation = {
  create: [
    body("enrollmentId")
      .isMongoId()
      .withMessage("Valid enrollment ID is required"),
    body("studentId").isMongoId().withMessage("Valid student ID is required"),
    body("courseId").isMongoId().withMessage("Valid course ID is required"),
    body("assessments")
      .isArray({ min: 1 })
      .withMessage("At least one assessment is required"),
    body("assessments.*.name")
      .notEmpty()
      .withMessage("Assessment name is required"),
    body("assessments.*.type")
      .isIn(["assignment", "quiz", "midterm", "final", "project", "other"])
      .withMessage("Invalid assessment type"),
    body("assessments.*.maxMarks")
      .isFloat({ min: 0 })
      .withMessage("Max marks must be positive"),
    body("assessments.*.obtainedMarks")
      .isFloat({ min: 0 })
      .withMessage("Obtained marks must be positive"),
  ],
};

exports.idValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

exports.paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be positive"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1-100"),
];
