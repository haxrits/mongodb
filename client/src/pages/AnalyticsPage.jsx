import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingDown,
  Building,
  Users,
  AlertCircle,
  Database,
  Layers,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';

export default function AnalyticsPage({ showToast }) {
  const [conflictData, setConflictData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [conflictsRes, roomsRes, studentsRes] = await Promise.all([
          api.getConflictAnalytics(),
          api.getRoomAnalytics(),
          api.getStudentDemographics(),
        ]);

        if (conflictsRes.success) setConflictData(conflictsRes.data);
        if (roomsRes.success) setRoomData(roomsRes.data);
        if (studentsRes.success) setStudentData(studentsRes.data);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-16 text-center text-slate-500">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-500" />
        <p className="mt-3 text-sm">Executing MongoDB aggregation pipelines...</p>
      </div>
    );
  }

  const deptList = studentData?.byDepartment || [];
  const maxDeptCount = Math.max(...deptList.map(d => d.count), 1);

  const sectionList = studentData?.bySection || [];
  const maxSecCount = Math.max(...sectionList.map(s => s.count), 1);

  const roomList = roomData?.roomUtilization || [];
  const summary = conflictData?.summary || {};
  const scoreTrend = conflictData?.scoreTrend || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header with MongoDB Aggregation badge */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-400" />
            <span>Optimization Analytics & Pipeline Metrics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics computed directly using MongoDB Atlas aggregation pipelines ($group, $match, $lookup, $unwind).
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs text-brand-300">
          <Database className="h-4 w-4 text-brand-400" />
          <span>Atlas Aggregation Engine</span>
        </div>
      </div>

      {/* Row 1: Student Demographics Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Department Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-400" />
              <h3 className="font-bold text-white text-base">Students per Department</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">$group by department</span>
          </div>

          <div className="mt-5 space-y-4">
            {deptList.map((d) => (
              <div key={d._id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{d._id}</span>
                  <span className="font-mono font-bold text-brand-400">{d.count} Students</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-500 transition-all duration-500"
                    style={{ width: `${(d.count / maxDeptCount) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500">
                  Sections: {d.sections?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Students per Section</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">$group by section</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            {sectionList.map((sec) => (
              <div
                key={sec._id}
                className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 text-center"
              >
                <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                  Section {sec._id}
                </span>
                <p className="mt-2 text-2xl font-extrabold font-mono text-white">{sec.count}</p>
                <p className="text-[11px] text-slate-400">Total Enrolled</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Room Utilization ($unwind + $group) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Examination Room Utilization</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">$unwind: '$rooms' ➔ $group</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {roomList.map((room) => (
            <div
              key={room.roomNumber}
              className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-base">{room.roomNumber}</span>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
                  {room.utilizationRate}% Capacity
                </span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${Math.min(100, room.utilizationRate)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                <div>
                  <span>Avg Allocated:</span>
                  <p className="font-mono text-white font-bold">{room.avgAllocated} Seats</p>
                </div>
                <div>
                  <span>Total Capacity:</span>
                  <p className="font-mono text-white font-bold">{room.roomCapacity} Seats</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Conflicts by Type & Score Progression */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Conflicts Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Conflicts Aggregated by Type</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">$group sums</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
              <span className="text-[10px] font-bold text-rose-300 uppercase">Section Conflicts</span>
              <p className="mt-1 text-2xl font-extrabold font-mono text-rose-400">
                {summary.totalSectionConflicts || 0}
              </p>
              <span className="text-[10px] text-slate-400">Weight: 10 pts each</span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
              <span className="text-[10px] font-bold text-amber-300 uppercase">Dept Conflicts</span>
              <p className="mt-1 text-2xl font-extrabold font-mono text-amber-400">
                {summary.totalDepartmentConflicts || 0}
              </p>
              <span className="text-[10px] text-slate-400">Weight: 5 pts each</span>
            </div>

            <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-4">
              <span className="text-[10px] font-bold text-orange-300 uppercase">Sequential Roll</span>
              <p className="mt-1 text-2xl font-extrabold font-mono text-orange-400">
                {summary.totalSequentialConflicts || 0}
              </p>
              <span className="text-[10px] text-slate-400">Weight: 5 pts each</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-950/60 p-4 text-xs text-slate-400 leading-relaxed border border-slate-800">
            <span className="font-semibold text-slate-300">Objective Function:</span> The optimizer uses simulated annealing and iterative coordinate swapping to push section conflicts toward 0 before balancing department dispersion.
          </div>
        </div>

        {/* Score History / Allocation Audit Log */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Allocation Runs Audit Log</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">AllocationLogs collection</span>
          </div>

          <div className="mt-4 divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
            {scoreTrend.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">No runs recorded in AllocationLog.</p>
            ) : (
              scoreTrend.map((log) => (
                <div key={log._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{log.examName}</p>
                    <span className="text-[11px] text-slate-500">
                      {new Date(log.generatedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400">Conflicts:</span>
                      <p className="font-mono font-semibold text-emerald-400">
                        {log.initialConflicts} → {log.finalConflicts}
                      </p>
                    </div>

                    <div className="w-14 text-center">
                      <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs font-mono font-bold text-brand-300">
                        {log.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
