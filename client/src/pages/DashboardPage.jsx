import React from 'react';
import {
  Users,
  Building2,
  CalendarDays,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DashboardPage({
  stats,
  latestPlan,
  onNavigate,
  onViewPlan,
  onSeedData,
  isSeeding,
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300 mb-3">
            <Zap className="h-3.5 w-3.5 text-amber-300" />
            <span>AI-Driven Heuristic Optimization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Exam Hall Seat Optimizer
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate exam cheating and room bottlenecks. Automatically allocate students across examination halls while strictly enforcing section separation, department dispersion, and capacity constraints.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('generate')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Seating Now</span>
            </button>
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            >
              <span>Load 120 Students Demo</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid BG */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-brand-600/10 blur-3xl"></div>
      </div>

      {/* Top 4 Primary Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? '...'}
          icon={Users}
          color="brand"
          subtitle="Registered in Atlas"
        />
        <StatCard
          title="Total Rooms"
          value={stats?.totalRooms ?? '...'}
          icon={Building2}
          color="emerald"
          subtitle={`${stats?.totalCapacity || 0} Total Seats`}
        />
        <StatCard
          title="Scheduled Exams"
          value={stats?.totalExams ?? '...'}
          icon={CalendarDays}
          color="purple"
          subtitle="Mid terms & finals"
        />
        <StatCard
          title="Generated Plans"
          value={stats?.totalPlans ?? '...'}
          icon={Layers}
          color="amber"
          subtitle="Saved in Atlas History"
        />
      </div>

      {/* Two Column Section: Latest Seating Plan & Quick Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Latest Seating Plan Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Latest Generated Seating Plan
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {latestPlan?.examName || 'No Seating Plan Generated Yet'}
              </h3>
            </div>
            {latestPlan && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                Score: {latestPlan.score}%
              </span>
            )}
          </div>

          {latestPlan ? (
            <div className="mt-5 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                  <p className="text-[11px] text-slate-400">Subject</p>
                  <p className="text-sm font-semibold text-white truncate mt-0.5">{latestPlan.subject || 'DBMS'}</p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                  <p className="text-[11px] text-slate-400">Students Allocated</p>
                  <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                    {latestPlan.studentsAllocated}/{latestPlan.totalStudents}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                  <p className="text-[11px] text-slate-400">Rooms Deployed</p>
                  <p className="text-sm font-semibold text-brand-400 mt-0.5">
                    {latestPlan.roomsCount || 3} Rooms
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                  <p className="text-[11px] text-slate-400">Conflicts Detected</p>
                  <p className={`text-sm font-semibold mt-0.5 ${latestPlan.conflicts > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {latestPlan.conflicts} Residual
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Generated on {new Date(latestPlan.generatedAt).toLocaleString()}
                </span>
                <button
                  id="btn-view-latest-plan"
                  onClick={() => onViewPlan(latestPlan._id)}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-500 transition-colors cursor-pointer"
                >
                  <span>VIEW SEATING PLAN</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Sparkles className="mx-auto h-8 w-8 text-slate-600" />
              <p className="text-sm">Click "LOAD DEMO DATA" or go to "Generate Seating" to run the optimizer.</p>
              <button
                onClick={() => onNavigate('generate')}
                className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-500 cursor-pointer"
              >
                Start Seating Optimization
              </button>
            </div>
          )}
        </div>

        {/* Algorithm Benchmarks Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider">
              <TrendingDown className="h-4 w-4" />
              <span>Optimization Benchmark</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Conflict Reduction</h3>
            <p className="text-xs text-slate-400 mt-1">
              Historical performance across runs in MongoDB Atlas.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Avg. Initial Conflicts:</span>
                  <span className="font-mono text-rose-400 font-semibold">{stats?.avgInitialConflicts || 0}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Avg. Final Conflicts:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{stats?.avgFinalConflicts || 0}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(10, ((stats?.avgFinalConflicts || 1) / Math.max(stats?.avgInitialConflicts || 1, 1)) * 100))}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 p-3 text-xs text-brand-300">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Iterative Heuristic Swap</span>
                </p>
                <p className="text-[11px] text-brand-300/80 mt-1">
                  Evaluates 8-neighbor matrices and swaps conflicted coordinates to maximize section diversity.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('analytics')}
            className="mt-6 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
