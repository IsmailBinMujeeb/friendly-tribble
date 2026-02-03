const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
attendanceSchema.index({ courseId: 1 });
attendanceSchema.index({ studentId: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index(
  { courseId: 1, studentId: 1, date: 1 },
  { unique: true },
);

// Populate references
attendanceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "studentId",
    select: "studentId userId",
    populate: {
      path: "userId",
      select: "firstName lastName",
    },
  }).populate({
    path: "courseId",
    select: "courseCode courseName",
  });
});

// Static method to calculate attendance percentage
attendanceSchema.statics.calculateAttendancePercentage = async function (
  studentId,
  courseId,
  startDate,
  endDate,
) {
  const query = { studentId, courseId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const total = await this.countDocuments(query);
  const present = await this.countDocuments({
    ...query,
    status: { $in: ["present", "late"] },
  });

  return total > 0 ? ((present / total) * 100).toFixed(2) : 0;
};

module.exports = mongoose.model("Attendance", attendanceSchema);
