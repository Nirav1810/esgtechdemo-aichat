import React, { useState } from 'react';
import { PyData, BrsrFormData, DerivedMetrics } from '../types';

interface FinalReviewProps {
  setCurrentView: (v: 'overview' | 'upload' | 'entry' | 'review' | 'excel-review') => void;
  formData: BrsrFormData;
  pyData: PyData;
  fyMetrics: DerivedMetrics;
  pyMetrics: DerivedMetrics;
  setIsReportGenerated: (v: boolean) => void;
}

const n = (v: string | number) => parseFloat(String(v)) || 0;
const fmt = (v: number, dp = 2) => v.toFixed(dp);
const loc = (v: number) => v.toLocaleString();

interface SectionProps {
  title: string;
  icon: string;
  color: string;       // tailwind color name e.g. "emerald"
  children: React.ReactNode;
}

function Section({ title, icon, color, children }: SectionProps) {
  const header: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    blue:    'bg-blue-50 text-blue-900 border-blue-200',
    cyan:    'bg-cyan-50 text-cyan-900 border-cyan-200',
    orange:  'bg-orange-50 text-orange-900 border-orange-200',
    red:     'bg-red-50 text-red-900 border-red-200',
    purple:  'bg-purple-50 text-purple-900 border-purple-200',
  };
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
      <div className={`flex items-center gap-2 px-6 py-3 border-b ${header[color]}`}>
        <span className="material-symbols-outlined text-sm">{icon}</span>
        <p className="font-bold text-sm">{title}</p>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, fyVal, pyVal, unit, formula }: { label: string; fyVal: string; pyVal?: string; unit?: string; formula?: boolean }) {
  return (
    <div className={`flex justify-between items-center text-sm ${formula ? 'pt-3 border-t border-outline-variant/20 font-bold' : ''}`}>
      <span className={formula ? 'text-on-surface' : 'text-on-surface-variant flex-1'}>{label} {unit && <span className="text-xs opacity-60">[{unit}]</span>}</span>
      <div className="flex gap-6 text-right">
        {pyVal !== undefined && <span className="text-on-surface-variant/60 w-28">{pyVal}</span>}
        <span className={`w-28 ${formula ? 'text-primary' : 'text-on-surface'}`}>{fyVal}</span>
      </div>
    </div>
  );
}

export default function FinalReview({ setCurrentView, formData, pyData, fyMetrics, pyMetrics, setIsReportGenerated }: FinalReviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

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
    <div className="flex-1 px-8 py-10 max-w-5xl mx-auto w-full pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-on-surface">Final Review — Principle 6</h1>
        <p className="text-on-surface-variant mt-2">Review all data below before generating your BRSR report. Use the column headers as a guide.</p>
        {/* Column legend */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant"><span className="w-3 h-3 rounded bg-on-surface-variant/20 inline-block"></span>Previous Year (PY)</div>
          <div className="flex items-center gap-2 text-xs text-primary font-semibold"><span className="w-3 h-3 rounded bg-primary inline-block"></span>Current Year (FY)</div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Q1 Energy */}
        <Section title="Q1 — Energy Consumption" icon="bolt" color="emerald">
          <Row label="Electricity — Renewable (A)" pyVal={loc(pyData.energy_A)} fyVal={loc(n(formData.energy_A))} unit="GJ" />
          <Row label="Fuel — Renewable (B)" pyVal={loc(pyData.energy_B)} fyVal={loc(n(formData.energy_B))} unit="GJ" />
          <Row label="Other Renewable (C)" pyVal={loc(pyData.energy_C)} fyVal={loc(n(formData.energy_C))} unit="GJ" />
          <Row label="Total Renewable (A+B+C)" pyVal={loc(pyMetrics.energy_renewable_total)} fyVal={loc(fyMetrics.energy_renewable_total)} unit="GJ" formula />
          <Row label="Electricity — Non-Renewable (D)" pyVal={loc(pyData.energy_D)} fyVal={loc(n(formData.energy_D))} unit="GJ" />
          <Row label="Fuel — Non-Renewable (E)" pyVal={loc(pyData.energy_E)} fyVal={loc(n(formData.energy_E))} unit="GJ" />
          <Row label="Other Non-Renewable (F)" pyVal={loc(pyData.energy_F)} fyVal={loc(n(formData.energy_F))} unit="GJ" />
          <Row label="Total Non-Renewable (D+E+F)" pyVal={loc(pyMetrics.energy_nonrenewable_total)} fyVal={loc(fyMetrics.energy_nonrenewable_total)} unit="GJ" formula />
          <Row label="Grand Total Energy" pyVal={loc(pyMetrics.energy_total)} fyVal={loc(fyMetrics.energy_total)} unit="GJ" formula />
          <Row label="Energy Intensity (per ₹ Cr)" pyVal={fmt(pyMetrics.energy_intensity_revenue, 4)} fyVal={fmt(fyMetrics.energy_intensity_revenue, 4)} unit="GJ/Cr" />
          <Row label="Energy Intensity (PPP)" pyVal={fmt(pyMetrics.energy_intensity_ppp, 4)} fyVal={fmt(fyMetrics.energy_intensity_ppp, 4)} unit="GJ/M USD" />
          <Row label="Energy Intensity (Production)" pyVal={fmt(pyMetrics.energy_intensity_production, 4)} fyVal={fmt(fyMetrics.energy_intensity_production, 4)} unit="GJ/MT" />
        </Section>

        {/* Q3 Water */}
        <Section title="Q3 — Water" icon="water_drop" color="blue">
          <Row label="(i) Surface water" pyVal={loc(pyData.water_surface)} fyVal={loc(n(formData.water_surface))} unit="kL" />
          <Row label="(ii) Groundwater" pyVal={loc(pyData.water_ground)} fyVal={loc(n(formData.water_ground))} unit="kL" />
          <Row label="(iii) Third party water" pyVal={loc(pyData.water_thirdparty)} fyVal={loc(n(formData.water_thirdparty))} unit="kL" />
          <Row label="(iv) Seawater / desalinated" pyVal={loc(pyData.water_seawater)} fyVal={loc(n(formData.water_seawater))} unit="kL" />
          <Row label="(v) Others" pyVal={loc(pyData.water_others)} fyVal={loc(n(formData.water_others))} unit="kL" />
          <Row label="Total Withdrawal" pyVal={loc(pyMetrics.water_withdrawal_total)} fyVal={loc(fyMetrics.water_withdrawal_total)} unit="kL" formula />
          <Row label="Total Consumption" pyVal={loc(pyData.water_consumption)} fyVal={loc(n(formData.water_consumption))} unit="kL" />
          <Row label="Water Intensity (per ₹ Cr)" pyVal={fmt(pyMetrics.water_intensity_revenue, 4)} fyVal={fmt(fyMetrics.water_intensity_revenue, 4)} unit="kL/Cr" />
          <Row label="Water Intensity (PPP)" pyVal={fmt(pyMetrics.water_intensity_ppp, 4)} fyVal={fmt(fyMetrics.water_intensity_ppp, 4)} unit="kL/M USD" />
          <Row label="Water Intensity (Production)" pyVal={fmt(pyMetrics.water_intensity_production, 4)} fyVal={fmt(fyMetrics.water_intensity_production, 4)} unit="kL/MT" />
        </Section>

        {/* Q4 Water Discharge */}
        <Section title="Q4 — Water Discharge" icon="water" color="cyan">
          <Row label="Surface — no treatment" pyVal={loc(pyData.wd_surface_notx)} fyVal={loc(n(formData.wd_surface_notx))} unit="kL" />
          <Row label="Surface — with treatment" pyVal={loc(pyData.wd_surface_tx)} fyVal={loc(n(formData.wd_surface_tx))} unit="kL" />
          <Row label="Groundwater — no treatment" pyVal={loc(pyData.wd_ground_notx)} fyVal={loc(n(formData.wd_ground_notx))} unit="kL" />
          <Row label="Groundwater — with treatment" pyVal={loc(pyData.wd_ground_tx)} fyVal={loc(n(formData.wd_ground_tx))} unit="kL" />
          <Row label="Seawater — no treatment" pyVal={loc(pyData.wd_sea_notx)} fyVal={loc(n(formData.wd_sea_notx))} unit="kL" />
          <Row label="Seawater — with treatment" pyVal={loc(pyData.wd_sea_tx)} fyVal={loc(n(formData.wd_sea_tx))} unit="kL" />
          <Row label="Third parties — no treatment" pyVal={loc(pyData.wd_third_notx)} fyVal={loc(n(formData.wd_third_notx))} unit="kL" />
          <Row label="Third parties — with treatment" pyVal={loc(pyData.wd_third_tx)} fyVal={loc(n(formData.wd_third_tx))} unit="kL" />
          <Row label="Others — no treatment" pyVal={loc(pyData.wd_others_notx)} fyVal={loc(n(formData.wd_others_notx))} unit="kL" />
          <Row label="Others — with treatment" pyVal={loc(pyData.wd_others_tx)} fyVal={loc(n(formData.wd_others_tx))} unit="kL" />
          <Row label="Total Discharged" pyVal={loc(pyMetrics.wd_total)} fyVal={loc(fyMetrics.wd_total)} unit="kL" formula />
        </Section>

        {/* Q6 Air Emissions */}
        <Section title="Q6 — Air Emissions" icon="air" color="orange">
          <Row label="NOx" pyVal={loc(pyData.air_nox)} fyVal={loc(n(formData.air_nox))} unit="MT" />
          <Row label="SOx" pyVal={loc(pyData.air_sox)} fyVal={loc(n(formData.air_sox))} unit="MT" />
          <Row label="Particulate Matter (PM)" pyVal={loc(pyData.air_pm)} fyVal={loc(n(formData.air_pm))} unit="MT" />
        </Section>

        {/* Q7 GHG */}
        <Section title="Q7 — GHG Emissions" icon="co2" color="red">
          <Row label="Scope 1 Emissions" pyVal={loc(pyData.ghg_scope1)} fyVal={loc(n(formData.ghg_scope1))} unit="tCO₂Eq" />
          <Row label="Scope 2 Emissions" pyVal={loc(pyData.ghg_scope2)} fyVal={loc(n(formData.ghg_scope2))} unit="tCO₂Eq" />
          <Row label="Total Scope 1 + 2" pyVal={loc(pyMetrics.ghg_total)} fyVal={loc(fyMetrics.ghg_total)} unit="tCO₂Eq" formula />
          <Row label="GHG Intensity (per ₹ Cr)" pyVal={fmt(pyMetrics.ghg_intensity_revenue, 4)} fyVal={fmt(fyMetrics.ghg_intensity_revenue, 4)} unit="tCO₂Eq/Cr" />
          <Row label="GHG Intensity (PPP)" pyVal={fmt(pyMetrics.ghg_intensity_ppp, 4)} fyVal={fmt(fyMetrics.ghg_intensity_ppp, 4)} unit="tCO₂Eq/M USD" />
          <Row label="GHG Intensity (Production)" pyVal={fmt(pyMetrics.ghg_intensity_production, 4)} fyVal={fmt(fyMetrics.ghg_intensity_production, 4)} unit="tCO₂Eq/MT" />
        </Section>

        {/* Q9 Waste */}
        <Section title="Q9 — Waste Management" icon="delete" color="purple">
          {(['A','B','C','D','E','F','G','H'] as const).map(k => {
            const labels: Record<string, string> = {
              A: 'Plastic waste (A)', B: 'E-waste (B)', C: 'Bio-medical waste (C)',
              D: 'Construction & demolition (D)', E: 'Battery waste (E)',
              F: 'Radioactive waste (F)', G: 'Other hazardous (G)', H: 'Other non-hazardous (H)',
            };
            const key = `waste_${k}` as keyof PyData;
            return <Row key={k} label={labels[k]} pyVal={loc(pyData[key] as number)} fyVal={loc(n(formData[key]))} unit="MT" />;
          })}
          <Row label="Total Waste Generated" pyVal={loc(pyMetrics.waste_total)} fyVal={loc(fyMetrics.waste_total)} unit="MT" formula />
          <Row label="Waste Intensity (per ₹ Cr)" pyVal={fmt(pyMetrics.waste_intensity_revenue, 4)} fyVal={fmt(fyMetrics.waste_intensity_revenue, 4)} unit="MT/Cr" />

          <div className="pt-3 mt-3 border-t border-outline-variant/20">
            <p className="text-xs font-bold text-purple-700 uppercase mb-3">Recovery</p>
            <Row label="(i) Recycled" pyVal={loc(pyData.waste_recycled)} fyVal={loc(n(formData.waste_recycled))} unit="MT" />
            <Row label="(ii) Re-used" pyVal={loc(pyData.waste_reused)} fyVal={loc(n(formData.waste_reused))} unit="MT" />
            <Row label="(iii) Other recovery" pyVal={loc(pyData.waste_recovery_other)} fyVal={loc(n(formData.waste_recovery_other))} unit="MT" />
            <Row label="Total Recovery" pyVal={loc(pyMetrics.waste_recovery_total)} fyVal={loc(fyMetrics.waste_recovery_total)} unit="MT" formula />
          </div>

          <div className="pt-3 mt-3 border-t border-outline-variant/20">
            <p className="text-xs font-bold text-purple-700 uppercase mb-3">Disposal</p>
            <Row label="(i) Incineration" pyVal={loc(pyData.waste_incineration)} fyVal={loc(n(formData.waste_incineration))} unit="MT" />
            <Row label="(ii) Landfilling" pyVal={loc(pyData.waste_landfill)} fyVal={loc(n(formData.waste_landfill))} unit="MT" />
            <Row label="(iii) Landfilling after incineration" pyVal={loc(pyData.waste_landfill_incineration)} fyVal={loc(n(formData.waste_landfill_incineration))} unit="MT" />
            <Row label="Total Disposal" pyVal={loc(pyMetrics.waste_disposal_total)} fyVal={loc(fyMetrics.waste_disposal_total)} unit="MT" formula />
          </div>
        </Section>

      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
        <button onClick={() => setCurrentView('entry')} className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors">
          Go Back & Edit
        </button>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isGenerating ? (
            <><span className="material-symbols-outlined animate-spin text-lg">autorenew</span><span>Generating…</span></>
          ) : (
            <><span className="material-symbols-outlined text-lg">download</span><span>Generate BRSR Report</span></>
          )}
        </button>
      </div>
    </div>
  );
}
