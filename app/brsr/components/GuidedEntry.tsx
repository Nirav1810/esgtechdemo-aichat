import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PyData, BrsrFormData, DerivedMetrics,
  QUESTIONS_CONFIG, QuestionConfig, StepConfig,
  isFormulaKey, computeMetrics, PPP_FACTOR,
} from '../types';

interface GuidedEntryProps {
  setCurrentView: (v: 'overview' | 'upload' | 'entry' | 'review' | 'excel-review') => void;
  isUploaded: boolean;
  pyData: PyData;
  pyMetrics: DerivedMetrics;
  formData: BrsrFormData;
  setFormData: (data: BrsrFormData) => void;
  fyMetrics: DerivedMetrics;
}

// ─── Color helpers ────────────────────────────────────────────────────────────

const CARD_STYLES: Record<string, { bg: string; border: string; icon: string; badge: string; pill: string }> = {
  emerald: { bg: 'bg-emerald-50',  border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', pill: 'bg-emerald-600' },
  blue:    { bg: 'bg-blue-50',     border: 'border-blue-200',    icon: 'text-blue-600',    badge: 'bg-blue-100 text-blue-700',    pill: 'bg-blue-600' },
  cyan:    { bg: 'bg-cyan-50',     border: 'border-cyan-200',    icon: 'text-cyan-600',    badge: 'bg-cyan-100 text-cyan-700',    pill: 'bg-cyan-600' },
  orange:  { bg: 'bg-orange-50',   border: 'border-orange-200',  icon: 'text-orange-600',  badge: 'bg-orange-100 text-orange-700', pill: 'bg-orange-600' },
  red:     { bg: 'bg-red-50',      border: 'border-red-200',     icon: 'text-red-600',     badge: 'bg-red-100 text-red-700',     pill: 'bg-red-600' },
  purple:  { bg: 'bg-purple-50',   border: 'border-purple-200',  icon: 'text-purple-600',  badge: 'bg-purple-100 text-purple-700', pill: 'bg-purple-600' },
  slate:   { bg: 'bg-slate-50',    border: 'border-slate-200',   icon: 'text-slate-400',   badge: 'bg-slate-100 text-slate-500',  pill: 'bg-slate-400' },
};

// ─── Completion helpers ───────────────────────────────────────────────────────

function getQuestionCompletion(q: QuestionConfig, formData: BrsrFormData): { filled: number; total: number } {
  if (!q.hasTable) return { filled: 0, total: 0 };
  const inputFields = q.fields.filter(f => !isFormulaKey(f.key));
  const filled = inputFields.filter(f => {
    const v = formData[f.key];
    return v !== '' && v !== '0' && v !== undefined;
  }).length;
  return { filled, total: inputFields.length };
}

// ─── Sub-wizard per question ──────────────────────────────────────────────────

function QuestionWizard({
  question,
  formData,
  pyData,
  fyMetrics,
  onUpdate,
  onClose,
}: {
  question: QuestionConfig;
  formData: BrsrFormData;
  pyData: PyData;
  fyMetrics: DerivedMetrics;
  onUpdate: (key: keyof PyData, val: string) => void;
  onClose: () => void;
}) {
  const inputFields = question.fields.filter(f => !isFormulaKey(f.key));
  const [localStep, setLocalStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const style = CARD_STYLES[question.color] || CARD_STYLES.slate;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [localStep]);

  const currentField: StepConfig = question.fields[localStep];
  const inputFieldIndex = inputFields.indexOf(currentField);
  const isLastStep = localStep === question.fields.length - 1;
  const isFirstStep = localStep === 0;
  const isFormula = isFormulaKey(currentField.key);
  const pyVal = pyData[currentField.key];

  const handlePrev = () => setLocalStep(s => Math.max(0, s - 1));
  const handleNext = () => {
    if (isLastStep) onClose();
    else setLocalStep(s => s + 1);
  };

  // All fields including formula for display progress
  const totalSteps = question.fields.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col overflow-hidden" style={{ maxHeight: '95vh' }}>

        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-4 ${style.bg} border-b ${style.border}`}>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            title="Back to questions"
          >
            <span className="material-symbols-outlined text-lg text-slate-600">arrow_back</span>
          </button>
          <span className={`material-symbols-outlined text-xl ${style.icon}`}>{question.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">Q{question.number} — {question.title}</p>
            <p className="text-xs text-slate-500">{localStep + 1} of {totalSteps} fields</p>
          </div>
          <div className="text-xs font-semibold text-slate-500 flex-shrink-0">
            {Math.round(((localStep + 1) / totalSteps) * 100)}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <div
            className={`h-full ${style.pill} transition-all duration-500 rounded-r-full`}
            style={{ width: `${((localStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Field shortcut tabs */}
        <div className="flex gap-1.5 px-6 py-3 overflow-x-auto scrollbar-none border-b border-slate-100">
          {question.fields.map((f, i) => {
            const isActive = i === localStep;
            const isDone = i < localStep;
            const isFm = isFormulaKey(f.key);
            return (
              <button
                key={f.key}
                onClick={() => setLocalStep(i)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all
                  ${isActive ? `${style.badge} border-current` : isDone ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white text-slate-400 border-slate-200'}
                  ${isFm ? 'opacity-70' : ''}
                `}
              >
                {isFm ? '= ' : ''}{f.title.split('(')[0].trim().split('—')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 px-8 py-8 overflow-y-auto">
          <div className="space-y-6">
            {/* Category label */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{currentField.category}</p>

            {/* Question text */}
            <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">
              {isFormula
                ? <span>Auto-calculated: <span className={style.icon}>{currentField.title}</span></span>
                : <>Enter <span className={style.icon}>{currentField.title}</span></>
              }
            </h2>

            {/* PY + FY inputs side by side */}
            <div className="grid grid-cols-2 gap-4">

              {/* Previous Year reference */}
              <div className={`rounded-2xl p-5 ${style.bg} border ${style.border}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Previous Year (PY)</p>
                <p className={`text-3xl font-black ${!pyVal || pyVal === 0 ? 'text-slate-300' : 'text-slate-700'}`}>
                  {(!pyVal || pyVal === 0)
                    ? '—'
                    : typeof pyVal === 'number' && pyVal > 999
                      ? pyVal.toLocaleString()
                      : pyVal
                  }
                </p>
                <p className="text-xs text-slate-400 mt-1">{currentField.unit}</p>
                {(!pyVal || pyVal === 0) && (
                  <p className="text-[10px] text-amber-500 mt-2 font-medium">Not found in PDF</p>
                )}
              </div>

              {/* Current Year input */}
              <div className={`rounded-2xl p-4 border-2 transition-all ${isFormula ? 'border-violet-200 bg-violet-50/60' : 'border-slate-200 focus-within:border-slate-400 bg-white'}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Current Year (FY)</p>
                {isFormula ? (
                  <>
                    <p className="text-3xl font-black text-violet-700">
                      {formData[currentField.key] || '0'}
                    </p>
                    <p className="text-[11px] text-violet-500 mt-1 font-medium">
                      <span className="material-symbols-outlined text-[11px] align-middle">functions</span>
                      {' '}Auto-calculated from Revenue
                    </p>
                  </>
                ) : (
                  <>
                    {currentField.category === 'theory' ? (
                      <textarea
                        ref={inputRef as any}
                        placeholder="Enter response…"
                        value={formData[currentField.key] ?? ''}
                        onChange={e => onUpdate(currentField.key, e.target.value)}
                        className="w-full h-32 resize-none text-base font-medium text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-300"
                      />
                    ) : (
                      <input
                        ref={inputRef}
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter value…"
                        value={formData[currentField.key] ?? ''}
                        onChange={e => {
                          // Allow only numeric input (digits, decimal point, minus)
                          const raw = e.target.value.replace(/[^0-9.-]/g, '');
                          onUpdate(currentField.key, raw);
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') handleNext(); }}
                        className="w-full text-3xl font-black text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-300"
                      />
                    )}
                    <p className="text-xs text-slate-400 mt-1">{currentField.unit}</p>
                  </>
                )}
              </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">info</span>
              <p className="text-sm text-slate-600 leading-relaxed">{currentField.tip}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Previous
          </button>

          {/* Skip non-required */}
          {!isFormula && (
            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-full font-semibold text-sm text-slate-500 hover:bg-slate-200 transition-all"
            >
              Skip
            </button>
          )}

          <div className="flex-1" />

          {/* Field dot indicators */}
          <div className="hidden sm:flex items-center gap-1">
            {question.fields.map((_, i) => (
              <button
                key={i}
                onClick={() => setLocalStep(i)}
                className={`rounded-full transition-all ${i === localStep ? 'w-4 h-2' : 'w-2 h-2'} ${style.pill} ${i > localStep ? 'opacity-20' : ''}`}
              />
            ))}
          </div>

          <div className="flex-1" />

          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white shadow-md transition-all hover:scale-[1.03] active:scale-95 ${style.pill}`}
          >
            {isLastStep ? (
              <><span className="material-symbols-outlined text-base">check</span>Save & Close</>
            ) : (
              <>Next<span className="material-symbols-outlined text-base">arrow_forward</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main GuidedEntry — question card grid ────────────────────────────────────

// ─── Excel upload state types ─────────────────────────────────────────────────
type ExcelState = 'idle' | 'uploading' | 'success' | 'error';

export default function GuidedEntry({
  setCurrentView,
  isUploaded,
  pyData,
  formData,
  setFormData,
  fyMetrics,
}: GuidedEntryProps) {
  const [activeQuestion, setActiveQuestion] = useState<QuestionConfig | null>(null);

  // ── Excel import state ────────────────────────────────────────────────────
  const [excelState, setExcelState] = useState<ExcelState>('idle');
  const [excelError, setExcelError] = useState<string | null>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      const res = await fetch('/api/brsr/download-template');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SEBI_BRSR_Template.xlsm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('[GuidedEntry] Template download failed:', err);
      alert('Failed to download template. Please try again.');
    }
  }, []);

  const handleExcelUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelError(null);
    setExcelState('uploading');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/brsr/parse-excel', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Parse failed');
      setFormData(json.data);
      setExcelState('success');
      // Navigate automatically to the review screen
      setCurrentView('excel-review');
    } catch (err) {
      console.error('[GuidedEntry] Excel upload error:', err);
      setExcelError(err instanceof Error ? err.message : 'Unexpected error parsing Excel.');
      setExcelState('error');
    }
    e.target.value = '';
  }, [setFormData, setCurrentView]);

  const handleUpdate = (key: keyof PyData, val: string) => {
    const next = { ...formData, [key]: val };
    // Reactively re-compute RevenuePPP if Revenue changed
    if (key === 'Revenue') {
      const rev = parseFloat(val.replace(/,/g, ''));
      next.RevenuePPP = rev > 0 ? String(Math.round((rev * 10) / PPP_FACTOR)) : '0';
    }
    setFormData(next);
  };

  // Overall completion
  const allInputQuestions = QUESTIONS_CONFIG.filter(q => q.hasTable);
  const totalFields = allInputQuestions.reduce((s, q) => s + q.fields.filter(f => !isFormulaKey(f.key)).length, 0);
  const filledFields = allInputQuestions.reduce((s, q) => s + getQuestionCompletion(q, formData).filled, 0);
  const overallPct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  // Live metrics for header
  const liveMetrics = computeMetrics(formData, parseFloat(formData.RevenuePPP) || 0);

  return (
    <div className="flex-1 w-full flex flex-col">

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-slate-800">Principle 6 — Environment</h1>
            <p className="text-xs text-slate-500">BRSR Essential Indicators · 13 questions · {overallPct}% complete</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-bold text-slate-800">{filledFields}</span>/{totalFields} fields
            </div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
            </div>
            <button
              onClick={() => setCurrentView('review')}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.04] transition-all"
            >
              <span className="material-symbols-outlined text-base">preview</span>
              Review Report
            </button>
          </div>
        </div>
      </div>

      {/* Live summary strip */}
      {filledFields > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-8 py-2">
          <div className="max-w-5xl mx-auto flex items-center gap-6 overflow-x-auto scrollbar-none text-xs">
            <span className="text-emerald-700 font-bold flex-shrink-0">Live totals →</span>
            {liveMetrics.energy_total > 0 && <span className="flex-shrink-0 text-emerald-800"><b>{liveMetrics.energy_total.toLocaleString()}</b> <span className="text-emerald-600">GJ energy</span></span>}
            {liveMetrics.water_withdrawal_total > 0 && <span className="flex-shrink-0 text-blue-800"><b>{liveMetrics.water_withdrawal_total.toLocaleString()}</b> <span className="text-blue-600">kL withdrawn</span></span>}
            {liveMetrics.ghg_total > 0 && <span className="flex-shrink-0 text-red-800"><b>{liveMetrics.ghg_total.toLocaleString()}</b> <span className="text-red-600">tCO₂Eq</span></span>}
            {liveMetrics.waste_total > 0 && <span className="flex-shrink-0 text-purple-800"><b>{liveMetrics.waste_total.toLocaleString()}</b> <span className="text-purple-600">MT waste</span></span>}
          </div>
        </div>
      )}

      {/* ── Excel Import panel ─────────────────────────────────────────────── */}
      <div className="px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4 flex-wrap">
            {/* Left: headline */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-emerald-600 text-lg">table_view</span>
                <h2 className="text-sm font-extrabold text-slate-800">Bulk Entry via Excel</h2>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download the pre-filled template → fill in FY 2024-25 values → upload it back. <br />
                You will be taken to a review screen where every field is checked before generating the PDF.
              </p>

              {/* Error banner */}
              {excelState === 'error' && excelError && (
                <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {excelError}
                </div>
              )}
            </div>

            {/* Right: action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              {/* Download template */}
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-emerald-600 text-emerald-700 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Download Template
              </button>

              {/* Upload filled template */}
              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
                onChange={handleExcelUpload}
                className="hidden"
              />
              <button
                onClick={() => excelInputRef.current?.click()}
                disabled={excelState === 'uploading'}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
              >
                {excelState === 'uploading' ? (
                  <><span className="material-symbols-outlined animate-spin text-base">autorenew</span> Parsing…</>
                ) : (
                  <><span className="material-symbols-outlined text-base">upload_file</span> Upload Filled Excel</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider label */}
      <div className="px-8 pt-6 pb-2">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Or enter data question by question</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
      </div>

      {/* Question cards grid */}
      <div className="flex-1 px-8 py-4 overflow-y-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {QUESTIONS_CONFIG.map(q => {
            const style = CARD_STYLES[q.color] || CARD_STYLES.slate;
            const { filled, total } = getQuestionCompletion(q, formData);
            const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
            const isComplete = q.hasTable && filled === total && total > 0;
            const isPartial = q.hasTable && filled > 0 && filled < total;

            return (
              <div
                key={q.section}
                className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 flex flex-col overflow-hidden
                  ${isComplete ? 'border-emerald-300 shadow-emerald-100/80 shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
                `}
              >
                {/* Completion stripe */}
                {q.hasTable && total > 0 && (
                  <div className="h-1 bg-slate-100">
                    <div
                      className={`h-full transition-all duration-700 rounded-r-full ${isComplete ? 'bg-emerald-400' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1 gap-4">
                  {/* Question number + icon */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                      <span className={`material-symbols-outlined text-xl ${style.icon}`}>{q.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${style.icon}`}>Q{q.number}</span>
                        {isComplete && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[11px]">check_circle</span> Complete
                          </span>
                        )}
                        {isPartial && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                            {filled}/{total} filled
                          </span>
                        )}
                        {!q.hasTable && (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                            Text only
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">{q.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed flex-1">{q.description}</p>

                  {/* Field preview chips */}
                  {q.hasTable && q.fields.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {q.fields.filter(f => !isFormulaKey(f.key)).slice(0, 4).map(f => {
                        const val = formData[f.key];
                        const hasValue = val && val !== '0' && val !== '';
                        return (
                          <span
                            key={f.key}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium border
                              ${hasValue ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}
                            `}
                          >
                            {f.title.split('(')[0].trim().split('—')[0].trim().slice(0, 18)}…
                          </span>
                        );
                      })}
                      {q.fields.filter(f => !isFormulaKey(f.key)).length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400">
                          +{q.fields.filter(f => !isFormulaKey(f.key)).length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  {q.hasTable ? (
                    <button
                      onClick={() => setActiveQuestion(q)}
                      className={`mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
                        ${isComplete
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : `text-white ${style.pill} hover:opacity-90 shadow-sm`
                        }
                      `}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isComplete ? 'edit' : 'edit_note'}
                      </span>
                      {isComplete ? 'Review & Edit' : isPartial ? 'Continue Entry' : 'Enter Data'}
                    </button>
                  ) : (
                    <div className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-slate-400 bg-slate-50 border border-dashed border-slate-200">
                      <span className="material-symbols-outlined text-base">article</span>
                      Narrative — no data entry
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PY uploaded note */}
        {isUploaded && (
          <div className="max-w-5xl mx-auto mt-6 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-blue-500">auto_awesome</span>
            <p className="text-sm text-blue-700">
              <strong>Previous Year data extracted from your PDF</strong> is pre-filled as reference inside each question&apos;s wizard.
              Highlighted in <span className="text-amber-600 font-semibold">amber</span> if not found.
            </p>
          </div>
        )}
      </div>

      {/* Sub-wizard modal */}
      {activeQuestion && (
        <QuestionWizard
          question={activeQuestion}
          formData={formData}
          pyData={pyData}
          fyMetrics={fyMetrics}
          onUpdate={handleUpdate}
          onClose={() => setActiveQuestion(null)}
        />
      )}
    </div>
  );
}
