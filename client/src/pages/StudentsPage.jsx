import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Upload,
  Trash2,
  Edit2,
  Download,
  Filter,
  X,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';

export default function StudentsPage({ showToast, onDataChange }) {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ departments: [], sections: [], semesters: [] });
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSec, setSelectedSec] = useState('');
  const [selectedSem, setSelectedSem] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    department: 'Computer Science',
    section: 'A',
    semester: 5,
    year: 3,
  });

  const [csvText, setCsvText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (selectedDept) params.department = selectedDept;
      if (selectedSec) params.section = selectedSec;
      if (selectedSem) params.semester = selectedSem;
      params.limit = 200;

      const res = await api.getStudents(params);
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const res = await api.getStudentFilters();
      if (res.success) {
        setFilters(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDept, selectedSec, selectedSem]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.createStudent(formData);
      if (res.success) {
        showToast('Student registered successfully', 'success');
        setIsAddModalOpen(false);
        setFormData({
          rollNumber: '',
          name: '',
          department: 'Computer Science',
          section: 'A',
          semester: 5,
          year: 3,
        });
        fetchStudents();
        fetchFilterOptions();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      setIsSubmitting(true);
      const res = await api.updateStudent(selectedStudent._id, formData);
      if (res.success) {
        showToast('Student updated successfully', 'success');
        setIsEditModalOpen(false);
        fetchStudents();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id, roll) => {
    if (!window.confirm(`Are you sure you want to delete student ${roll}?`)) return;
    try {
      const res = await api.deleteStudent(id);
      if (res.success) {
        showToast(`Student ${roll} deleted`, 'success');
        fetchStudents();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleImportCSV = async () => {
    if (!csvText.trim()) {
      showToast('Please paste CSV content', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await api.importStudentsCSV(csvText);
      if (res.success) {
        showToast(res.message, 'success');
        setIsImportModalOpen(false);
        setCsvText('');
        fetchStudents();
        fetchFilterOptions();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sample = `rollNumber,name,department,section,semester,year\nCS23101,Vikram Joshi,Computer Science,A,5,3\nIT23102,Anjali Rao,Information Technology,B,5,3\nCY23103,Rohan Mehta,Cyber Security,C,5,3`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Top CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-brand-400" />
            <span>Student Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage enrolled students, section assignments, and bulk CSV rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 text-brand-400" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                rollNumber: '',
                name: '',
                department: 'Computer Science',
                section: 'A',
                semester: 5,
                year: 3,
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:from-brand-500 hover:to-indigo-500 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Roll Number or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 focus:border-brand-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Departments</option>
            {filters.departments?.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSec}
            onChange={(e) => setSelectedSec(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 focus:border-brand-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Sections</option>
            {filters.sections?.map((s) => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 focus:border-brand-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Semesters</option>
            {filters.semesters?.map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>

          {(searchQuery || selectedDept || selectedSec || selectedSem) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('');
                setSelectedSec('');
                setSelectedSem('');
              }}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Roll Number</th>
                <th className="px-4 py-3.5 font-semibold">Student Name</th>
                <th className="px-4 py-3.5 font-semibold">Department</th>
                <th className="px-4 py-3.5 font-semibold text-center">Section</th>
                <th className="px-4 py-3.5 font-semibold text-center">Semester</th>
                <th className="px-4 py-3.5 font-semibold text-center">Year</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-500" />
                    <p className="mt-2">Loading students from MongoDB Atlas...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No students match the current filters. Click "LOAD DEMO DATA" or "Add Student".
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-400">
                      {student.rollNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {student.department}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-bold text-slate-300 border border-slate-700">
                        {student.section}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-300 font-mono">
                      Sem {student.semester}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-400 font-mono">
                      Yr {student.year}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setFormData({
                              rollNumber: student.rollNumber,
                              name: student.name,
                              department: student.department,
                              section: student.section,
                              semester: student.semester,
                              year: student.year,
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-brand-400 transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student._id, student.rollNumber)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500">
          Showing {students.length} students loaded from MongoDB Atlas.
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Student</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS23050"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white uppercase focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                  <input
                    type="text"
                    required
                    maxLength="2"
                    placeholder="e.g. A"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white uppercase focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester (1-8)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year (1-4)</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Student</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateStudent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white uppercase focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                  <input
                    type="text"
                    required
                    maxLength="2"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white uppercase focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Bulk Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="h-5 w-5 text-brand-400" />
                <span>Bulk Import Students via CSV</span>
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Columns: rollNumber, name, department, section, semester, year</span>
                <button
                  onClick={downloadSampleCSV}
                  className="flex items-center gap-1 text-brand-400 hover:text-brand-300 cursor-pointer font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Sample CSV</span>
                </button>
              </div>

              <div>
                <textarea
                  rows="8"
                  placeholder="Paste your CSV content here..."
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportCSV}
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Importing...' : 'Upload & Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
