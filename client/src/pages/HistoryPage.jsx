import React, { useState, useEffect } from 'react';
import {
  History,
  Eye,
  Download,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoryPage({ onViewPlan, showToast, onDataChange }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getSeatingPlans();
      if (res.success) {
        setPlans(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeletePlan = async (id, examName) => {
    if (!window.confirm(`Are you sure you want to delete this historical seating plan?`)) return;
    try {
      const res = await api.deleteSeatingPlan(id);
      if (res.success) {
        showToast('Seating plan removed from Atlas', 'success');
        fetchHistory();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <History className="h-6 w-6 text-brand-400" />
          <span>Seating Plan History</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical record of all generated seating arrangements preserved in MongoDB Atlas.
        </p>
      </div>

      {/* History Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Examination</th>
                <th className="px-4 py-3.5 font-semibold">Exam Date</th>
                <th className="px-4 py-3.5 font-semibold text-center">Allocated Students</th>
                <th className="px-4 py-3.5 font-semibold text-center">Rooms</th>
                <th className="px-4 py-3.5 font-semibold text-center">Conflicts</th>
                <th className="px-4 py-3.5 font-semibold text-center">Score</th>
                <th className="px-4 py-3.5 font-semibold">Generated At</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-500" />
                    <p className="mt-2 text-xs">Loading seating history from MongoDB Atlas...</p>
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    No historical seating plans found in database. Go to "Generate Seating" to produce one.
                  </td>
                </tr>
              ) : (
                plans.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-white">{p.examId?.name || 'Exam Session'}</p>
                      <p className="text-[11px] text-brand-400">{p.examId?.subject || 'N/A'}</p>
                    </td>

                    <td className="px-4 py-3.5 text-slate-300">
                      {p.examId?.date ? new Date(p.examId.date).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-400">
                      {p.studentsAllocated} / {p.totalStudents}
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono text-slate-300">
                      {p.rooms?.length || 1} Rooms
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-mono font-semibold ${
                        p.conflicts > 0
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {p.conflicts}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono font-extrabold text-brand-400">
                      {p.score}%
                    </td>

                    <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                      {new Date(p.generatedAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewPlan(p._id)}
                          className="flex items-center gap-1 rounded-lg bg-brand-600/20 px-2.5 py-1 text-xs font-semibold text-brand-300 hover:bg-brand-600 hover:text-white transition-colors cursor-pointer border border-brand-500/30"
                          title="View Visual Seating Plan"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>VIEW</span>
                        </button>
                        <a
                          href={api.getExportCSVUrl(p._id)}
                          download
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                          title="Download CSV"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeletePlan(p._id, p.examId?.name)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Record"
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
          Showing {plans.length} persisted seating plans from MongoDB Atlas.
        </div>
      </div>

    </div>
  );
}
