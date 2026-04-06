import React from 'react';

export default function ReportsSidebar({ currentView, setCurrentView }: any) {
  return (
    <aside className="hidden md:flex flex-col h-screen sticky top-0 p-6 bg-emerald-50 dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 w-64 border-r border-emerald-100 dark:border-slate-800 z-40">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">shield_with_heart</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-900 leading-none">BRSR Reporting</h2>
            <p className="text-xs text-slate-600 font-medium">FY 2024-25</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        <button onClick={() => setCurrentView('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentView === 'overview' ? 'text-emerald-900 dark:text-emerald-400 font-bold bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-slate-700'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Overview</span>
        </button>
        <button onClick={() => setCurrentView('upload')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentView === 'upload' ? 'text-emerald-900 dark:text-emerald-400 font-bold bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-slate-700'}`}>
          <span className="material-symbols-outlined">upload_file</span>
          <span>Data Upload</span>
        </button>
        <button onClick={() => setCurrentView('entry')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentView === 'entry' ? 'text-emerald-900 dark:text-emerald-400 font-bold bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-slate-700'}`}>
          <span className="material-symbols-outlined">edit_note</span>
          <span>Guided Entry</span>
        </button>
        <button onClick={() => setCurrentView('review')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentView === 'review' ? 'text-emerald-900 dark:text-emerald-400 font-bold bg-white/50 dark:bg-white/10 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-slate-700'}`}>
          <span className="material-symbols-outlined">assignment_turned_in</span>
          <span>Final Review</span>
        </button>
      </nav>
    </aside>
  );
}
