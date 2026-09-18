const SeatingPlan = require('../models/SeatingPlan');
const AllocationLog = require('../models/AllocationLog');
const Exam = require('../models/Exam');
const Room = require('../models/Room');
const Student = require('../models/Student');
const optimizer = require('../services/optimizer');

// Generate optimized seating plan
exports.generateSeating = async (req, res) => {
  try {
    const { examId, roomIds, studentIds, config = {} } = req.body;

    if (!examId) {
      return res.status(400).json({ success: false, message: 'examId is required' });
    }
    if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one room must be selected' });
    }

    // Fetch Exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    // Fetch Rooms
    const rooms = await Room.find({ _id: { $in: roomIds } });
    if (rooms.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rooms found' });
    }

    // Fetch Students
    let students = [];
    if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
      students = await Student.find({ _id: { $in: studentIds } });
    } else {
      // Auto-select students based on exam departments & semester, or all students
      const query = {};
      if (exam.semester) query.semester = exam.semester;
      if (exam.departments && exam.departments.length > 0) {
        query.department = { $in: exam.departments };
      }
      students = await Student.find(query);

      // If no matching students found, grab all available students
      if (students.length === 0) {
        students = await Student.find().limit(200);
      }
    }

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No students available or selected for this examination',
      });
    }

    // Capacity validation
    const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
    if (students.length > totalCapacity) {
      return res.status(400).json({
        success: false,
        message: `Capacity exceeded! Selected students (${students.length}) exceed total room capacity (${totalCapacity}). Please select additional rooms.`,
        data: { totalStudents: students.length, totalCapacity, deficit: students.length - totalCapacity },
      });
    }

    // Run Optimization Engine
    const optimizationResult = await optimizer.generateSeatingPlan(exam, rooms, students, config);

    // Persist new SeatingPlan document in MongoDB
    const seatingPlanDoc = await SeatingPlan.create({
      examId: exam._id,
      generatedAt: optimizationResult.generatedAt,
      algorithm: optimizationResult.algorithm,
      studentsAllocated: optimizationResult.studentsAllocated,
      totalStudents: optimizationResult.totalStudents,
      conflicts: optimizationResult.conflicts,
      score: optimizationResult.score,
      conflictDetails: optimizationResult.conflictDetails,
      rooms: optimizationResult.rooms,
      unallocatedStudents: optimizationResult.unallocatedStudents,
      status: 'generated',
    });

    // Persist AllocationLog document in MongoDB
    await AllocationLog.create({
      examId: exam._id,
      examName: exam.name,
      generatedAt: seatingPlanDoc.generatedAt,
      userAction: 'GENERATE_SEATING',
      studentsCount: optimizationResult.studentsAllocated,
      roomsCount: rooms.length,
      conflictsBeforeOptimization: optimizationResult.metrics.conflictsBeforeOptimization,
      conflictsAfterOptimization: optimizationResult.metrics.conflictsAfterOptimization,
      score: optimizationResult.score,
      executionTimeMs: optimizationResult.metrics.executionTimeMs,
      iterations: optimizationResult.metrics.iterations,
    });

    // Populate exam details for return
    const populatedPlan = await SeatingPlan.findById(seatingPlanDoc._id).populate('examId');

    res.status(201).json({
      success: true,
      message: 'Seating plan generated successfully',
      data: {
        plan: populatedPlan,
        metrics: optimizationResult.metrics,
      },
    });
  } catch (error) {
    console.error('Error generating seating plan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all seating plans (History)
exports.getSeatingPlans = async (req, res) => {
  try {
    const plans = await SeatingPlan.find()
      .populate('examId', 'name subject date startTime duration semester')
      .sort({ generatedAt: -1 });

    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single seating plan
exports.getSeatingPlanById = async (req, res) => {
  try {
    const plan = await SeatingPlan.findById(req.params.id)
      .populate('examId', 'name subject date startTime duration semester departments');

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Seating plan not found' });
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete seating plan
exports.deleteSeatingPlan = async (req, res) => {
  try {
    const deleted = await SeatingPlan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Seating plan not found' });
    }
    res.json({ success: true, message: 'Seating plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Seating Plan as CSV
exports.exportCSV = async (req, res) => {
  try {
    const plan = await SeatingPlan.findById(req.params.id).populate('examId');
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Seating plan not found' });
    }

    const rows = [
      ['Room Number', 'Seat ID', 'Row', 'Bench Column', 'Bench Seat', 'Roll Number', 'Student Name', 'Department', 'Section', 'Has Conflict', 'Conflict Reasons'].join(','),
    ];

    for (const room of plan.rooms) {
      for (const seat of room.seats) {
        rows.push([
          `"${room.roomNumber}"`,
          `"${seat.seatId}"`,
          seat.row + 1,
          (seat.benchCol || 0) + 1,
          seat.benchPos || 1,
          `"${seat.rollNumber || 'VACANT'}"`,
          `"${seat.name || ''}"`,
          `"${seat.department || ''}"`,
          `"${seat.section || ''}"`,
          seat.hasConflict ? 'YES' : 'NO',
          `"${(seat.conflictReasons || []).join('; ')}"`,
        ].join(','));
      }
    }

    const csvContent = rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="seating_plan_${plan._id}.csv"`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
