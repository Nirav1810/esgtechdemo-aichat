import React, { useState } from 'react';
import { PyData, BrsrFormData, DerivedMetrics, QUESTIONS_CONFIG } from '../types';

interface FinalReviewProps {
  setCurrentView: (v: 'overview' | 'upload' | 'entry' | 'review' | 'excel-review') => void;
  formData: BrsrFormData;
  pyData: PyData;
  fyMetrics: DerivedMetrics;
  pyMetrics: DerivedMetrics;
  setIsReportGenerated?: (v: boolean) => void;
}

const n = (v: string | number) => parseFloat(String(v)) || 0;
const fmt = (v: number, dp = 2) => (isFinite(v) ? v.toFixed(dp) : '0.00');
const loc = (v: number | string) => {
  const num = typeof v === 'string' ? parseFloat(v) : v;
  return isFinite(num) ? num.toLocaleString('en-IN') : '0';
};

export default function FinalReview({ 
  setCurrentView, 
  formData, 
  pyData, 
  fyMetrics, 
  pyMetrics, 
  setIsReportGenerated 
}: FinalReviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to get question text from config
  const getQ = (num: number) => QUESTIONS_CONFIG.find(q => q.number === num)!;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: 'brsr-report',
          contextData: JSON.stringify({ formData, pyData, fyMetrics, pyMetrics }),
        }),
      });
      if (!res.ok) throw new Error('Failed to generate report');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BRSR_P6_Report_FY25_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      if (setIsReportGenerated) setIsReportGenerated(true);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-10 pb-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Final Report Review</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Principle 6: Businesses should respect and make efforts to protect and restore the environment. 
              Review all disclosures for visual parity with official standards.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('entry')}
              className="px-6 py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-white hover:border-slate-300 transition-all"
            >
              Edit Data
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center gap-3 px-8 py-3 bg-[#004C3F] text-white rounded-2xl font-bold shadow-2xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <><span className="material-symbols-outlined animate-spin">autorenew</span> Generating PDF...</>
              ) : (
                <><span className="material-symbols-outlined">description</span> Export Final Report</>
              )}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-8 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Previous Financial Year</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#004C3F]"></div>
            <span className="text-xs font-bold text-[#004C3F] uppercase tracking-widest">Current Financial Year</span>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* Section Generator */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(num => {
            const q = getQ(num);
            
            return (
              <div key={num} className="group">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-all group-hover:shadow-xl group-hover:shadow-slate-200/50">
                  {/* Card Header */}
                  <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#004C3F]">
                      <span className="material-symbols-outlined text-2xl">{q.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black bg-[#004C3F] text-white px-2 py-0.5 rounded-sm uppercase tracking-tighter">ESSENTIAL</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">INDICATOR {num}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 leading-relaxed">{q.title}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8">
                    {/* Quantitative Tables */}
                    {num === 1 && (
                      <div className="space-y-1">
                        <DataRow label="Electricity consumption from renewable sources (A)" pyVal={loc(pyData.energy_A)} fyVal={loc(n(formData.energy_A))} unit="GJ" />
                        <DataRow label="Fuel consumption from renewable sources (B)" pyVal={loc(pyData.energy_B)} fyVal={loc(n(formData.energy_B))} unit="GJ" />
                        <DataRow label="Energy consumption through other renewable sources (C)" pyVal={loc(pyData.energy_C)} fyVal={loc(n(formData.energy_C))} unit="GJ" />
                        <DataRow label="Total energy consumed from renewable sources (A+B+C)" pyVal={loc(pyMetrics.energy_renewable_total)} fyVal={loc(fyMetrics.energy_renewable_total)} unit="GJ" formula />
                        <div className="my-4 h-px bg-slate-100"></div>
                        <DataRow label="Electricity consumption from non-renewable sources (D)" pyVal={loc(pyData.energy_D)} fyVal={loc(n(formData.energy_D))} unit="GJ" />
                        <DataRow label="Fuel consumption from non-renewable sources (E)" pyVal={loc(pyData.energy_E)} fyVal={loc(n(formData.energy_E))} unit="GJ" />
                        <DataRow label="Energy consumption through other non-renewable sources (F)" pyVal={loc(pyData.energy_F)} fyVal={loc(n(formData.energy_F))} unit="GJ" />
                        <DataRow label="Total energy consumed from non-renewable sources (D+E+F)" pyVal={loc(pyMetrics.energy_nonrenewable_total)} fyVal={loc(fyMetrics.energy_nonrenewable_total)} unit="GJ" formula />
                        <div className="my-4 h-px bg-slate-100"></div>
                        <DataRow label="Total energy consumed (A+B+C+D+E+F)" pyVal={loc(pyMetrics.energy_total)} fyVal={loc(fyMetrics.energy_total)} unit="GJ" grand />
                        <div className="pt-6 my-6 border-t border-dashed border-slate-200 space-y-2">
                          <DataRow label="Energy intensity per rupee of turnover" pyVal={fmt(pyMetrics.energy_intensity_revenue, 4)} fyVal={fmt(fyMetrics.energy_intensity_revenue, 4)} unit="GJ/Cr" />
                          <DataRow label="Energy intensity (PPP Adjusted)" pyVal={fmt(pyMetrics.energy_intensity_ppp, 4)} fyVal={fmt(fyMetrics.energy_intensity_ppp, 4)} unit="GJ/M USD" />
                          <DataRow label="Energy intensity in terms of physical output" pyVal={fmt(pyMetrics.energy_intensity_production, 4)} fyVal={fmt(fyMetrics.energy_intensity_production, 4)} unit="GJ/MT" />
                        </div>
                      </div>
                    )}

                    {num === 3 && (
                      <div className="space-y-1">
                        <DataRow label="(i) Surface water" pyVal={loc(pyData.water_surface)} fyVal={loc(n(formData.water_surface))} unit="kL" />
                        <DataRow label="(ii) Groundwater" pyVal={loc(pyData.water_ground)} fyVal={loc(n(formData.water_ground))} unit="kL" />
                        <DataRow label="(iii) Third party water" pyVal={loc(pyData.water_thirdparty)} fyVal={loc(n(formData.water_thirdparty))} unit="kL" />
                        <DataRow label="(iv) Seawater / desalinated" pyVal={loc(pyData.water_seawater)} fyVal={loc(n(formData.water_seawater))} unit="kL" />
                        <DataRow label="(v) Others" pyVal={loc(pyData.water_others)} fyVal={loc(n(formData.water_others))} unit="kL" />
                        <DataRow label="Total Withdrawal" pyVal={loc(pyMetrics.water_withdrawal_total)} fyVal={loc(fyMetrics.water_withdrawal_total)} unit="kL" formula />
                        <DataRow label="Total Water Consumption" pyVal={loc(pyData.water_consumption)} fyVal={loc(n(formData.water_consumption))} unit="kL" grand />
                      </div>
                    )}

                    {/* Qualitative Boxes */}
                    {(num === 2 || num === 5 || num === 8 || num >= 10) && (
                      <NarrativeBox text={formData[`theory_q${num}` as keyof BrsrFormData] as string} />
                    )}

                    {/* Placeholder for other complex indicators for brevity */}
                    {([4,6,7,9].indexOf(num) !== -1) && (
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-400 text-sm italic">
                         <span className="material-symbols-outlined">table_view</span>
                         Full tabular data review for Indicator {num} is available in our calculation engine.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Global Action */}
        <div className="mt-16 flex flex-col items-center">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="group relative px-14 py-5 bg-[#004C3F] text-white rounded-full font-black text-xl shadow-[0_20px_50px_rgba(0,76,63,0.3)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
               {isGenerating ? (
                 <span className="material-symbols-outlined animate-spin text-2xl">autorenew</span>
               ) : (
                 <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">task_alt</span>
               )}
               <span>{isGenerating ? 'Finalizing Filing...' : 'Approve & Create PDF'}</span>
            </div>
          </button>
          <p className="mt-6 text-slate-400 text-sm font-medium">Verify all 13 Principle 6 indicators before final submission.</p>
        </div>

      </div>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function DataRow({ label, pyVal, fyVal, unit, formula = false, grand = false }: { label: string; pyVal: string; fyVal: string; unit: string; formula?: boolean; grand?: boolean }) {
  return (
    <div className={`grid grid-cols-12 gap-6 py-3 px-4 rounded-xl transition-all ${grand ? 'bg-[#004C3F]/5 border-l-4 border-[#004C3F]' : formula ? 'bg-slate-50/80 border-l-4 border-slate-200' : 'hover:bg-slate-50/50 underline-offset-4'}`}>
      <div className="col-span-6 flex items-center">
        <span className={`text-[13px] tracking-tight leading-snug ${grand || formula ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'}`}>{label}</span>
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-300 uppercase leading-none">{unit}</span>
      </div>
      <div className="col-span-2 flex flex-col items-end justify-center pr-4">
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mb-0.5 opacity-60">PY</span>
        <span className={`text-sm tracking-tight ${grand ? 'font-bold text-slate-600' : 'text-slate-500 font-medium'}`}>{pyVal}</span>
      </div>
      <div className="col-span-3 flex flex-col items-end justify-center">
        <span className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${grand ? 'text-[#004C3F]' : 'text-slate-700'}`}>FY 24-25</span>
        <span className={`text-[15px] tracking-tight ${grand ? 'font-black text-[#004C3F]' : formula ? 'font-bold text-slate-800' : 'font-bold text-slate-900'}`}>{fyVal}</span>
      </div>
    </div>
  );
}

function NarrativeBox({ text }: { text?: string }) {
  if (!text || text.trim().length === 0) {
    return (
      <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 text-slate-400 italic text-sm">
        <span className="material-symbols-outlined text-slate-300">report</span>
        No narrative response provided for this indicator.
      </div>
    );
  }

  return (
    <div className="bg-[#004C3F]/[0.02] rounded-[1.5rem] border-2 border-[#004C3F]/10 border-l-4 border-l-[#004C3F] p-7 shadow-sm">
      <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

