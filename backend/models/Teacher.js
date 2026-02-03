const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    teacherId: {
      type: String,
      unique: true,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    department: {
      type: String,
      required: [true, "Please provide department"],
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    qualification: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: 0,
    },
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],
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
teacherSchema.index({ userId: 1 });
teacherSchema.index({ teacherId: 1 });
teacherSchema.index({ department: 1 });
teacherSchema.index({ isActive: 1 });

// Generate teacher ID before saving
teacherSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return;
  }

  // Generate teacher ID: TCH + year + sequential number
  const year = new Date().getFullYear().toString().slice(-2);
  const count = await this.constructor.countDocuments();
  this.teacherId = `TCH${year}${String(count + 1).padStart(4, "0")}`;
});

module.exports = mongoose.model("Teacher", teacherSchema);
