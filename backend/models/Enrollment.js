const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
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
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["enrolled", "dropped", "completed"],
      default: "enrolled",
    },
    finalGrade: {
      type: String,
      trim: true,
    },
    credits: {
      type: Number,
    },
    academicYear: {
      type: String,
    },
    semester: {
      type: String,
      enum: ["Spring", "Fall", "Summer"],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ courseId: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Populate course and student details
enrollmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "courseId",
    select: "courseCode courseName credits teacherId",
  }).populate({
    path: "studentId",
    select: "studentId userId",
    populate: {
      path: "userId",
      select: "firstName lastName email",
    },
  });
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
