const Student = require('../models/Student');

// Get all students with search and filter
exports.getStudents = async (req, res) => {
  try {
    const { q, department, section, semester, page = 1, limit = 100 } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { rollNumber: { $regex: q.trim(), $options: 'i' } },
        { name: { $regex: q.trim(), $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (section) filter.section = section.toUpperCase();
    if (semester) filter.semester = Number(semester);

    const skip = (Number(page) - 1) * Number(limit);
    const [students, total] = await Promise.all([
      Student.find(filter).sort({ rollNumber: 1 }).skip(skip).limit(Number(limit)),
      Student.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single student
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { rollNumber, name, department, section, semester, year } = req.body;

    if (!rollNumber || !name || !department || !section || !semester || !year) {
      return res.status(400).json({
        success: false,
        message: 'All fields (rollNumber, name, department, section, semester, year) are required',
      });
    }

    const existing = await Student.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Student with roll number "${rollNumber}" already exists`,
      });
    }

    const student = await Student.create({
      rollNumber: rollNumber.trim().toUpperCase(),
      name: name.trim(),
      department: department.trim(),
      section: section.trim().toUpperCase(),
      semester: Number(semester),
      year: Number(year),
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { rollNumber, name, department, section, semester, year } = req.body;

    if (rollNumber) {
      const duplicate = await Student.findOne({
        rollNumber: rollNumber.trim().toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Roll number "${rollNumber}" is already in use by another student`,
        });
      }
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        ...(rollNumber && { rollNumber: rollNumber.trim().toUpperCase() }),
        ...(name && { name: name.trim() }),
        ...(department && { department: department.trim() }),
        ...(section && { section: section.trim().toUpperCase() }),
        ...(semester && { semester: Number(semester) }),
        ...(year && { year: Number(year) }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk CSV Import
exports.importStudentsCSV = async (req, res) => {
  try {
    let rows = [];

    // Parse either JSON body or raw CSV text
    if (req.body.csvText) {
      const lines = req.body.csvText.split(/\r?\n/).filter(line => line.trim());
      if (lines.length <= 1) {
        return res.status(400).json({ success: false, message: 'CSV text is empty or missing headers' });
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });
        rows.push(row);
      }
    } else if (Array.isArray(req.body.students)) {
      rows = req.body.students;
    } else {
      return res.status(400).json({ success: false, message: 'Provide csvText or students array in request body' });
    }

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rows found in CSV' });
    }

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const r of rows) {
      const rollNumber = (r.rollnumber || r.rollNumber || '').trim().toUpperCase();
      const name = (r.name || '').trim();
      const department = (r.department || '').trim();
      const section = (r.section || '').trim().toUpperCase();
      const semester = Number(r.semester || 1);
      const year = Number(r.year || Math.ceil(semester / 2));

      if (!rollNumber || !name || !department || !section) {
        skipped++;
        errors.push(`Row missing required fields: ${JSON.stringify(r)}`);
        continue;
      }

      try {
        await Student.updateOne(
          { rollNumber },
          { $set: { rollNumber, name, department, section, semester, year } },
          { upsert: true }
        );
        inserted++;
      } catch (err) {
        skipped++;
        errors.push(`Failed for ${rollNumber}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: `Import completed: ${inserted} students processed, ${skipped} skipped.`,
      data: { inserted, skipped, errors: errors.slice(0, 10) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Filter options (distinct departments, sections, semesters)
exports.getFilterOptions = async (req, res) => {
  try {
    const [departments, sections, semesters] = await Promise.all([
      Student.distinct('department'),
      Student.distinct('section'),
      Student.distinct('semester'),
    ]);
    res.json({
      success: true,
      data: {
        departments: departments.sort(),
        sections: sections.sort(),
        semesters: semesters.sort((a, b) => a - b),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
