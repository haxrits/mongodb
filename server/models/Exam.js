const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Exam subject is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Exam date is required'],
  },
  startTime: {
    type: String,
    required: [true, 'Exam start time is required'],
    trim: true,
    default: '10:00',
  },
  duration: {
    type: Number,
    required: [true, 'Exam duration in minutes is required'],
    default: 120,
    min: 15,
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8,
  },
  departments: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'completed'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

examSchema.index({ date: 1 });
examSchema.index({ status: 1 });
examSchema.index({ semester: 1 });

module.exports = mongoose.model('Exam', examSchema);
