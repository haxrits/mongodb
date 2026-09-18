import React from 'react';
import { AlertTriangle, X, ShieldAlert, ArrowRightLeft, CheckCircle } from 'lucide-react';

export default function ConflictModal({ conflictData, onClose }) {
  if (!conflictData) return null;

  const {
    seat,
    conflictsWith = [],
    roomNumber,
  } = conflictData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl shadow-rose-950/50">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Conflict Detected</span>
                <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-300">
                  Penalty Applied
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Seat <span className="font-mono text-slate-200">{seat.seatId}</span> in Room <span className="font-semibold text-slate-200">{roomNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Student (Current Seat) */}
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Primary Seat Student</span>
              <span className="rounded bg-brand-500/20 px-2 py-0.5 text-xs font-bold text-brand-300">
                Section {seat.section}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-white">{seat.name}</p>
                <p className="text-xs font-mono text-brand-400">{seat.rollNumber}</p>
              </div>
              <span className="text-xs text-slate-400">{seat.department}</span>
            </div>
          </div>

          {/* List of Conflicts with Neighboring Seats */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Violated Adjacencies ({conflictsWith.length})
            </p>

            {conflictsWith.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-center text-xs text-slate-400">
                Conflict flag recorded for residual soft constraint.
              </div>
            ) : (
              conflictsWith.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      {c.conflictType || 'Adjacency Conflict'}
                    </span>
                    <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 font-mono font-bold text-rose-300">
                      +{c.penalty || 10} Conflict Points
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-900/80 p-3 text-xs">
                    <div>
                      <p className="font-semibold text-white">{c.name || 'Neighboring Student'}</p>
                      <p className="font-mono text-slate-400">{c.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[11px] text-slate-400">{c.seatId}</p>
                      <span className="text-[10px] text-amber-400 font-medium">Neighboring Seat</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {c.conflictType === 'Same Section'
                      ? 'Students from the same section are seated directly adjacent. The optimizer attempted swap iterations, but prioritized filling room capacity.'
                      : c.conflictType === 'Sequential Roll Numbers'
                      ? 'Students have adjacent roll numbers (likely consecutive lab partners). Penalized to prevent exam collusion.'
                      : 'Students share the same department in close proximity.'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
