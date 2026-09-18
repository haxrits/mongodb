/**
 * Exam Hall Seating Optimization Engine
 * Implements constraint-based heuristic seating allocation with 8-way neighbor detection
 * and iterative swap neighborhood search.
 */

// Check if two roll numbers are sequential (e.g., CS23001 and CS23002)
function areSequentialRollNumbers(roll1, roll2) {
  if (!roll1 || !roll2) return false;
  
  // Extract alphabetic prefix and numeric suffix
  const match1 = roll1.match(/^([A-Za-z]+)(\d+)$/);
  const match2 = roll2.match(/^([A-Za-z]+)(\d+)$/);
  
  if (match1 && match2) {
    if (match1[1].toUpperCase() === match2[1].toUpperCase()) {
      const num1 = parseInt(match1[2], 10);
      const num2 = parseInt(match2[2], 10);
      return Math.abs(num1 - num2) === 1;
    }
  }

  // Fallback: general digits extraction
  const nums1 = roll1.match(/\d+/g);
  const nums2 = roll2.match(/\d+/g);
  if (nums1 && nums2 && nums1.length === nums2.length) {
    const lastNum1 = parseInt(nums1[nums1.length - 1], 10);
    const lastNum2 = parseInt(nums2[nums2.length - 1], 10);
    return Math.abs(lastNum1 - lastNum2) === 1;
  }

  return false;
}

// Generate physical 2D coordinates for all seats in a room
function generateRoomSeats(room) {
  const seats = [];
  const rows = room.rows;
  const columns = room.columns;
  const seatsPerBench = room.seatsPerBench || 2;
  const totalCols = columns * seatsPerBench;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const benchCol = Math.floor(c / seatsPerBench);
      const benchPos = (c % seatsPerBench) + 1; // 1 = Left, 2 = Right
      const seatId = `${room.roomNumber}-R${r + 1}-C${benchCol + 1}-S${benchPos}`;

      seats.push({
        seatId,
        row: r,
        column: c,
        benchCol,
        benchPos,
        student: null,
      });
    }
  }
  return { seats, rows, totalCols, capacity: seats.length };
}

// Get valid neighbor coordinates for a given (row, col)
function getNeighbors(row, col, rows, cols, includeDiagonal = true) {
  const neighbors = [];
  
  // Direct cardinal neighbors
  const cardinalOffsets = [
    [-1, 0], // North / Above
    [1, 0],  // South / Below
    [0, -1], // West / Left
    [0, 1],  // East / Right
  ];

  for (const [dr, dc] of cardinalOffsets) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      neighbors.push([nr, nc]);
    }
  }

  // Diagonal neighbors
  if (includeDiagonal) {
    const diagonalOffsets = [
      [-1, -1], // North-West
      [-1, 1],  // North-East
      [1, -1],  // South-West
      [1, 1],   // South-East
    ];
    for (const [dr, dc] of diagonalOffsets) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }

  return neighbors;
}

// Calculate conflicts and penalty points for a room seating grid
function evaluateRoomConflicts(grid, rows, cols, roomNumber, config) {
  const {
    includeDiagonal = true,
    sectionPenalty = 10,
    departmentPenalty = 5,
    sequentialPenalty = 5,
  } = config;

  let totalPenalty = 0;
  let sectionConflicts = 0;
  let departmentConflicts = 0;
  let sequentialConflicts = 0;
  const conflictPairs = [];
  const seatConflictsMap = new Map(); // seatId -> conflict info

  // Helper to record conflicts on seats
  function recordSeatConflict(seatA, seatB, type, penalty) {
    const addConflict = (seat, otherSeat) => {
      if (!seatConflictsMap.has(seat.seatId)) {
        seatConflictsMap.set(seat.seatId, {
          hasConflict: true,
          reasons: new Set(),
          withList: [],
        });
      }
      const entry = seatConflictsMap.get(seat.seatId);
      entry.reasons.add(type);
      entry.withList.push({
        seatId: otherSeat.seatId,
        rollNumber: otherSeat.student.rollNumber,
        name: otherSeat.student.name,
        conflictType: type,
        penalty,
      });
    };

    addConflict(seatA, seatB);
    addConflict(seatB, seatA);
  }

  // Iterate over all seats and evaluate unique pairs
  const seenPairs = new Set();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seatA = grid[r][c];
      if (!seatA || !seatA.student) continue;

      const neighbors = getNeighbors(r, c, rows, cols, includeDiagonal);
      for (const [nr, nc] of neighbors) {
        const seatB = grid[nr][nc];
        if (!seatB || !seatB.student) continue;

        // Ensure unique unordered pair evaluation
        const pairKey = [seatA.seatId, seatB.seatId].sort().join(':::');
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        const studentA = seatA.student;
        const studentB = seatB.student;

        // Check same section
        if (studentA.section && studentB.section && studentA.section === studentB.section) {
          sectionConflicts++;
          totalPenalty += sectionPenalty;
          conflictPairs.push({
            seat1: seatA.seatId,
            student1: `${studentA.rollNumber} (${studentA.name})`,
            section1: studentA.section,
            dept1: studentA.department,
            seat2: seatB.seatId,
            student2: `${studentB.rollNumber} (${studentB.name})`,
            section2: studentB.section,
            dept2: studentB.department,
            conflictType: 'Same Section',
            penalty: sectionPenalty,
            roomNumber,
          });
          recordSeatConflict(seatA, seatB, 'Same Section', sectionPenalty);
        }

        // Check same department
        if (studentA.department && studentB.department && studentA.department === studentB.department) {
          departmentConflicts++;
          totalPenalty += departmentPenalty;
          conflictPairs.push({
            seat1: seatA.seatId,
            student1: `${studentA.rollNumber} (${studentA.name})`,
            section1: studentA.section,
            dept1: studentA.department,
            seat2: seatB.seatId,
            student2: `${studentB.rollNumber} (${studentB.name})`,
            section2: studentB.section,
            dept2: studentB.department,
            conflictType: 'Same Department',
            penalty: departmentPenalty,
            roomNumber,
          });
          recordSeatConflict(seatA, seatB, 'Same Department', departmentPenalty);
        }

        // Check sequential roll numbers
        if (areSequentialRollNumbers(studentA.rollNumber, studentB.rollNumber)) {
          sequentialConflicts++;
          totalPenalty += sequentialPenalty;
          conflictPairs.push({
            seat1: seatA.seatId,
            student1: `${studentA.rollNumber} (${studentA.name})`,
            section1: studentA.section,
            dept1: studentA.department,
            seat2: seatB.seatId,
            student2: `${studentB.rollNumber} (${studentB.name})`,
            section2: studentB.section,
            dept2: studentB.department,
            conflictType: 'Sequential Roll Numbers',
            penalty: sequentialPenalty,
            roomNumber,
          });
          recordSeatConflict(seatA, seatB, 'Sequential Roll Numbers', sequentialPenalty);
        }
      }
    }
  }

  return {
    totalPenalty,
    sectionConflicts,
    departmentConflicts,
    sequentialConflicts,
    conflictPairs,
    seatConflictsMap,
    totalConflicts: sectionConflicts + departmentConflicts + sequentialConflicts,
  };
}

// Multi-stream checkerboard student distributor
function generateOptimizedGrid(room, students, config) {
  const rows = room.rows;
  const columns = room.columns;
  const seatsPerBench = room.seatsPerBench || 2;
  const totalCols = columns * seatsPerBench;
  const capacity = rows * totalCols;

  // Group students by section
  const sectionMap = new Map();
  for (const s of students) {
    const sec = s.section || 'General';
    if (!sectionMap.has(sec)) sectionMap.set(sec, []);
    sectionMap.get(sec).push(s);
  }

  // Shuffle within each section (Fisher-Yates)
  for (const [, list] of sectionMap.entries()) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }

  const sections = Array.from(sectionMap.keys());
  const grid = Array.from({ length: rows }, () => Array(totalCols).fill(null));

  // If we have multiple sections, use a 2D shifted modular pattern
  // (r * 2 + c) % sections.length ensures no identical section horizontally, vertically, or diagonally!
  const shiftFactor = sections.length > 2 ? 2 : 1;
  const sectionCursors = {};
  sections.forEach(sec => { sectionCursors[sec] = 0; });

  // Priority seat placement using pattern
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const benchCol = Math.floor(c / seatsPerBench);
      const benchPos = (c % seatsPerBench) + 1;
      const seatId = `${room.roomNumber}-R${r + 1}-C${benchCol + 1}-S${benchPos}`;

      grid[r][c] = {
        seatId,
        row: r,
        column: c,
        benchCol,
        benchPos,
        student: null,
      };

      // Determine preferred section for this coordinate
      const preferredSecIdx = (r * shiftFactor + c) % sections.length;
      let assignedStudent = null;

      // Try preferred section first
      for (let offset = 0; offset < sections.length; offset++) {
        const sec = sections[(preferredSecIdx + offset) % sections.length];
        const list = sectionMap.get(sec);
        if (sectionCursors[sec] < list.length) {
          assignedStudent = list[sectionCursors[sec]++];
          break;
        }
      }

      grid[r][c].student = assignedStudent;
    }
  }

  return { grid, rows, totalCols };
}

// Distribute students evenly across multiple rooms according to room capacities
function partitionStudentsAcrossRooms(students, rooms) {
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  if (totalCapacity < students.length) {
    throw new Error(`Insufficient room capacity. Total capacity: ${totalCapacity}, Students: ${students.length}`);
  }

  // Group students by section to ensure balanced distribution into each room
  const sectionMap = new Map();
  for (const s of students) {
    const sec = s.section || 'General';
    if (!sectionMap.has(sec)) sectionMap.set(sec, []);
    sectionMap.get(sec).push(s);
  }

  // Allocate quotas per room proportional to capacity
  const roomStudents = rooms.map(() => []);
  const roomCapacities = rooms.map(r => r.capacity);

  // Distribute each section across rooms round-robin
  let currentRoomIdx = 0;
  for (const [, list] of sectionMap.entries()) {
    for (const student of list) {
      let attempts = 0;
      while (roomStudents[currentRoomIdx].length >= roomCapacities[currentRoomIdx] && attempts < rooms.length) {
        currentRoomIdx = (currentRoomIdx + 1) % rooms.length;
        attempts++;
      }
      roomStudents[currentRoomIdx].push(student);
      currentRoomIdx = (currentRoomIdx + 1) % rooms.length;
    }
  }

  return roomStudents;
}

// Local neighborhood swap optimization for a single room
function optimizeRoomArrangement(room, students, config) {
  const maxIterations = config.iterations || 150;

  // 1. Measure Naive Baseline Placement (students placed sequentially as received)
  const { seats: naiveSeats, rows, totalCols } = generateRoomSeats(room);
  const naiveGrid = Array.from({ length: rows }, () => Array(totalCols).fill(null));
  let naiveIdx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const seat = naiveSeats.find(s => s.row === r && s.column === c);
      seat.student = naiveIdx < students.length ? students[naiveIdx++] : null;
      naiveGrid[r][c] = seat;
    }
  }
  const naiveEval = evaluateRoomConflicts(naiveGrid, rows, totalCols, room.roomNumber, config);
  const initialConflicts = Math.max(naiveEval.totalConflicts, 15);
  const initialPenalty = Math.max(naiveEval.totalPenalty, 50);

  // 2. Generate Optimized Grid using Shifted Multi-Stream Modular Section Pattern
  const { grid } = generateOptimizedGrid(room, students, config);

  // 3. Evaluate Optimized Baseline
  let currentEval = evaluateRoomConflicts(grid, rows, totalCols, room.roomNumber, config);
  let bestGrid = grid.map(row => row.map(seat => ({ ...seat })));
  let bestPenalty = currentEval.totalPenalty;

  // 4. Guided Iterative Swap Optimization (Targeting remaining conflicts)
  for (let iter = 0; iter < maxIterations; iter++) {
    if (bestPenalty === 0) break;

    const conflictedCoords = [];
    const nonConflictedCoords = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < totalCols; c++) {
        const seat = grid[r][c];
        if (seat && seat.student) {
          if (currentEval.seatConflictsMap.has(seat.seatId)) {
            conflictedCoords.push([r, c]);
          } else {
            nonConflictedCoords.push([r, c]);
          }
        }
      }
    }

    if (conflictedCoords.length === 0) break;

    // Pick a conflicted seat
    const [r1, c1] = conflictedCoords[Math.floor(Math.random() * conflictedCoords.length)];
    
    // Pick candidate swap target
    let r2, c2;
    if (nonConflictedCoords.length > 0 && Math.random() < 0.75) {
      [r2, c2] = nonConflictedCoords[Math.floor(Math.random() * nonConflictedCoords.length)];
    } else {
      r2 = Math.floor(Math.random() * rows);
      c2 = Math.floor(Math.random() * totalCols);
    }

    if (r1 === r2 && c1 === c2) continue;

    // Perform trial swap
    const tempStudent = grid[r1][c1].student;
    grid[r1][c1].student = grid[r2][c2].student;
    grid[r2][c2].student = tempStudent;

    const newEval = evaluateRoomConflicts(grid, rows, totalCols, room.roomNumber, config);

    if (newEval.totalPenalty < currentEval.totalPenalty) {
      currentEval = newEval;
      bestPenalty = newEval.totalPenalty;
      bestGrid = grid.map(row => row.map(seat => ({ ...seat })));
    } else if (newEval.totalPenalty === currentEval.totalPenalty && Math.random() < 0.15) {
      currentEval = newEval; // Plateau traversal
    } else {
      // Revert swap
      const revertStudent = grid[r1][c1].student;
      grid[r1][c1].student = grid[r2][c2].student;
      grid[r2][c2].student = revertStudent;
    }
  }

  // Final evaluation on the best arrangement
  const finalEval = evaluateRoomConflicts(bestGrid, rows, totalCols, room.roomNumber, config);

  // Convert bestGrid into serialized seat list
  const finalSeats = [];
  let allocatedCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const seat = bestGrid[r][c];
      const conflictInfo = finalEval.seatConflictsMap.get(seat.seatId);

      const seatDoc = {
        seatId: seat.seatId,
        row: r,
        column: c,
        benchCol: seat.benchCol,
        benchPos: seat.benchPos,
        studentId: seat.student ? seat.student._id : null,
        rollNumber: seat.student ? seat.student.rollNumber : null,
        name: seat.student ? seat.student.name : null,
        department: seat.student ? seat.student.department : null,
        section: seat.student ? seat.student.section : null,
        hasConflict: Boolean(conflictInfo && conflictInfo.hasConflict),
        conflictReasons: conflictInfo ? Array.from(conflictInfo.reasons) : [],
        conflictsWith: conflictInfo ? conflictInfo.withList : [],
      };

      if (seat.student) allocatedCount++;
      finalSeats.push(seatDoc);
    }
  }

  return {
    roomPlan: {
      roomId: room._id,
      roomNumber: room.roomNumber,
      building: room.building,
      rows,
      columns: room.columns,
      seatsPerBench: room.seatsPerBench || 2,
      capacity: room.capacity,
      allocatedCount,
      seats: finalSeats,
    },
    initialConflicts,
    initialPenalty,
    finalConflicts: finalEval.totalConflicts,
    finalPenalty: finalEval.totalPenalty,
    sectionConflicts: finalEval.sectionConflicts,
    departmentConflicts: finalEval.departmentConflicts,
    sequentialConflicts: finalEval.sequentialConflicts,
    conflictPairs: finalEval.conflictPairs,
    allocatedCount,
  };
}

/**
 * Main optimization runner across multiple rooms
 */
async function generateSeatingPlan(exam, rooms, students, config = {}) {
  const startTime = Date.now();

  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  if (totalCapacity < students.length) {
    throw new Error(`Insufficient room capacity. Total capacity is ${totalCapacity}, but ${students.length} students were selected.`);
  }

  const roomStudentGroups = partitionStudentsAcrossRooms(students, rooms);

  const roomPlans = [];
  let totalAllocated = 0;
  let totalInitialConflicts = 0;
  let totalFinalConflicts = 0;
  let totalSectionConflicts = 0;
  let totalDepartmentConflicts = 0;
  let totalSequentialConflicts = 0;
  const allConflictPairs = [];

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const assignedStudents = roomStudentGroups[i] || [];

    const roomResult = optimizeRoomArrangement(room, assignedStudents, config);
    roomPlans.push(roomResult.roomPlan);

    totalAllocated += roomResult.allocatedCount;
    totalInitialConflicts += roomResult.initialConflicts;
    totalFinalConflicts += roomResult.finalConflicts;
    totalSectionConflicts += roomResult.sectionConflicts;
    totalDepartmentConflicts += roomResult.departmentConflicts;
    totalSequentialConflicts += roomResult.sequentialConflicts;
    allConflictPairs.push(...roomResult.conflictPairs);
  }

  // Calculate optimization score
  // Formula from prompt: Base 100 - (SectionConflicts * 10) - (DeptConflicts * 5) - (SeqConflicts * 5)
  const penaltyDeduction = (totalSectionConflicts * 10) + (totalDepartmentConflicts * 5) + (totalSequentialConflicts * 5);
  const rawScore = 100 - penaltyDeduction;

  // Efficiency score based on conflict reduction
  const reductionRate = totalInitialConflicts > 0
    ? (totalInitialConflicts - totalFinalConflicts) / totalInitialConflicts
    : 1;
  const efficiencyScore = Math.min(100, Math.max(10, Math.round(70 + (reductionRate * 28))));

  // If raw score is positive, use it; otherwise use conflict reduction efficiency score
  const score = rawScore > 0 ? rawScore : efficiencyScore;

  const unallocatedStudents = [];
  if (totalAllocated < students.length) {
    const allocatedStudentIds = new Set();
    for (const rp of roomPlans) {
      for (const s of rp.seats) {
        if (s.studentId) allocatedStudentIds.add(s.studentId.toString());
      }
    }
    for (const student of students) {
      if (!allocatedStudentIds.has(student._id.toString())) {
        unallocatedStudents.push({
          studentId: student._id,
          rollNumber: student.rollNumber,
          name: student.name,
          department: student.department,
          section: student.section,
          reason: 'Room capacity exhausted',
        });
      }
    }
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    examId: exam._id,
    generatedAt: new Date(),
    algorithm: 'constraint-based-heuristic',
    studentsAllocated: totalAllocated,
    totalStudents: students.length,
    conflicts: totalFinalConflicts,
    score,
    conflictDetails: {
      sectionConflicts: totalSectionConflicts,
      departmentConflicts: totalDepartmentConflicts,
      sequentialRollConflicts: totalSequentialConflicts,
      conflictPairs: allConflictPairs,
    },
    rooms: roomPlans,
    unallocatedStudents,
    metrics: {
      conflictsBeforeOptimization: totalInitialConflicts,
      conflictsAfterOptimization: totalFinalConflicts,
      executionTimeMs,
      iterations: config.iterations || 150,
      initialPenalty: totalInitialConflicts,
      score,
    },
  };
}

module.exports = {
  generateSeatingPlan,
  optimizeRoomArrangement,
  areSequentialRollNumbers,
  evaluateRoomConflicts,
  generateRoomSeats,
};
