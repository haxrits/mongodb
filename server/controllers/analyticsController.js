const Student = require('../models/Student');
const Room = require('../models/Room');
const Exam = require('../models/Exam');
const SeatingPlan = require('../models/SeatingPlan');
const AllocationLog = require('../models/AllocationLog');

// Get overview statistics for the main dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalRooms,
      totalExams,
      totalPlans,
      roomCapacityAgg,
      latestPlanAgg,
      logAveragesAgg,
    ] = await Promise.all([
      Student.countDocuments(),
      Room.countDocuments(),
      Exam.countDocuments(),
      SeatingPlan.countDocuments(),

      // Room capacity aggregation
      Room.aggregate([
        {
          $group: {
            _id: null,
            totalCapacity: { $sum: '$capacity' },
            avgCapacity: { $avg: '$capacity' },
          },
        },
      ]),

      // Latest seating plan with $lookup to exam details
      SeatingPlan.aggregate([
        { $sort: { generatedAt: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'exams',
            localField: 'examId',
            foreignField: '_id',
            as: 'exam',
          },
        },
        { $unwind: { path: '$exam', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            generatedAt: 1,
            studentsAllocated: 1,
            totalStudents: 1,
            conflicts: 1,
            score: 1,
            roomsCount: { $size: '$rooms' },
            examName: '$exam.name',
            subject: '$exam.subject',
            date: '$exam.date',
          },
        },
      ]),

      // AllocationLog averages using MongoDB Aggregation
      AllocationLog.aggregate([
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$score' },
            avgInitialConflicts: { $avg: '$conflictsBeforeOptimization' },
            avgFinalConflicts: { $avg: '$conflictsAfterOptimization' },
            totalGenerations: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalCapacity = roomCapacityAgg.length > 0 ? roomCapacityAgg[0].totalCapacity : 0;
    const logAverages = logAveragesAgg.length > 0 ? logAveragesAgg[0] : null;

    res.json({
      success: true,
      data: {
        totalStudents,
        totalRooms,
        totalExams,
        totalPlans,
        totalCapacity,
        averageOptimizationScore: logAverages ? Math.round(logAverages.avgScore) : 100,
        avgInitialConflicts: logAverages ? Math.round(logAverages.avgInitialConflicts) : 0,
        avgFinalConflicts: logAverages ? Math.round(logAverages.avgFinalConflicts) : 0,
        latestPlan: latestPlanAgg.length > 0 ? latestPlanAgg[0] : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Conflict and Optimization Analytics using Aggregation
exports.getConflictAnalytics = async (req, res) => {
  try {
    const [conflictSums, scoreTrend, optimizationLogs] = await Promise.all([
      // Sum conflict categories across all historical plans
      SeatingPlan.aggregate([
        {
          $group: {
            _id: null,
            totalSectionConflicts: { $sum: '$conflictDetails.sectionConflicts' },
            totalDepartmentConflicts: { $sum: '$conflictDetails.departmentConflicts' },
            totalSequentialConflicts: { $sum: '$conflictDetails.sequentialRollConflicts' },
            totalConflicts: { $sum: '$conflicts' },
            avgScore: { $avg: '$score' },
          },
        },
      ]),

      // Score trends over recent generation runs
      AllocationLog.aggregate([
        { $sort: { generatedAt: 1 } },
        { $limit: 20 },
        {
          $project: {
            _id: 1,
            examName: 1,
            generatedAt: 1,
            score: 1,
            initialConflicts: '$conflictsBeforeOptimization',
            finalConflicts: '$conflictsAfterOptimization',
            reductionPercentage: {
              $cond: [
                { $gt: ['$conflictsBeforeOptimization', 0] },
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ['$conflictsBeforeOptimization', '$conflictsAfterOptimization'] },
                        '$conflictsBeforeOptimization',
                      ],
                    },
                    100,
                  ],
                },
                100,
              ],
            },
          },
        },
      ]),

      // Recent generation history summary
      AllocationLog.find().sort({ generatedAt: -1 }).limit(10),
    ]);

    res.json({
      success: true,
      data: {
        summary: conflictSums.length > 0 ? conflictSums[0] : {
          totalSectionConflicts: 0,
          totalDepartmentConflicts: 0,
          totalSequentialConflicts: 0,
          totalConflicts: 0,
          avgScore: 100,
        },
        scoreTrend,
        recentLogs: optimizationLogs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Room Utilization and Capacity Analytics using Aggregation
exports.getRoomAnalytics = async (req, res) => {
  try {
    const [buildingAgg, roomUtilizationAgg] = await Promise.all([
      // Capacity grouped by building
      Room.aggregate([
        {
          $group: {
            _id: '$building',
            roomCount: { $sum: 1 },
            totalCapacity: { $sum: '$capacity' },
            avgCapacity: { $avg: '$capacity' },
          },
        },
        { $sort: { totalCapacity: -1 } },
      ]),

      // Average allocated seats per room across all generated seating plans
      SeatingPlan.aggregate([
        { $unwind: '$rooms' },
        {
          $group: {
            _id: '$rooms.roomNumber',
            totalAllocations: { $sum: '$rooms.allocatedCount' },
            roomCapacity: { $first: '$rooms.capacity' },
            plansUsedIn: { $sum: 1 },
            avgAllocated: { $avg: '$rooms.allocatedCount' },
          },
        },
        {
          $project: {
            roomNumber: '$_id',
            roomCapacity: 1,
            avgAllocated: { $round: ['$avgAllocated', 1] },
            plansUsedIn: 1,
            utilizationRate: {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$avgAllocated', '$roomCapacity'] },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
        { $sort: { utilizationRate: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        byBuilding: buildingAgg,
        roomUtilization: roomUtilizationAgg,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Student Distribution by Department & Section using Aggregation
exports.getStudentDemographics = async (req, res) => {
  try {
    const [byDepartment, bySection, bySemester] = await Promise.all([
      // Department breakdown
      Student.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
            sections: { $addToSet: '$section' },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Section breakdown
      Student.aggregate([
        {
          $group: {
            _id: '$section',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Semester breakdown
      Student.aggregate([
        {
          $group: {
            _id: '$semester',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        byDepartment,
        bySection,
        bySemester,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
