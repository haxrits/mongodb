const Student = require('../models/Student');
const Room = require('../models/Room');
const Exam = require('../models/Exam');
const SeatingPlan = require('../models/SeatingPlan');
const AllocationLog = require('../models/AllocationLog');

// Predefined realistic Indian student names
const firstNames = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Siddharth', 'Kavya', 'Aditya', 'Ishaan',
  'Sneha', 'Rajesh', 'Tanvi', 'Vikram', 'Neha', 'Arjun', 'Meera', 'Varun',
  'Pooja', 'Karan', 'Shreya', 'Amit', 'Divya', 'Gaurav', 'Ritu', 'Manish',
  'Deepika', 'Akash', 'Swati', 'Harsh', 'Anjali', 'Kunal', 'Nisha', 'Rahul',
  'Preeti', 'Sunil', 'Bhavna', 'Vikas', 'Simran', 'Sachin', 'Payal', 'Naveen',
];

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Nair', 'Gupta', 'Iyer', 'Deshmukh', 'Joshi',
  'Reddy', 'Kumar', 'Kulkarni', 'Singh', 'Chopra', 'Rao', 'Bhat', 'Mehta',
  'Agarwal', 'Chatterjee', 'Mishra', 'Pandey', 'Menon', 'Nambiar', 'Ghosh', 'Malhotra',
];

function generateRealisticStudents() {
  const students = [];
  const depts = [
    { name: 'Computer Science', code: 'CS', count: 45 },
    { name: 'Information Technology', code: 'IT', count: 45 },
    { name: 'Cyber Security', code: 'CY', count: 30 },
  ];
  const sections = ['A', 'B', 'C', 'D'];

  let globalIndex = 0;

  for (const dept of depts) {
    for (let i = 1; i <= dept.count; i++) {
      const rollNumber = `${dept.code}23${String(i).padStart(3, '0')}`;
      const fName = firstNames[(globalIndex * 3 + i) % firstNames.length];
      const lName = lastNames[(globalIndex * 5 + i) % lastNames.length];
      const name = `${fName} ${lName}`;
      const section = sections[(i - 1) % sections.length];
      const semester = 5;
      const year = 3;

      students.push({
        rollNumber,
        name,
        department: dept.name,
        section,
        semester,
        year,
      });
      globalIndex++;
    }
  }

  return students;
}

const demoRooms = [
  {
    roomNumber: 'LH-101',
    building: 'Main Academic Block',
    rows: 5,
    columns: 6,
    seatsPerBench: 2,
    capacity: 60,
    floor: 1,
  },
  {
    roomNumber: 'LH-102',
    building: 'Main Academic Block',
    rows: 4,
    columns: 5,
    seatsPerBench: 2,
    capacity: 40,
    floor: 1,
  },
  {
    roomNumber: 'CS-LAB-1',
    building: 'Technology Block',
    rows: 4,
    columns: 4,
    seatsPerBench: 2,
    capacity: 32,
    floor: 2,
  },
];

const demoExams = [
  {
    name: 'Mid Term Examination',
    subject: 'Database Management Systems',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    startTime: '10:00 AM',
    duration: 120,
    semester: 5,
    departments: ['Computer Science', 'Information Technology'],
    status: 'scheduled',
  },
  {
    name: 'Network Security Finals',
    subject: 'Cryptography & Network Security',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    startTime: '02:00 PM',
    duration: 180,
    semester: 5,
    departments: ['Computer Science', 'Cyber Security'],
    status: 'draft',
  },
];

exports.seedDatabase = async (req, res) => {
  try {
    const studentList = generateRealisticStudents();

    // 1. Bulk Upsert Students
    const studentOps = studentList.map((s) => ({
      updateOne: {
        filter: { rollNumber: s.rollNumber },
        update: { $set: s },
        upsert: true,
      },
    }));
    await Student.bulkWrite(studentOps);

    // 2. Upsert Rooms
    for (const r of demoRooms) {
      await Room.updateOne(
        { roomNumber: r.roomNumber },
        { $set: r },
        { upsert: true }
      );
    }

    // 3. Upsert Exams
    for (const e of demoExams) {
      await Exam.updateOne(
        { name: e.name },
        { $set: e },
        { upsert: true }
      );
    }

    const [totalStudents, totalRooms, totalExams] = await Promise.all([
      Student.countDocuments(),
      Room.countDocuments(),
      Exam.countDocuments(),
    ]);

    const result = {
      message: 'Demo dataset loaded successfully into MongoDB Atlas!',
      studentsCount: totalStudents,
      roomsCount: totalRooms,
      examsCount: totalExams,
      sampleExam: demoExams[0].name,
    };

    if (res) {
      return res.json({ success: true, data: result });
    }
    return result;
  } catch (error) {
    console.error('Database seed error:', error);
    if (res) {
      return res.status(500).json({ success: false, message: error.message });
    }
    throw error;
  }
};

exports.generateRealisticStudents = generateRealisticStudents;
exports.demoRooms = demoRooms;
exports.demoExams = demoExams;
