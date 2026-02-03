const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetAudience: [
      {
        type: String,
        enum: ["all", "students", "teachers", "admin"],
        default: ["all"],
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    expiryDate: {
      type: Date,
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
announcementSchema.index({ targetAudience: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ isActive: 1 });
announcementSchema.index({ expiryDate: 1 });

// Populate creator
announcementSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "firstName lastName email role",
  });
});

// Check if announcement is expired
announcementSchema.methods.isExpired = function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
};

module.exports = mongoose.model("Announcement", announcementSchema);
