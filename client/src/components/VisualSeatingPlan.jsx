import React, { useState } from 'react';
import {
  Download,
  Printer,
  AlertTriangle,
  Search,
  Users,
  CheckCircle2,
  Building,
  Info,
} from 'lucide-react';
import ConflictModal from './ConflictModal';
import { api } from '../services/api';

const sectionColors = {
  A: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bg: 'bg-emerald-950/30 border-emerald-700/40 hover:border-emerald-500',
    text: 'text-emerald-400',
  },
  B: {
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    bg: 'bg-sky-950/30 border-sky-700/40 hover:border-sky-500',
    text: 'text-sky-400',
  },
  C: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    bg: 'bg-purple-950/30 border-purple-700/40 hover:border-purple-500',
    text: 'text-purple-400',
  },
  D: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bg: 'bg-amber-950/30 border-amber-700/40 hover:border-amber-500',
    text: 'text-amber-400',
  },
};

export default function VisualSeatingPlan({ plan, onBack }) {
  if (!plan) return null;

  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('');
  const [inspectConflict, setInspectConflict] = useState(null);

  const rooms = plan.rooms || [];
  const currentRoom = rooms[activeRoomIndex] || rooms[0];

  if (!currentRoom) {
    return (
      <div className="p-8 text-center text-slate-400">
        No room arrangements found for this seating plan.
      </div>
    );
  }

  // Group seats by row
  const rowMap = new Map();
  for (const s of currentRoom.seats) {
    if (!rowMap.has(s.row)) rowMap.set(s.row, []);
    rowMap.get(s.row).push(s);
  }

  // Sort seats within each row by column
  for (const [, seatList] of rowMap.entries()) {
    seatList.sort((a, b) => a.column - b.column);
  }

  const rowsList = Array.from(rowMap.keys()).sort((a, b) => a - b);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    window.open(api.getExportCSVUrl(plan._id), '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
        <div>
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
            )}
            <h2 className="text-xl font-bold text-white">
              {plan.examId?.name || 'Examination Seating Plan'}
            </h2>
            <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-semibold text-brand-300 border border-brand-500/30">
              Score: {plan.score}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Subject: <span className="text-slate-200">{plan.examId?.subject || 'N/A'}</span> • Allocated:{' '}
            <span className="text-emerald-400 font-semibold">{plan.studentsAllocated}/{plan.totalStudents}</span> • Conflicts:{' '}
            <span className={plan.conflicts > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
              {plan.conflicts}
            </span>
          </p>
        </div>

        {/* Export and Print Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-brand-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:from-brand-500 hover:to-indigo-500 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Door Chart</span>
          </button>
        </div>
      </div>

      {/* Room Tabs */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {rooms.map((rm, idx) => (
            <button
              key={rm.roomNumber || idx}
              onClick={() => setActiveRoomIndex(idx)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeRoomIndex === idx
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>{rm.roomNumber}</span>
              <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px]">
                {rm.allocatedCount}/{rm.capacity}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search & Filter within the Visual Layout */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Highlight student or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-60 rounded-xl border border-slate-800 bg-slate-900/80 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedSectionFilter}
            onChange={(e) => setSelectedSectionFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 focus:border-brand-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>
        </div>
      </div>

      {/* Visual Section & Conflict Legend */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-300">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span>Section A</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-500"></span>
            <span>Section B</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-purple-500"></span>
            <span>Section C</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500"></span>
            <span>Section D</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500 ring-2 ring-rose-400/50"></span>
            <span className="text-rose-400 font-medium">Conflict (Click to Inspect)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-dashed border-slate-500"></span>
            <span>Vacant</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          Room Dimensions: {currentRoom.rows} Rows × {currentRoom.columns} Benches × {currentRoom.seatsPerBench || 2} Seats/Bench
        </div>
      </div>

      {/* EXAMINATION HALL VISUAL LAYOUT CONTAINER */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 shadow-2xl relative overflow-x-auto">
        
        {/* PRINT HEADER */}
        <div className="hidden print-only mb-6 text-center border-b pb-4">
          <h1 className="text-xl font-bold text-black uppercase">
            {plan.examId?.name || 'Examination Seating Chart'}
          </h1>
          <p className="text-sm text-gray-700">
            Room: {currentRoom.roomNumber} ({currentRoom.building}) • Date: {new Date(plan.examId?.date || plan.generatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* TEACHER'S BLACKBOARD / PODIUM (Top of Hall) */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="relative rounded-2xl border-2 border-emerald-600/40 bg-gradient-to-b from-emerald-950/60 to-slate-900/90 py-3.5 px-6 shadow-xl shadow-emerald-950/20 backdrop-blur">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest">
                [ TEACHER'S DESK / BLACKBOARD ]
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider mt-0.5">
              Front of Examination Hall
            </p>
          </div>
          {/* Subtle aisle down the center or indicator */}
          <div className="mx-auto h-4 w-0.5 bg-gradient-to-b from-emerald-500/40 to-transparent"></div>
        </div>

        {/* SEATING GRID BY ROWS */}
        <div className="space-y-6 min-w-[768px]">
          {rowsList.map((rowIdx) => {
            const seatsInRow = rowMap.get(rowIdx) || [];
            
            // Group seats into benches (e.g. benchCol 0, benchCol 1, etc.)
            const benches = [];
            const seatsPerBench = currentRoom.seatsPerBench || 2;
            const benchCount = currentRoom.columns;

            for (let b = 0; b < benchCount; b++) {
              const benchSeats = seatsInRow.filter(s => s.benchCol === b);
              benches.push(benchSeats);
            }

            return (
              <div key={rowIdx} className="flex items-center gap-4">
                
                {/* Row Label */}
                <div className="w-12 shrink-0 text-right">
                  <span className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-mono font-bold text-slate-400 border border-slate-800">
                    R{rowIdx + 1}
                  </span>
                </div>

                {/* Benches in this Row */}
                <div className="flex flex-1 items-center justify-around gap-4 sm:gap-6">
                  {benches.map((benchSeats, bIdx) => (
                    <div
                      key={bIdx}
                      className="relative flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-2 shadow-inner"
                    >
                      {/* Bench Label */}
                      <span className="absolute -top-2.5 left-3 rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono text-slate-400 uppercase">
                        B{bIdx + 1}
                      </span>

                      {/* Seats in this Bench */}
                      {benchSeats.map((seat) => {
                        const isConflicted = seat.hasConflict;
                        const isVacant = !seat.studentId && !seat.rollNumber;
                        const secStyle = sectionColors[seat.section] || {
                          badge: 'bg-slate-700 text-slate-300',
                          bg: 'bg-slate-900/60 border-slate-700',
                          text: 'text-slate-300',
                        };

                        // Search & filter matching
                        const matchesQuery = searchQuery && (
                          (seat.rollNumber && seat.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (seat.name && seat.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        );

                        const matchesSection = selectedSectionFilter && seat.section === selectedSectionFilter;
                        const isHighlighted = matchesQuery || matchesSection;

                        return (
                          <div
                            key={seat.seatId}
                            onClick={() => {
                              if (isConflicted) {
                                setInspectConflict({
                                  seat,
                                  conflictsWith: seat.conflictsWith,
                                  roomNumber: currentRoom.roomNumber,
                                });
                              }
                            }}
                            className={`seat-box group relative flex flex-col justify-between rounded-xl border p-2.5 transition-all duration-150 w-32 h-24 ${
                              isVacant
                                ? 'border-dashed border-slate-700/60 bg-slate-950/40 text-slate-600'
                                : isConflicted
                                ? 'border-rose-500 bg-rose-950/30 shadow-lg shadow-rose-950/50 ring-2 ring-rose-500/40 hover:scale-105 cursor-pointer'
                                : isHighlighted
                                ? 'border-yellow-400 bg-yellow-500/10 ring-2 ring-yellow-400 shadow-md'
                                : `${secStyle.bg} hover:scale-102 cursor-default`
                            }`}
                          >
                            {/* Seat Top Bar */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-medium text-slate-400">
                                S{seat.benchPos || 1}
                              </span>

                              {isConflicted && (
                                <span className="flex items-center gap-1 rounded bg-rose-500/20 px-1 py-0.5 text-[9px] font-bold text-rose-300 ring-1 ring-rose-500/40 animate-pulse">
                                  <AlertTriangle className="h-3 w-3 text-rose-400" />
                                  Conflict
                                </span>
                              )}

                              {!isVacant && !isConflicted && seat.section && (
                                <span className={`rounded px-1.5 py-0.2 text-[10px] font-bold border ${secStyle.badge}`}>
                                  Sec {seat.section}
                                </span>
                              )}
                            </div>

                            {/* Seat Middle: Roll Number & Name */}
                            {isVacant ? (
                              <div className="text-center my-auto">
                                <span className="text-[11px] uppercase font-mono tracking-wider text-slate-600">
                                  Vacant
                                </span>
                              </div>
                            ) : (
                              <div className="my-auto truncate">
                                <p className="font-mono text-xs font-extrabold text-white tracking-tight">
                                  {seat.rollNumber}
                                </p>
                                <p className="text-[11px] font-medium text-slate-300 truncate mt-0.5" title={seat.name}>
                                  {seat.name}
                                </p>
                              </div>
                            )}

                            {/* Seat Bottom: Dept abbreviation */}
                            {!isVacant && (
                              <div className="flex items-center justify-between text-[9px] text-slate-400">
                                <span className="truncate max-w-[90px]">{seat.department}</span>
                                <span className="font-mono text-slate-400">{seat.seatId.split('-').slice(-1)[0]}</span>
                              </div>
                            )}

                            {/* Hover Tooltip */}
                            {!isVacant && (
                              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-48 rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs shadow-2xl group-hover:block z-30">
                                <p className="font-bold text-white">{seat.name}</p>
                                <p className="font-mono text-brand-400 text-[11px]">{seat.rollNumber}</p>
                                <div className="mt-1 text-[10px] text-slate-400 space-y-0.5">
                                  <p>Dept: {seat.department}</p>
                                  <p>Section: {seat.section}</p>
                                  <p>Seat: {seat.seatId}</p>
                                  {isConflicted && (
                                    <p className="text-rose-400 font-semibold mt-1">
                                      ⚠ Conflict: Click to view details
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Conflict Inspector Modal */}
      <ConflictModal
        conflictData={inspectConflict}
        onClose={() => setInspectConflict(null)}
      />

    </div>
  );
}
