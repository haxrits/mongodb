const mongoose = require('mongoose');

const seatAssignmentSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  column: {
    type: Number,
    required: true,
  },
  benchCol: {
    type: Number,
  },
  benchPos: {
    type: Number, // 1 for left, 2 for right, etc.
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  rollNumber: {
    type: String,
  },
  name: {
    type: String,
  },
  department: {
    type: String,
  },
  section: {
    type: String,
  },
  hasConflict: {
    type: Boolean,
    default: false,
  },
  conflictReasons: [{
    type: String,
  }],
  conflictsWith: [{
    seatId: String,
    rollNumber: String,
    name: String,
    conflictType: String,
    penalty: Number,
  }],
}, { _id: false });

const roomPlanSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  building: {
    type: String,
  },
  rows: {
    type: Number,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  seatsPerBench: {
    type: Number,
    default: 2,
  },
  capacity: {
    type: Number,
    required: true,
  },
  allocatedCount: {
    type: Number,
    default: 0,
  },
  seats: [seatAssignmentSchema],
}, { _id: false });

const seatingPlanSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  algorithm: {
    type: String,
    default: 'constraint-based-heuristic',
  },
  studentsAllocated: {
    type: Number,
    required: true,
  },
  totalStudents: {
    type: Number,
    required: true,
  },
  conflicts: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 100,
  },
  conflictDetails: {
    sectionConflicts: { type: Number, default: 0 },
    departmentConflicts: { type: Number, default: 0 },
    sequentialRollConflicts: { type: Number, default: 0 },
    conflictPairs: [{
      seat1: String,
      student1: String,
      section1: String,
      dept1: String,
      seat2: String,
      student2: String,
      section2: String,
      dept2: String,
      conflictType: String,
      penalty: Number,
      roomNumber: String,
    }],
  },
  rooms: [roomPlanSchema],
  unallocatedStudents: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    rollNumber: String,
    name: String,
    department: String,
    section: String,
    reason: String,
  }],
  status: {
    type: String,
    enum: ['generated', 'published', 'archived'],
    default: 'generated',
  },
});

seatingPlanSchema.index({ examId: 1 });
seatingPlanSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('SeatingPlan', seatingPlanSchema);
