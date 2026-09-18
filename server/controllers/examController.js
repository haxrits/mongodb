const Exam = require('../models/Exam');

// Get all exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single exam
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new exam
exports.createExam = async (req, res) => {
  try {
    const { name, subject, date, startTime, duration = 120, semester, departments, status } = req.body;

    if (!name || !subject || !date || !semester) {
      return res.status(400).json({
        success: false,
        message: 'name, subject, date, and semester are required fields',
      });
    }

    const exam = await Exam.create({
      name: name.trim(),
      subject: subject.trim(),
      date: new Date(date),
      startTime: startTime || '10:00',
      duration: Number(duration),
      semester: Number(semester),
      departments: Array.isArray(departments) ? departments : [departments].filter(Boolean),
      status: status || 'draft',
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const { name, subject, date, startTime, duration, semester, departments, status } = req.body;

    const updated = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name: name.trim() }),
        ...(subject && { subject: subject.trim() }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(semester !== undefined && { semester: Number(semester) }),
        ...(departments && { departments: Array.isArray(departments) ? departments : [departments] }),
        ...(status && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
