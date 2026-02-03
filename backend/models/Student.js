const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      unique: true,
    },
    enrollmentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    grade: {
      type: String,
      required: [true, "Please provide grade"],
    },
    section: {
      type: String,
      trim: true,
    },
    parentName: {
      type: String,
      trim: true,
    },
    parentEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    parentPhone: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    medicalInfo: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
studentSchema.index({ userId: 1 });
studentSchema.index({ studentId: 1 });
studentSchema.index({ grade: 1 });
studentSchema.index({ isActive: 1 });

// Generate student ID before saving
studentSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return;
  }

  // Generate student ID: STU + year + sequential number
  const year = new Date().getFullYear().toString().slice(-2);
  const count = await this.constructor.countDocuments();
  this.studentId = `STU${year}${String(count + 1).padStart(4, "0")}`;
});

module.exports = mongoose.model("Student", studentSchema);
