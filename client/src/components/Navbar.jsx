import React, { useState } from 'react';
import { Database, Sparkles, LayoutGrid, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Navbar({ onSeedData, currentTab, setCurrentTab, isSeeding }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">Exam Hall Seat Optimizer</span>
              <span className="hidden rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-400 ring-1 ring-inset ring-brand-500/20 sm:inline-flex">
                Constraint Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Heuristic Multi-Room Seating Optimizer with Live MongoDB Atlas</p>
          </div>
        </div>

        {/* Right Actions: Atlas Status & Load Demo Data */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Live MongoDB Atlas Indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <Database className="h-3.5 w-3.5" />
            <span className="hidden md:inline">MongoDB Atlas Live</span>
            <span className="md:hidden">Atlas</span>
          </div>

          {/* Quick Demo Button */}
          <button
            id="btn-load-demo-data"
            onClick={onSeedData}
            disabled={isSeeding}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition-all hover:from-brand-500 hover:to-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSeeding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading Demo...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>LOAD DEMO DATA</span>
              </>
            )}
          </button>

          {/* Generate Quick Link */}
          <button
            onClick={() => setCurrentTab('generate')}
            className={`hidden lg:flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              currentTab === 'generate'
                ? 'border-brand-500 bg-brand-500/20 text-brand-300'
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Generate Seating
          </button>
        </div>

      </div>
    </header>
  );
}
