const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["assignment", "quiz", "midterm", "final", "project", "other"],
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
      max: 100,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const gradeSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    assessments: [assessmentSchema],
    totalMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    letterGrade: {
      type: String,
      enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F", ""],
      default: "",
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    academicYear: {
      type: String,
    },
    semester: {
      type: String,
      enum: ["Spring", "Fall", "Summer"],
    },
    publishedDate: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
gradeSchema.index({ enrollmentId: 1 });
gradeSchema.index({ studentId: 1 });
gradeSchema.index({ courseId: 1 });
gradeSchema.index({ teacherId: 1 });
gradeSchema.index({ isPublished: 1 });

// Calculate grades before saving
gradeSchema.pre("save", function (next) {
  if (this.assessments.length > 0) {
    let totalObtained = 0;
    let totalMax = 0;

    this.assessments.forEach((assessment) => {
      totalObtained += assessment.obtainedMarks;
      totalMax += assessment.maxMarks;
    });

    this.totalMarks = totalObtained;
    this.percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    // Calculate letter grade and GPA
    const percent = this.percentage;
    if (percent >= 97) {
      this.letterGrade = "A+";
      this.gpa = 4.0;
    } else if (percent >= 93) {
      this.letterGrade = "A";
      this.gpa = 4.0;
    } else if (percent >= 90) {
      this.letterGrade = "A-";
      this.gpa = 3.7;
    } else if (percent >= 87) {
      this.letterGrade = "B+";
      this.gpa = 3.3;
    } else if (percent >= 83) {
      this.letterGrade = "B";
      this.gpa = 3.0;
    } else if (percent >= 80) {
      this.letterGrade = "B-";
      this.gpa = 2.7;
    } else if (percent >= 77) {
      this.letterGrade = "C+";
      this.gpa = 2.3;
    } else if (percent >= 73) {
      this.letterGrade = "C";
      this.gpa = 2.0;
    } else if (percent >= 70) {
      this.letterGrade = "C-";
      this.gpa = 1.7;
    } else if (percent >= 60) {
      this.letterGrade = "D";
      this.gpa = 1.0;
    } else {
      this.letterGrade = "F";
      this.gpa = 0.0;
    }
  }
});

// Populate references
gradeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "studentId",
    select: "studentId userId",
    populate: {
      path: "userId",
      select: "firstName lastName email",
    },
  }).populate({
    path: "courseId",
    select: "courseCode courseName credits",
  });
});

module.exports = mongoose.model("Grade", gradeSchema);
