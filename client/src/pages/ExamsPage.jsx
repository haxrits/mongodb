import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';

export default function ExamsPage({ showToast, onNavigateToGenerate, onDataChange }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    duration: 120,
    semester: 5,
    departments: ['Computer Science', 'Information Technology'],
    status: 'scheduled',
  });

  const [deptInput, setDeptInput] = useState('Computer Science, Information Technology');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await api.getExams();
      if (res.success) {
        setExams(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const depts = deptInput.split(',').map(d => d.trim()).filter(Boolean);
      const payload = { ...formData, departments: depts };

      const res = await api.createExam(payload);
      if (res.success) {
        showToast(`Exam "${res.data.name}" created`, 'success');
        setIsAddModalOpen(false);
        fetchExams();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    if (!selectedExam) return;
    try {
      setIsSubmitting(true);
      const depts = deptInput.split(',').map(d => d.trim()).filter(Boolean);
      const payload = { ...formData, departments: depts };

      const res = await api.updateExam(selectedExam._id, payload);
      if (res.success) {
        showToast(`Exam "${res.data.name}" updated`, 'success');
        setIsEditModalOpen(false);
        fetchExams();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExam = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete exam "${name}"?`)) return;
    try {
      const res = await api.deleteExam(id);
      if (res.success) {
        showToast(`Exam deleted`, 'success');
        fetchExams();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-purple-400" />
            <span>Examinations Schedule</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create exams, define subjects, semesters, and departments for seating generation.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              subject: '',
              date: new Date().toISOString().split('T')[0],
              startTime: '10:00 AM',
              duration: 120,
              semester: 5,
              departments: ['Computer Science', 'Information Technology'],
              status: 'scheduled',
            });
            setDeptInput('Computer Science, Information Technology');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Exam</span>
        </button>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-500">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-purple-500" />
          <p className="mt-2 text-xs">Loading exams from MongoDB Atlas...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          No exams scheduled yet. Click "LOAD DEMO DATA" or "Create New Exam".
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm transition-all hover:border-slate-700 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/20">
                      Semester {exam.semester}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      exam.status === 'scheduled'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {exam.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white">{exam.name}</h3>
                  <p className="text-xs text-brand-400 font-medium">{exam.subject}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedExam(exam);
                      setFormData({
                        name: exam.name,
                        subject: exam.subject,
                        date: new Date(exam.date).toISOString().split('T')[0],
                        startTime: exam.startTime || '10:00 AM',
                        duration: exam.duration || 120,
                        semester: exam.semester || 5,
                        departments: exam.departments || [],
                        status: exam.status || 'scheduled',
                      });
                      setDeptInput((exam.departments || []).join(', '));
                      setIsEditModalOpen(true);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    title="Edit Exam"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam._id, exam.name)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Exam"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Exam Date</span>
                  <p className="font-semibold text-white mt-0.5">
                    {new Date(exam.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Start Time</span>
                  <p className="font-semibold text-white mt-0.5">{exam.startTime || '10:00 AM'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Duration</span>
                  <p className="font-semibold text-white mt-0.5">{exam.duration} mins</p>
                </div>
              </div>

              {/* Departments */}
              <div className="mt-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Participating Departments
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(exam.departments || []).map((d) => (
                    <span
                      key={d}
                      className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 border border-slate-700"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Generate Seating */}
              <div className="mt-5 border-t border-slate-800 pt-4 flex justify-end">
                <button
                  onClick={() => onNavigateToGenerate(exam._id)}
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-500 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Optimize Seating for this Exam</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Exam Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Schedule New Examination</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateExam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid Term Examination"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="30"
                    max="360"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Departments (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Computer Science, Information Technology"
                  value={deptInput}
                  onChange={(e) => setDeptInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
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
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Examination</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateExam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Departments</label>
                <input
                  type="text"
                  required
                  value={deptInput}
                  onChange={(e) => setDeptInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
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
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Updating...' : 'Update Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
