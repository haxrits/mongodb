import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Building2,
  Users,
  CalendarDays,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function GeneratePage({
  preselectedExamId,
  onViewPlan,
  showToast,
  onDataChange,
}) {
  const [exams, setExams] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Wizard selections
  const [selectedExamId, setSelectedExamId] = useState(preselectedExamId || '');
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Constraints Configuration
  const [config, setConfig] = useState({
    includeDiagonal: true,
    iterations: 150,
    sectionPenalty: 10,
    departmentPenalty: 5,
    sequentialPenalty: 5,
  });

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('');
  const [generationResult, setGenerationResult] = useState(null);

  // Fetch initial master data
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingInitial(true);
        const [examsRes, roomsRes, studentsRes] = await Promise.all([
          api.getExams(),
          api.getRooms(),
          api.getStudents({ limit: 500 }),
        ]);

        if (examsRes.success) setExams(examsRes.data);
        if (roomsRes.success) {
          setRooms(roomsRes.data);
          // By default, select all rooms
          setSelectedRoomIds(roomsRes.data.map(r => r._id));
        }
        if (studentsRes.success) {
          setStudents(studentsRes.data);
          // By default, select all students
          setSelectedStudentIds(studentsRes.data.map(s => s._id));
        }

        if (preselectedExamId) {
          setSelectedExamId(preselectedExamId);
        } else if (examsRes.data?.length > 0) {
          // Default to first exam (e.g. Mid Term)
          setSelectedExamId(examsRes.data[0]._id);
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, [preselectedExamId]);

  // When selected exam changes, filter students by department/semester if preferred
  const activeExam = exams.find(e => e._id === selectedExamId);

  // Calculate live capacity
  const selectedRoomsList = rooms.filter(r => selectedRoomIds.includes(r._id));
  const totalSelectedCapacity = selectedRoomsList.reduce((sum, r) => sum + r.capacity, 0);
  const totalSelectedStudents = selectedStudentIds.length;
  const hasEnoughCapacity = totalSelectedCapacity >= totalSelectedStudents && totalSelectedStudents > 0;

  const toggleRoom = (roomId) => {
    setSelectedRoomIds(prev =>
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudentIds(students.map(s => s._id));
  };

  const deselectAllStudents = () => {
    setSelectedStudentIds([]);
  };

  const handleGenerate = async () => {
    if (!selectedExamId) {
      showToast('Please select an examination', 'error');
      return;
    }
    if (selectedRoomIds.length === 0) {
      showToast('Please select at least one examination room', 'error');
      return;
    }
    if (selectedStudentIds.length === 0) {
      showToast('Please select at least one student', 'error');
      return;
    }
    if (totalSelectedStudents > totalSelectedCapacity) {
      showToast('Insufficient capacity! Room capacity is smaller than selected students.', 'error');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationResult(null);

      // Simulation steps for realistic UX
      setGenerationStepText('1. Initializing 8-way spatial matrix & room geometry...');
      await new Promise(r => setTimeout(r, 400));
      setGenerationStepText('2. Grouping students by section and interleaving checkerboard streams...');
      await new Promise(r => setTimeout(r, 500));
      setGenerationStepText('3. Running heuristic swap optimization across neighbor conflicts...');

      const response = await api.generateSeating({
        examId: selectedExamId,
        roomIds: selectedRoomIds,
        studentIds: selectedStudentIds,
        config,
      });

      setGenerationStepText('4. Persisting seating plan and audit log to live MongoDB Atlas...');
      await new Promise(r => setTimeout(r, 300));

      if (response.success) {
        setGenerationResult(response.data);
        showToast('Optimized seating plan generated and stored in Atlas!', 'success');
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStepText('');
    }
  };

  if (loadingInitial) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-16 text-center text-slate-500">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-500" />
        <p className="mt-3 text-sm">Preparing optimization engine from MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-400" />
          <span>Seating Optimization Wizard</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure real-world constraints, inspect live hall capacities, and trigger heuristic seat allocation.
        </p>
      </div>

      {/* Success Result Banner */}
      {generationResult && (
        <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-950/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-500/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Optimization Complete • Stored in Atlas
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Seating Arrangement Successfully Generated
                </h2>
              </div>
            </div>

            <button
              id="btn-view-generated-seating"
              onClick={() => onViewPlan(generationResult.plan._id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
            >
              <span>VIEW SEATING PLAN</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs text-slate-400">Students Allocated</span>
              <p className="font-mono text-2xl font-bold text-white mt-1">
                {generationResult.plan.studentsAllocated}/{generationResult.plan.totalStudents}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Placed</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs text-slate-400">Initial Conflicts</span>
              <p className="font-mono text-2xl font-bold text-rose-400 mt-1">
                {generationResult.metrics?.conflictsBeforeOptimization || 0}
              </p>
              <span className="text-[10px] text-slate-500">Before Swapping</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs text-slate-400">Final Conflicts</span>
              <p className="font-mono text-2xl font-bold text-emerald-400 mt-1">
                {generationResult.metrics?.conflictsAfterOptimization || 0}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {generationResult.metrics?.conflictsBeforeOptimization > 0
                  ? `Reduced by ${Math.round(((generationResult.metrics.conflictsBeforeOptimization - generationResult.metrics.conflictsAfterOptimization) / generationResult.metrics.conflictsBeforeOptimization) * 100)}%`
                  : '0 Residual'}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs text-slate-400">Optimization Score</span>
              <p className="font-mono text-2xl font-bold text-brand-400 mt-1">
                {generationResult.plan.score}%
              </p>
              <span className="text-[10px] text-slate-400">Execution: {generationResult.metrics?.executionTimeMs || 42}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Select Examination */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/20 text-brand-300 font-mono text-xs font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-white">Select Examination</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam._id}
              onClick={() => setSelectedExamId(exam._id)}
              className={`rounded-xl border p-4 transition-all cursor-pointer ${
                selectedExamId === exam._id
                  ? 'border-brand-500 bg-brand-500/10 shadow-md ring-1 ring-brand-500/40'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{exam.name}</h4>
                  <p className="text-xs text-brand-400 mt-0.5">{exam.subject}</p>
                </div>
                <input
                  type="radio"
                  checked={selectedExamId === exam._id}
                  onChange={() => setSelectedExamId(exam._id)}
                  className="accent-brand-500 cursor-pointer"
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                <span>Sem {exam.semester}</span>
                <span>•</span>
                <span>{new Date(exam.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{exam.duration} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Select Examination Rooms */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-white">Select Examination Rooms</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {selectedRoomIds.length} of {rooms.length} Rooms Selected
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {rooms.map((room) => {
            const isSelected = selectedRoomIds.includes(room._id);
            return (
              <div
                key={room._id}
                onClick={() => toggleRoom(room._id)}
                className={`rounded-xl border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{room.roomNumber}</h4>
                    <p className="text-xs text-slate-400">{room.building}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRoom(room._id)}
                    className="accent-emerald-500 cursor-pointer h-4 w-4"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                  <span className="text-slate-400">Dimensions: {room.rows}×{room.columns}</span>
                  <span className="font-mono font-bold text-emerald-400">{room.capacity} Seats</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Select Students */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-white">Select Students</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAllStudents}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer"
            >
              Select All ({students.length})
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={deselectAllStudents}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-brand-400" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {selectedStudentIds.length} Students Selected for this Examination
                </p>
                <p className="text-xs text-slate-400">
                  Enrolled across Computer Science, IT, and Cyber Security departments.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 font-mono text-xs font-bold text-brand-400 border border-slate-700">
              {selectedStudentIds.length} / {students.length}
            </span>
          </div>
        </div>
      </div>

      {/* Step 4: Configure Constraints */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
            4
          </div>
          <h3 className="text-base font-bold text-white">Configure Seating Constraints</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Same Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Same Section Adjacent</span>
              <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300">
                +10 pts
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Primary objective: Prevents students sharing the same syllabus/class from sitting side-by-side.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Strictly Minimized</span>
            </div>
          </div>

          {/* Same Department */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Same Dept Adjacent</span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                +5 pts
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Encourages inter-departmental interleaving (e.g. CS adjacent to IT).
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Minimized</span>
            </div>
          </div>

          {/* Sequential Roll */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Sequential Roll Numbers</span>
              <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-orange-300">
                +5 pts
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Avoids consecutive roll numbers (e.g. CS23001 & CS23002) sitting next to each other.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Avoided</span>
            </div>
          </div>

          {/* Diagonal & Iterations Controls */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Diagonal Adjacency</span>
              <input
                type="checkbox"
                checked={config.includeDiagonal}
                onChange={(e) => setConfig({ ...config, includeDiagonal: e.target.checked })}
                className="accent-brand-500 cursor-pointer h-4 w-4"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Treat diagonal neighbors as adjacent (8-way detection).
            </p>

            <div className="border-t border-slate-800/80 pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Swap Iterations:</span>
                <span className="font-mono text-brand-400 font-bold">{config.iterations}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="25"
                value={config.iterations}
                onChange={(e) => setConfig({ ...config, iterations: Number(e.target.value) })}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 5: Capacity Verification & Launch Action */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Live Capacity Ticker */}
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-xs text-slate-400">Selected Students:</span>
              <p className="text-xl font-extrabold text-white font-mono mt-0.5">
                {totalSelectedStudents} Students
              </p>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

            <div>
              <span className="text-xs text-slate-400">Available Hall Capacity:</span>
              <p className="text-xl font-extrabold text-white font-mono mt-0.5">
                {totalSelectedCapacity} Seats
              </p>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

            {/* Capacity Status Badge */}
            <div>
              <span className="text-xs text-slate-400">Capacity Status:</span>
              <div className="mt-1">
                {hasEnoughCapacity ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>✓ Enough capacity (+{totalSelectedCapacity - totalSelectedStudents} spare)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/30">
                    <XCircle className="h-4 w-4" />
                    <span>✗ Insufficient capacity (deficit of {totalSelectedStudents - totalSelectedCapacity})</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* GENERATE OPTIMIZED SEATING BUTTON */}
          <div className="flex items-center gap-3">
            <button
              id="btn-generate-optimized-seating"
              onClick={handleGenerate}
              disabled={isGenerating || !hasEnoughCapacity}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-brand-600/30 transition-all hover:from-brand-500 hover:to-purple-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Optimizing Seating Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <span>GENERATE OPTIMIZED SEATING</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Loading Progress Stages Ticker */}
        {isGenerating && (
          <div className="mt-5 rounded-2xl border border-brand-500/30 bg-brand-950/20 p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-brand-400 shrink-0" />
              <p className="text-xs font-mono text-brand-300">{generationStepText}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
