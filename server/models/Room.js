const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  building: {
    type: String,
    required: [true, 'Building name is required'],
    trim: true,
  },
  rows: {
    type: Number,
    required: [true, 'Number of rows is required'],
    min: 1,
    max: 20,
  },
  columns: {
    type: Number,
    required: [true, 'Number of columns is required'],
    min: 1,
    max: 20,
  },
  seatsPerBench: {
    type: Number,
    required: [true, 'Seats per bench is required'],
    default: 2,
    min: 1,
    max: 4,
  },
  capacity: {
    type: Number,
    required: true,
  },
  floor: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-calculate capacity before validation
roomSchema.pre('validate', function (next) {
  if (this.rows && this.columns) {
    const seats = this.seatsPerBench || 2;
    this.capacity = this.rows * this.columns * seats;
  }
  next();
});

roomSchema.index({ building: 1 });

module.exports = mongoose.model('Room', roomSchema);
