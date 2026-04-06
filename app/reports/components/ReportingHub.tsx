import React from 'react';
import Header from "../../components/Header";

export default function ReportingHub({
  setCurrentView,
  selectedYear,
  setSelectedYear,
  baselineYear,
  setBaselineYear,
  sidebarOpen,
  setSidebarOpen,
  yearOptions
}: any) {
  return (
    <div className="bg-surface text-on-surface min-h-screen font-body w-full">
      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        baselineYear={baselineYear}
        setBaselineYear={setBaselineYear}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        yearOptions={yearOptions}
        activePage="reports"
      />
      
      <main className="pt-32 pb-20 px-8 max-w-6xl mx-auto min-h-screen">
        <section className="mb-20">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Reporting Hub</span>
          <h1 className="text-5xl font-extrabold text-on-surface tracking-tight mb-6">Reports</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Select a reporting framework to begin your compliance journey. We use editorial intelligence to guide you through complex data narratives.
          </p>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="col-span-1 md:col-span-12 bg-surface-container-lowest rounded-xl p-10 flex flex-col justify-between min-h-[400px] group transition-all duration-300 max-w-4xl mx-auto w-full">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-fixed">description</span>
                </div>
                <span className="text-on-secondary-container font-semibold tracking-wide">MANDATORY FILING</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-on-surface">BRSR Report</h2>
                <p className="text-on-surface-variant text-xl leading-relaxed max-w-lg">
                  Business Responsibility and Sustainability Reporting for large-cap entities.
                </p>
              </div>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <button 
                onClick={() => setCurrentView('upload')}
                className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-surface-tint transition-all shadow-lg shadow-primary/10 active:scale-95"
              >
                Start Report
              </button>
              <div className="hidden lg:flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                SEBI Compliant Framework
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-effect p-4 flex justify-around items-center z-50" style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(20px)" }}>
        <button className="flex flex-col items-center gap-1 text-slate-600">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-emerald-900">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assessment</span>
          <span className="text-[10px] font-bold">Reports</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-600">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}
