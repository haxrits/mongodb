import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Sparkles,
  History,
  BarChart3,
  Server,
  Layers,
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, counts = {} }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, count: counts.students },
    { id: 'rooms', label: 'Rooms', icon: Building2, count: counts.rooms },
    { id: 'exams', label: 'Exams', icon: CalendarDays, count: counts.exams },
    { id: 'generate', label: 'Generate Seating', icon: Sparkles, highlight: true },
    { id: 'history', label: 'Seating History', icon: History, count: counts.plans },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </h2>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                      : item.highlight
                      ? 'text-brand-400 hover:bg-brand-500/10 hover:text-brand-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count !== null && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Algorithm Specs Box */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <Layers className="h-3.5 w-3.5 text-brand-400" />
            <span>Active Optimization</span>
          </div>
          <div className="space-y-1 text-[11px] leading-relaxed">
            <div className="flex justify-between">
              <span>Section Conflict:</span>
              <span className="font-mono text-rose-400">+10 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Dept Conflict:</span>
              <span className="font-mono text-amber-400">+5 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Sequential Roll:</span>
              <span className="font-mono text-orange-400">+5 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Adjacency:</span>
              <span className="font-mono text-emerald-400">8-Way (Diagonal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database connection footer */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Server className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <div className="truncate">
            <p className="font-medium text-slate-300 truncate">Atlas Cloud Database</p>
            <p className="text-[10px] text-slate-500 font-mono">exam_hall_optimizer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
