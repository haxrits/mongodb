const mongoose = require('mongoose');

const allocationLogSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  userAction: {
    type: String,
    default: 'GENERATE_SEATING',
  },
  studentsCount: {
    type: Number,
    required: true,
  },
  roomsCount: {
    type: Number,
    required: true,
  },
  conflictsBeforeOptimization: {
    type: Number,
    required: true,
  },
  conflictsAfterOptimization: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  executionTimeMs: {
    type: Number,
    default: 0,
  },
  iterations: {
    type: Number,
    default: 100,
  },
});

allocationLogSchema.index({ examId: 1 });
allocationLogSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('AllocationLog', allocationLogSchema);
