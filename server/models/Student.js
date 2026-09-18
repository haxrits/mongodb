const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    uppercase: true,
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1,
    max: 4,
  },
  examIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

studentSchema.index({ department: 1 });
studentSchema.index({ section: 1 });
studentSchema.index({ semester: 1 });
studentSchema.index({ department: 1, section: 1 });

module.exports = mongoose.model('Student', studentSchema);
