const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  room: {
    type: String,
    trim: true
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Please provide course code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  courseName: {
    type: String,
    required: [true, 'Please provide course name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Please provide grade']
  },
  department: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    min: 0,
    max: 10
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Please assign a teacher']
  },
  schedule: [scheduleSchema],
  capacity: {
    type: Number,
    default: 40,
    min: 1
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  academicYear: {
    type: String,
    required: [true, 'Please provide academic year']
  },
  semester: {
    type: String,
    enum: ['Spring', 'Fall', 'Summer'],
    required: [true, 'Please provide semester']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ courseCode: 1 });
courseSchema.index({ teacherId: 1 });
courseSchema.index({ grade: 1 });
courseSchema.index({ academicYear: 1 });
courseSchema.index({ isActive: 1 });

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for available seats
courseSchema.virtual('availableSeats').get(function() {
  return this.capacity - this.enrolledStudents.length;
});

// Check if course is full
courseSchema.methods.isFull = function() {
  return this.enrolledStudents.length >= this.capacity;
};

// Add student to course
courseSchema.methods.addStudent = function(studentId) {
  if (!this.isFull() && !this.enrolledStudents.includes(studentId)) {
    this.enrolledStudents.push(studentId);
    return this.save();
  }
  throw new Error('Course is full or student already enrolled');
};

// Remove student from course
courseSchema.methods.removeStudent = function(studentId) {
  this.enrolledStudents = this.enrolledStudents.filter(
    id => id.toString() !== studentId.toString()
  );
  return this.save();
};

module.exports = mongoose.model('Course', courseSchema);
