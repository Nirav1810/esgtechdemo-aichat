import React, { useState, useEffect } from 'react';
import { PyData, DEFAULT_PY_DATA, STEPS_CONFIG, isFormulaKey } from '../types';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';
type ReportView = 'overview' | 'upload' | 'entry' | 'review';

interface DataUploadProps {
  currentView: ReportView;
  setCurrentView: (view: ReportView) => void;
  isUploaded: boolean;
  uploadState: UploadState;
  uploadError: string | null;
  pyData: PyData;
  setPyData: (data: PyData) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/** PPP formula for RevenuePPP */
const computeRevenuePPP = (revenue: string): string => {
  const rev = parseFloat(revenue);
  if (!rev || isNaN(rev)) return '0';
  return String(Math.round((rev * 10) / 20.66));
};

/** Section metadata for review panel headers */
const SECTIONS: { key: string; label: string; color: string }[] = [
  { key: 'Q1', label: 'Q1 — Energy Consumption (GJ)', color: 'emerald' },
  { key: 'Q3', label: 'Q3 — Water (kL)', color: 'blue' },
  { key: 'Q4', label: 'Q4 — Water Discharge (kL)', color: 'cyan' },
  { key: 'Q6', label: 'Q6 — Air Emissions (MT)', color: 'orange' },
  { key: 'Q7', label: 'Q7 — GHG Emissions (tCO₂Eq)', color: 'red' },
  { key: 'Q9', label: 'Q9 — Waste Management (MT)', color: 'purple' },
];

const SECTION_COLOR_MAP: Record<string, string> = {
  emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  blue:    'text-blue-700 bg-blue-50 border-blue-200',
  cyan:    'text-cyan-700 bg-cyan-50 border-cyan-200',
  orange:  'text-orange-700 bg-orange-50 border-orange-200',
  red:     'text-red-700 bg-red-50 border-red-200',
  purple:  'text-purple-700 bg-purple-50 border-purple-200',
};

export default function DataUpload({
  setCurrentView,
  isUploaded,
  uploadState,
  uploadError,
  pyData,
  setPyData,
  handleFileUpload,
}: DataUploadProps) {
  const isLoading = uploadState === 'uploading';

  type DraftRecord = Record<keyof PyData, string>;

  // Local draft for edits
  const [draft, setDraft] = useState<DraftRecord>(() =>
    Object.fromEntries(
      Object.keys(DEFAULT_PY_DATA).map(k => [k, String(pyData[k as keyof PyData])])
    ) as DraftRecord
  );

  // Sync draft when new PDF data arrives
  useEffect(() => {
    if (uploadState === 'success') {
      const base = Object.fromEntries(
        Object.keys(DEFAULT_PY_DATA).map(k => [k, String(pyData[k as keyof PyData])])
      ) as DraftRecord;

      // Seed RevenuePPP from Revenue
      if (!base.RevenuePPP || base.RevenuePPP === '0') {
        base.RevenuePPP = computeRevenuePPP(base.Revenue);
      }
      setDraft(base);
    }
  }, [uploadState, pyData]);

  // Reactively recompute RevenuePPP when Revenue changes
  useEffect(() => {
    const computed = computeRevenuePPP(draft.Revenue);
    if (draft.RevenuePPP !== computed) {
      setDraft(prev => ({ ...prev, RevenuePPP: computed }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.Revenue]);

  const handleDraftChange = (key: keyof PyData, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirm = () => {
    const committed = Object.fromEntries(
      Object.keys(DEFAULT_PY_DATA).map(k => [k, parseFloat(draft[k as keyof PyData]) || 0])
    ) as unknown as PyData;
    setPyData(committed);
    setCurrentView('entry');
  };

  // Build section → fields map
  const sectionedFields = SECTIONS.map(sec => ({
    ...sec,
    fields: STEPS_CONFIG.filter(f => f.section === sec.key),
  }));

  return (
    <div className="flex-1 px-8 py-10 max-w-5xl mx-auto w-full">
      <div className="space-y-10">

        {/* ── STEP 1: Upload ─────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${isUploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'}`}>
              {isUploaded ? <span className="material-symbols-outlined text-base">check</span> : '1'}
            </div>
            <div>
              <p className="font-bold text-on-surface">Upload Previous Year BRSR PDF</p>
              <p className="text-xs text-on-surface-variant">
                Our AI extracts all Principle 6 tables — energy, water, GHG, air, and waste.
              </p>
            </div>
            {isUploaded && (
              <label className="ml-auto flex items-center gap-1.5 text-xs text-primary font-semibold cursor-pointer hover:underline">
                <span className="material-symbols-outlined text-base">upload</span>
                Re-upload
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isLoading} />
              </label>
            )}
          </div>

          <label className={`block relative bg-surface-container-lowest rounded-2xl p-10 text-center transition-all duration-500 border-2 border-dashed
            ${isLoading ? 'border-primary/60 bg-primary/5 cursor-wait' : ''}
            ${uploadState === 'success' ? 'border-emerald-400 bg-emerald-50/40' : ''}
            ${uploadState === 'error' ? 'border-red-400 bg-red-50/30 cursor-pointer' : ''}
            ${uploadState === 'idle' ? 'border-outline-variant/30 hover:border-primary/40 hover:bg-primary-container/5 cursor-pointer' : ''}
          `}>
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isLoading || uploadState === 'success'} />

            <div className="flex flex-col items-center gap-3">
              {isLoading ? (
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : (
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110
                  ${uploadState === 'success' ? 'bg-emerald-100 text-emerald-600' : ''}
                  ${uploadState === 'error' ? 'bg-red-100 text-red-500' : ''}
                  ${uploadState === 'idle' ? 'bg-primary/10 text-primary' : ''}
                `}>
                  <span className="material-symbols-outlined text-4xl">
                    {uploadState === 'success' ? 'check_circle' : uploadState === 'error' ? 'error' : 'picture_as_pdf'}
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-on-surface">
                {isLoading ? 'Extracting data from PDF…'
                  : uploadState === 'success' ? 'PDF Processed Successfully'
                  : uploadState === 'error' ? 'Upload Failed — Try Again'
                  : 'Click to Upload Your BRSR PDF Report'}
              </h3>

              {uploadState === 'idle' && (
                <p className="text-on-surface-variant text-sm">Select the annual BRSR report PDF for the previous financial year.</p>
              )}
              {uploadState === 'success' && (
                <p className="text-emerald-700 text-sm font-medium">All Principle 6 tables extracted — review and edit below.</p>
              )}
              {uploadState === 'error' && uploadError && (
                <p className="text-red-500 text-sm max-w-md">{uploadError}</p>
              )}
              {isLoading && (
                <p className="text-on-surface-variant text-sm">AI is reading all Principle 6 tables (energy, water, GHG, waste)…</p>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full text-xs text-on-surface-variant mt-1">
                <span className="material-symbols-outlined text-xs">info</span>
                <span>Supported format: .pdf (Max 20 MB)</span>
              </div>
            </div>
          </label>
        </div>

        {/* ── STEP 2: Review & Edit PY Data ──────────────────────────── */}
        {uploadState === 'success' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-primary/10 text-primary">
                2
              </div>
              <div>
                <p className="font-bold text-on-surface">Review & Edit Extracted Previous Year Data</p>
                <p className="text-xs text-on-surface-variant">
                  Verify all Principle 6 sections. <span className="text-violet-600 font-medium">Purple = auto-calculated</span> · <span className="text-amber-600 font-medium">Amber = not found in PDF</span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {sectionedFields.map(({ key, label, color, fields }) => {
                const colorClass = SECTION_COLOR_MAP[color] || 'text-gray-700 bg-gray-50 border-gray-200';

                // Group fields by category within each section
                const categories = Array.from(new Set(fields.map(f => f.category)));

                return (
                  <div key={key} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
                    {/* Section header */}
                    <div className={`px-5 py-3 border-b border-outline-variant/20 flex items-center gap-2 ${colorClass}`}>
                      <p className="text-xs font-bold uppercase tracking-widest">{label}</p>
                    </div>

                    {categories.map(cat => (
                      <div key={cat}>
                        {/* Category sub-header */}
                        <div className="px-5 py-2 bg-surface-container/40 border-b border-outline-variant/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">{cat}</p>
                        </div>

                        <div className="divide-y divide-outline-variant/10">
                          {fields.filter(f => f.category === cat).map(field => {
                            const val = parseFloat(draft[field.key]) || 0;
                            const isZero = val === 0;
                            const isFormula = isFormulaKey(field.key);

                            return (
                              <div key={field.key} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-on-surface truncate">{field.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-xs text-on-surface-variant">{field.unit}</p>
                                    {isFormula && (
                                      <span className="text-[10px] font-mono text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200">
                                        = Revenue × 10 ÷ 20.66
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {isFormula ? (
                                    <span className="text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200 flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[11px]">functions</span>
                                      Auto
                                    </span>
                                  ) : isZero ? (
                                    <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                      Not found
                                    </span>
                                  ) : null}
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    value={draft[field.key]}
                                    onChange={e => {
                                      if (!isFormula) {
                                        const raw = e.target.value.replace(/[^0-9.-]/g, '');
                                        handleDraftChange(field.key, raw);
                                      }
                                    }}
                                    readOnly={isFormula}
                                    title={isFormula ? 'Auto-calculated from Revenue' : undefined}
                                    className={`w-32 text-right px-3 py-2 rounded-xl text-sm font-semibold border transition-colors outline-none
                                      ${isFormula
                                        ? 'border-violet-300 bg-violet-50/60 text-violet-700 cursor-default'
                                        : isZero
                                        ? 'border-amber-300 bg-amber-50/50 text-amber-700 focus:border-primary focus:bg-white focus:text-on-surface'
                                        : 'border-emerald-300 bg-emerald-50/50 text-emerald-800 focus:border-primary focus:bg-white focus:text-on-surface'
                                      }
                                    `}
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Confirm CTA */}
            <div className="flex flex-col items-center gap-3 mt-8">
              <button
                onClick={handleConfirm}
                className="px-12 py-4 bg-primary text-on-primary rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                Confirm & Continue to Guided Entry →
              </button>
              <p className="text-xs text-on-surface-variant">
                You can always come back and re-upload a different PDF.
              </p>
            </div>
          </div>
        )}

        {/* AI note — only show before upload */}
        {uploadState !== 'success' && (
          <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <span className="material-symbols-outlined text-primary mt-0.5">auto_awesome</span>
            <div>
              <p className="font-semibold text-on-surface text-sm mb-1">AI-Powered Extraction — All Principle 6 Tables</p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                We parse your PDF and use a large language model to locate all tabular disclosures in
                <span className="font-medium"> Principle 6</span>: Energy (Q1), Water (Q3 & Q4),
                Air Emissions (Q6), GHG (Q7), and Waste (Q9). All <strong>Previous Year (PY)</strong> columns
                are extracted automatically. Missing values are highlighted in amber for manual correction.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
