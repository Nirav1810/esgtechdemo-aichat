'use client';

import React, { useState } from 'react';
import {
  PyData, BrsrFormData, DerivedMetrics,
  STEPS_CONFIG, StepConfig, isFormulaKey,
  computeMetrics, PPP_FACTOR,
} from '../types';

interface ExcelReviewProps {
  setCurrentView: (v: 'overview' | 'upload' | 'entry' | 'review' | 'excel-review') => void;
  formData: BrsrFormData;
  setFormData: (d: BrsrFormData) => void;
  pyData: PyData;
  fyMetrics: DerivedMetrics;
  pyMetrics: DerivedMetrics;
  setIsReportGenerated: (v: boolean) => void;
}

// ─── Sections grouping ────────────────────────────────────────────────────────

interface SectionMeta {
  id: string;
  label: string;
  icon: string;
  color: string;
  accent: string;
  border: string;
  bg: string;
}

const SECTIONS: SectionMeta[] = [
  { id: 'Q1', label: 'Q1 — Energy Consumption & Intensity',    icon: 'bolt',         color: 'text-emerald-700', accent: 'bg-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50' },
  { id: 'Q3', label: 'Q3 — Water Withdrawal & Consumption',    icon: 'water_drop',   color: 'text-blue-700',    accent: 'bg-blue-600',    border: 'border-blue-200',    bg: 'bg-blue-50' },
  { id: 'Q4', label: 'Q4 — Water Discharge',                   icon: 'water',        color: 'text-cyan-700',    accent: 'bg-cyan-600',    border: 'border-cyan-200',    bg: 'bg-cyan-50' },
  { id: 'Q6', label: 'Q6 — Air Emissions',                     icon: 'air',          color: 'text-orange-700',  accent: 'bg-orange-600',  border: 'border-orange-200',  bg: 'bg-orange-50' },
  { id: 'Q7', label: 'Q7 — GHG Emissions & Intensity',         icon: 'co2',          color: 'text-red-700',     accent: 'bg-red-600',     border: 'border-red-200',     bg: 'bg-red-50' },
  { id: 'Q9', label: 'Q9 — Waste Management',                  icon: 'delete_sweep', color: 'text-purple-700',  accent: 'bg-purple-600',  border: 'border-purple-200',  bg: 'bg-purple-50' },
];

// ─── Number formatter ─────────────────────────────────────────────────────────

const fmtNum = (v: string | number, dp = 2): string => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (!isFinite(n) || n === 0) return '—';
  return n % 1 === 0 ? n.toLocaleString('en-IN') : n.toFixed(dp);
};

// ─── Table components ─────────────────────────────────────────────────────────

function TableHeader({ bg, border, color }: { bg: string; border: string; color: string }) {
  return (
    <div className={`grid grid-cols-[1fr_80px_120px_120px] text-xs font-bold uppercase tracking-wide ${bg} ${border} border-b px-4 py-2.5 rounded-t-xl`}>
      <span className={color}>Parameter</span>
      <span className={`text-center ${color}`}>Unit</span>
      <span className={`text-right ${color}`}>FY 2024-25</span>
      <span className="text-right text-slate-400">FY 2023-24 (PY)</span>
    </div>
  );
}

interface FieldRowProps {
  step: StepConfig;
  fyValue: string;
  pyValue: number;
  isFormula?: boolean;
  isAlternate?: boolean;
  onChange?: (val: string) => void;
}

function FieldRow({ step, fyValue, pyValue, isFormula, isAlternate, onChange }: FieldRowProps) {
  const rowBase = isAlternate ? 'bg-slate-50/60' : 'bg-white';
  const formulaStyle = isFormula ? 'bg-emerald-50/80' : rowBase;

  return (
    <div className={`grid grid-cols-[1fr_80px_120px_120px] items-center px-4 py-2.5 border-b border-slate-100 last:border-0 ${formulaStyle} transition-colors group`}>
      {/* Parameter */}
      <span className={`text-sm ${isFormula ? 'font-semibold text-emerald-800' : 'text-slate-700'} leading-snug`}>
        {step.title}
        {isFormula && (
          <span className="ml-2 text-[10px] text-emerald-600 font-medium bg-emerald-100 px-1.5 py-0.5 rounded-full">auto</span>
        )}
      </span>

      {/* Unit */}
      <span className="text-center text-xs text-slate-400 font-mono">{step.unit}</span>

      {/* FY value — editable (unless formula) */}
      <div className="flex justify-end">
        {isFormula ? (
          <span className="text-sm font-bold text-emerald-700 font-mono">
            {fmtNum(fyValue)}
          </span>
        ) : (
          <input
            type="text"
            inputMode="decimal"
            value={fyValue === '0' || fyValue === '' ? '' : fyValue}
            placeholder="—"
            onChange={e => onChange?.(e.target.value.replace(/[^0-9.-]/g, ''))}
            className="w-28 text-right text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent 
              focus:border-slate-400 focus:outline-none placeholder:text-slate-300 transition-colors font-mono
              hover:border-slate-200"
          />
        )}
      </div>

      {/* PY value — always read-only */}
      <div className="flex justify-end">
        <span className="text-sm text-slate-400 font-mono select-none">
          {pyValue ? pyValue.toLocaleString('en-IN') : '—'}
        </span>
      </div>
    </div>
  );
}

// ─── Computed-row (totals) ─────────────────────────────────────────────────────

function ComputedRow({ label, fyVal, pyVal, unit, grand = false }: {
  label: string; fyVal: number; pyVal: number; unit: string; grand?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[1fr_80px_120px_120px] items-center px-4 py-3 border-b border-slate-100 last:border-0
      ${grand ? 'bg-emerald-100/60 border-t-2 border-t-emerald-300' : 'bg-emerald-50/40 border-t border-t-emerald-200'}`}
    >
      <span className={`text-sm font-bold ${grand ? 'text-emerald-900' : 'text-emerald-800'}`}>{label}</span>
      <span className="text-center text-xs text-slate-400 font-mono">{unit}</span>
      <span className={`text-right text-sm font-bold font-mono ${grand ? 'text-emerald-700' : 'text-emerald-600'}`}>
        {fyVal ? fyVal.toLocaleString('en-IN') : '0'}
      </span>
      <span className="text-right text-sm text-slate-400 font-mono">
        {pyVal ? pyVal.toLocaleString('en-IN') : '—'}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ExcelReview({
  setCurrentView,
  formData,
  setFormData,
  pyData,
  fyMetrics,
  pyMetrics,
  setIsReportGenerated,
}: ExcelReviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (key: keyof BrsrFormData, val: string) => {
    const next = { ...formData, [key]: val };
    if (key === 'Revenue') {
      const rev = parseFloat(val.replace(/,/g, ''));
      next.RevenuePPP = rev > 0 ? String(Math.round((rev * 10) / PPP_FACTOR)) : '';
    }
    setFormData(next);
  };

  // Live FY metrics (recalculate on edit)
  const liveFY = computeMetrics(formData, parseFloat(formData.RevenuePPP) || 0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/brsr/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: 'brsr-report',
          contextData: JSON.stringify({ formData, pyData, fyMetrics: liveFY, pyMetrics }),
        }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BRSR_P6_Report_FY25_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsReportGenerated(true);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Report generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fields per section (no formula keys in editable rows)
  const fieldsBySection = (sectionId: string): StepConfig[] =>
    STEPS_CONFIG.filter(s => s.section === sectionId);

  // Count filled fields
  const inputFields = STEPS_CONFIG.filter(s => !isFormulaKey(s.key));
  const filled = inputFields.filter(s => {
    const v = formData[s.key];
    return v !== '' && v !== '0' && v !== undefined;
  }).length;
  const pct = inputFields.length > 0 ? Math.round((filled / inputFields.length) * 100) : 0;

  return (
    <div className="flex-1 w-full flex flex-col">

      {/* ── Sticky top bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setCurrentView('entry')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Entry
          </button>

          <div className="flex-1">
            <h1 className="text-base font-extrabold text-slate-800">Excel Data Review</h1>
            <p className="text-xs text-slate-500">
              {filled}/{inputFields.length} fields filled ({pct}%) · FY column is editable · PY column is read-only
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-emerald-700">{pct}%</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 text-white rounded-full font-bold text-sm 
              shadow-lg shadow-emerald-700/20 hover:scale-[1.03] active:scale-95 transition-all 
              disabled:opacity-60 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <><span className="material-symbols-outlined animate-spin text-base">autorenew</span> Generating…</>
            ) : (
              <><span className="material-symbols-outlined text-base">download</span> Generate PDF Report</>
            )}
          </button>
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-100 px-8 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center gap-6 text-xs text-amber-800 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-500">edit</span>
            <strong>FY 2024-25 column is editable</strong> — click any value to correct it
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-slate-400">lock</span>
            <span className="text-slate-500"><strong>PY 2023-24 column is read-only</strong> reference data</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-200 inline-block" />
            <span className="text-emerald-700">Green rows are auto-calculated totals</span>
          </span>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Q1 — Energy */}
          {(() => {
            const meta = SECTIONS[0];
            const fields = fieldsBySection('Q1');
            return (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${meta.border}`}>
                {/* Section header */}
                <div className={`flex items-center gap-3 px-5 py-3 ${meta.bg} border-b ${meta.border}`}>
                  <span className={`material-symbols-outlined text-lg ${meta.color}`}>{meta.icon}</span>
                  <h2 className={`font-bold text-sm ${meta.color}`}>{meta.label}</h2>
                </div>
                <TableHeader bg={meta.bg} border={meta.border} color={meta.color} />

                {/* Renewable sub-group */}
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">From renewable sources</span>
                </div>
                {(['energy_A', 'energy_B', 'energy_C'] as const).map((k, i) => {
                  const step = fields.find(f => f.key === k)!;
                  return <FieldRow key={k} step={step} fyValue={formData[k]} pyValue={pyData[k]} isAlternate={i % 2 === 1} onChange={v => handleChange(k, v)} />;
                })}
                <ComputedRow label="Total energy from renewable sources (A+B+C)" unit="GJ" fyVal={liveFY.energy_renewable_total} pyVal={pyMetrics.energy_renewable_total} />

                {/* Non-renewable sub-group */}
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">From non-renewable sources</span>
                </div>
                {(['energy_D', 'energy_E', 'energy_F'] as const).map((k, i) => {
                  const step = fields.find(f => f.key === k)!;
                  return <FieldRow key={k} step={step} fyValue={formData[k]} pyValue={pyData[k]} isAlternate={i % 2 === 1} onChange={v => handleChange(k, v)} />;
                })}
                <ComputedRow label="Total energy from non-renewable sources (D+E+F)" unit="GJ" fyVal={liveFY.energy_nonrenewable_total} pyVal={pyMetrics.energy_nonrenewable_total} />
                <ComputedRow label="Grand Total Energy (A+B+C+D+E+F)" unit="GJ" fyVal={liveFY.energy_total} pyVal={pyMetrics.energy_total} grand />

                {/* Financials & intensity */}
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Financials & Intensity denominators</span>
                </div>
                {(['Revenue', 'RevenuePPP', 'Production'] as const).map((k, i) => {
                  const step = fields.find(f => f.key === k)!;
                  return (
                    <FieldRow
                      key={k}
                      step={step}
                      fyValue={formData[k]}
                      pyValue={pyData[k]}
                      isFormula={k === 'RevenuePPP'}
                      isAlternate={i % 2 === 1}
                      onChange={v => handleChange(k, v)}
                    />
                  );
                })}
              </div>
            );
          })()}

          {/* Q3 — Water */}
          {(() => {
            const meta = SECTIONS[1];
            const fields = fieldsBySection('Q3');
            return (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${meta.border}`}>
                <div className={`flex items-center gap-3 px-5 py-3 ${meta.bg} border-b ${meta.border}`}>
                  <span className={`material-symbols-outlined text-lg ${meta.color}`}>{meta.icon}</span>
                  <h2 className={`font-bold text-sm ${meta.color}`}>{meta.label}</h2>
                </div>
                <TableHeader bg={meta.bg} border={meta.border} color={meta.color} />
                {fields.map((step, i) => (
                  <FieldRow key={step.key} step={step} fyValue={formData[step.key]} pyValue={pyData[step.key]} isAlternate={i % 2 === 1} onChange={v => handleChange(step.key, v)} />
                ))}
                <ComputedRow label="Total water withdrawal (i+ii+iii+iv+v)" unit="kL" fyVal={liveFY.water_withdrawal_total} pyVal={pyMetrics.water_withdrawal_total} grand />
              </div>
            );
          })()}

          {/* Q4 — Water Discharge */}
          {(() => {
            const meta = SECTIONS[2];
            const fields = fieldsBySection('Q4');
            const groups = [
              { label: 'To Surface water',  keys: ['wd_surface_notx', 'wd_surface_tx'] },
              { label: 'To Groundwater',    keys: ['wd_ground_notx', 'wd_ground_tx'] },
              { label: 'To Seawater',       keys: ['wd_sea_notx', 'wd_sea_tx'] },
              { label: 'To Third parties',  keys: ['wd_third_notx', 'wd_third_tx'] },
              { label: 'Others',            keys: ['wd_others_notx', 'wd_others_tx'] },
            ] as const;
            return (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${meta.border}`}>
                <div className={`flex items-center gap-3 px-5 py-3 ${meta.bg} border-b ${meta.border}`}>
                  <span className={`material-symbols-outlined text-lg ${meta.color}`}>{meta.icon}</span>
                  <h2 className={`font-bold text-sm ${meta.color}`}>{meta.label}</h2>
                </div>
                <TableHeader bg={meta.bg} border={meta.border} color={meta.color} />
                {groups.map(g => (
                  <React.Fragment key={g.label}>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{g.label}</span>
                    </div>
                    {g.keys.map((k, i) => {
                      const step = fields.find(f => f.key === k)!;
                      return <FieldRow key={k} step={step} fyValue={formData[k]} pyValue={pyData[k]} isAlternate={i % 2 === 1} onChange={v => handleChange(k, v)} />;
                    })}
                  </React.Fragment>
                ))}
                <ComputedRow label="Total water discharged" unit="kL" fyVal={liveFY.wd_total} pyVal={pyMetrics.wd_total} grand />
              </div>
            );
          })()}

          {/* Q6 — Air Emissions */}
          {(() => {
            const meta = SECTIONS[3];
            const fields = fieldsBySection('Q6');
            return (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${meta.border}`}>
                <div className={`flex items-center gap-3 px-5 py-3 ${meta.bg} border-b ${meta.border}`}>
                  <span className={`material-symbols-outlined text-lg ${meta.color}`}>{meta.icon}</span>
                  <h2 className={`font-bold text-sm ${meta.color}`}>{meta.label}</h2>
                </div>
                <TableHeader bg={meta.bg} border={meta.border} color={meta.color} />
                {fields.map((step, i) => (
                  <FieldRow key={step.key} step={step} fyValue={formData[step.key]} pyValue={pyData[step.key]} isAlternate={i % 2 === 1} onChange={v => handleChange(step.key, v)} />
                ))}
              </div>
            );
          })()}

          {/* Q7 — GHG */}
          {(() => {
            const meta = SECTIONS[4];
            const fields = fieldsBySection('Q7');
            return (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${meta.border}`}>
                <div className={`flex items-center gap-3 px-5 py-3 ${meta.bg} border-b ${meta.border}`}>
                  <span className={`material-symbols-outlined text-lg ${meta.color}`}>{meta.icon}</span>
                  <h2 className={`font-bold text-sm ${meta.color}`}>{meta.label}</h2>
                </div>
                <TableHeader bg={meta.bg} border={meta.border} color={meta.color} />
                {fields.map((step, i) => (
                  <FieldRow key={step.key} step={step} fyValue={formData[step.key]} pyValue={pyData[step.key]} isAlternate={i % 2 === 1} onChange={v => handleChange(step.key, v)} />
                ))}
                <ComputedRow label="Total Scope 1 + 2 emissions" unit="tCO₂Eq" fyVal={liveFY.ghg_total} pyVal={pyMetrics.ghg_total} grand />
              </div>
            );
          })()}

          {/* Q9 — Waste */}
          {(() => {
            const meta = SECTIONS[5];
            const generatedKeys = ['waste_A','waste_B','waste_C','waste_D','waste_E','waste_F','waste_G','waste_H'] as const;
            const recoveryKeys  = ['waste_recycled','waste_reused','waste_recovery_other'] as const;
            const disposalKeys  = ['waste_incineration','waste_landfill','waste_landfill_incineration'] as const;
            const allFields = fieldsBySection('Q9');
            return (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${meta.border}`}>
                <div className={`flex items-center gap-3 px-5 py-3 ${meta.bg} border-b ${meta.border}`}>
                  <span className={`material-symbols-outlined text-lg ${meta.color}`}>{meta.icon}</span>
                  <h2 className={`font-bold text-sm ${meta.color}`}>{meta.label}</h2>
                </div>
                <TableHeader bg={meta.bg} border={meta.border} color={meta.color} />

                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waste Generated (MT)</span>
                </div>
                {generatedKeys.map((k, i) => {
                  const step = allFields.find(f => f.key === k)!;
                  return <FieldRow key={k} step={step} fyValue={formData[k]} pyValue={pyData[k]} isAlternate={i % 2 === 1} onChange={v => handleChange(k, v)} />;
                })}
                <ComputedRow label="Total waste generated (A+B+…+H)" unit="MT" fyVal={liveFY.waste_total} pyVal={pyMetrics.waste_total} grand />

                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waste Recovery (MT)</span>
                </div>
                {recoveryKeys.map((k, i) => {
                  const step = allFields.find(f => f.key === k)!;
                  return <FieldRow key={k} step={step} fyValue={formData[k]} pyValue={pyData[k]} isAlternate={i % 2 === 1} onChange={v => handleChange(k, v)} />;
                })}
                <ComputedRow label="Total waste recovered" unit="MT" fyVal={liveFY.waste_recovery_total} pyVal={pyMetrics.waste_recovery_total} />

                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waste Disposal (MT)</span>
                </div>
                {disposalKeys.map((k, i) => {
                  const step = allFields.find(f => f.key === k)!;
                  return <FieldRow key={k} step={step} fyValue={formData[k]} pyValue={pyData[k]} isAlternate={i % 2 === 1} onChange={v => handleChange(k, v)} />;
                })}
                <ComputedRow label="Total waste disposed" unit="MT" fyVal={liveFY.waste_disposal_total} pyVal={pyMetrics.waste_disposal_total} />
              </div>
            );
          })()}

        </div>

        {/* Bottom spacer + action row */}
        <div className="max-w-5xl mx-auto mt-10 flex justify-center gap-4 pb-12">
          <button
            onClick={() => setCurrentView('entry')}
            className="px-8 py-3.5 rounded-full font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            ← Back to Entry
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <><span className="material-symbols-outlined animate-spin">autorenew</span> Generating…</>
            ) : (
              <><span className="material-symbols-outlined">download</span> Generate PDF Report</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
