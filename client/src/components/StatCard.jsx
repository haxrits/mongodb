import React from 'react';

export default function StatCard({ title, value, icon: Icon, subtitle, color = 'brand' }) {
  const colorMap = {
    brand: 'from-brand-500/10 to-indigo-500/10 text-brand-400 border-brand-500/20',
    emerald: 'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/10 to-yellow-500/10 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/10 to-red-500/10 text-rose-400 border-rose-500/20',
    purple: 'from-purple-500/10 to-violet-500/10 text-purple-400 border-purple-500/20',
  };

  const selectedColor = colorMap[color] || colorMap.brand;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition-all hover:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br ${selectedColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
