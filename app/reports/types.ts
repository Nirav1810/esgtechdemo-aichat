/**
 * Central type definitions and formula engine for BRSR Principle 6 reporting.
 * All tabular questions: Q1 Energy, Q3 Water, Q4 Water Discharge,
 * Q6 Air Emissions, Q7 GHG, Q9 Waste.
 */

// ─── Raw PY Data (user-entered or LLM-extracted) ────────────────────────────

export interface PyData {
  // Q1: Energy — raw inputs
  energy_A: number;       // Electricity from renewable (GJ)
  energy_B: number;       // Fuel from renewable (GJ)
  energy_C: number;       // Other renewable sources (GJ)
  energy_D: number;       // Electricity from non-renewable (GJ)
  energy_E: number;       // Fuel from non-renewable (GJ)
  energy_F: number;       // Other non-renewable sources (GJ)
  Revenue: number;        // Revenue from operations (₹ Cr)
  Production: number;     // Physical output / production (MT)

  // Q1: Energy — formula fields
  RevenuePPP: number;     // Revenue × 10 / 20.66 (M USD)

  // Q3: Water — raw inputs
  water_surface: number;     // Surface water withdrawal (kL)
  water_ground: number;      // Groundwater withdrawal (kL)
  water_thirdparty: number;  // Third party water (kL)
  water_seawater: number;    // Seawater / desalinated (kL)
  water_others: number;      // Others (kL)
  water_consumption: number; // Total volume of water consumption (kL)

  // Q4: Water Discharge — raw inputs (kL)
  wd_surface_notx: number;  // Surface — no treatment
  wd_surface_tx: number;    // Surface — with treatment
  wd_ground_notx: number;   // Groundwater — no treatment
  wd_ground_tx: number;     // Groundwater — with treatment
  wd_sea_notx: number;      // Seawater — no treatment
  wd_sea_tx: number;        // Seawater — with treatment
  wd_third_notx: number;    // Third party — no treatment
  wd_third_tx: number;      // Third party — with treatment
  wd_others_notx: number;   // Others — no treatment
  wd_others_tx: number;     // Others — with treatment

  // Q6: Air Emissions (MT)
  air_nox: number;
  air_sox: number;
  air_pm: number;

  // Q7: GHG Emissions (tCO₂Eq)
  ghg_scope1: number;
  ghg_scope2: number;

  // Q9: Waste — generated (MT)
  waste_A: number;  // Plastic
  waste_B: number;  // E-waste
  waste_C: number;  // Bio-medical
  waste_D: number;  // Construction & demolition
  waste_E: number;  // Battery
  waste_F: number;  // Radioactive
  waste_G: number;  // Other hazardous
  waste_H: number;  // Other non-hazardous

  // Q9: Waste — recovery (MT)
  waste_recycled: number;
  waste_reused: number;
  waste_recovery_other: number;

  // Q9: Waste — disposal (MT)
  waste_incineration: number;
  waste_landfill: number;
  waste_landfill_incineration: number;

  // Theory Questions
  theory_q1: string;
  theory_q2: string;
  theory_q3: string;
  theory_q4: string;
  theory_q5: string;
  theory_q6: string;
  theory_q7: string;
  theory_q8: string;
  theory_q9: string;
  theory_q10: string;
  theory_q11: string;
  theory_q12: string;
  theory_q13: string;
}

export const DEFAULT_PY_DATA: PyData = {
  energy_A: 0, energy_B: 0, energy_C: 0,
  energy_D: 0, energy_E: 0, energy_F: 0,
  Revenue: 0, Production: 0, RevenuePPP: 0,
  water_surface: 0, water_ground: 0, water_thirdparty: 0,
  water_seawater: 0, water_others: 0, water_consumption: 0,
  wd_surface_notx: 0, wd_surface_tx: 0,
  wd_ground_notx: 0, wd_ground_tx: 0,
  wd_sea_notx: 0, wd_sea_tx: 0,
  wd_third_notx: 0, wd_third_tx: 0,
  wd_others_notx: 0, wd_others_tx: 0,
  air_nox: 0, air_sox: 0, air_pm: 0,
  ghg_scope1: 0, ghg_scope2: 0,
  waste_A: 0, waste_B: 0, waste_C: 0, waste_D: 0,
  waste_E: 0, waste_F: 0, waste_G: 0, waste_H: 0,
  waste_recycled: 0, waste_reused: 0, waste_recovery_other: 0,
  waste_incineration: 0, waste_landfill: 0, waste_landfill_incineration: 0,
  theory_q1: '', theory_q2: '', theory_q3: '', theory_q4: '',
  theory_q5: '', theory_q6: '', theory_q7: '', theory_q8: '', theory_q9: '',
  theory_q10: '', theory_q11: '', theory_q12: '', theory_q13: '',
};

// ─── Current-Year Form Data (wizard entries) ─────────────────────────────────

export type BrsrFormData = Record<keyof PyData, string>;

export const DEFAULT_FORM_DATA: BrsrFormData = Object.fromEntries(
  Object.keys(DEFAULT_PY_DATA).map(k => [k, ''])
) as BrsrFormData;

// ─── Derived (formula) calculations ─────────────────────────────────────────

export interface DerivedMetrics {
  // Q1 Energy
  energy_renewable_total: number;    // A+B+C
  energy_nonrenewable_total: number; // D+E+F
  energy_total: number;              // A+B+C+D+E+F
  energy_intensity_revenue: number;  // total / Revenue
  energy_intensity_ppp: number;      // total / RevenuePPP
  energy_intensity_production: number; // total / Production
  RevenuePPP: number;                // Revenue × 10 / 20.66

  // Q3 Water
  water_withdrawal_total: number;    // i+ii+iii+iv+v
  water_intensity_revenue: number;   // consumption / Revenue
  water_intensity_ppp: number;       // consumption / RevenuePPP
  water_intensity_production: number; // consumption / Production

  // Q4 Water Discharge
  wd_total: number;                  // sum of all discharge rows

  // Q7 GHG
  ghg_total: number;                 // scope1 + scope2
  ghg_intensity_revenue: number;     // total / Revenue
  ghg_intensity_ppp: number;         // total / RevenuePPP
  ghg_intensity_production: number;  // total / Production

  // Q9 Waste
  waste_total: number;               // A+B+C+D+E+F+G+H
  waste_intensity_revenue: number;   // total / Revenue
  waste_intensity_ppp: number;       // total / RevenuePPP
  waste_intensity_production: number; // total / Production
  waste_recovery_total: number;      // recycled + reused + other_recovery
  waste_disposal_total: number;      // incineration + landfill + landfill_incineration
}

/**
 * PPP conversion factor: 1 M USD (PPP) ≈ this many Crore INR.
 * Formula from SEBI BRSR: Revenue(Cr) × 10 / PPP_FACTOR = Revenue(M USD PPP).
 * 10 converts Crores → Millions of INR; PPP_FACTOR converts M INR → M USD.
 * Source: World Bank ICP 2017 round ≈ 20.66 INR / international dollar.
 */
export const PPP_FACTOR = 20.66;

/**
 * Round to N decimal places — mirrors Excel ROUND(x, N).
 * We use 10 d.p. for intensity metrics to match ROUND(x,10) in xlsx formulas.
 */
const roundTo = (v: number, dp: number): number =>
  Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp);

/** Safe division: returns 0 when denominator is 0 or NaN. */
const safeDivide = (num: number, den: number, dp = 10): number =>
  den > 0 && isFinite(num) && isFinite(den) ? roundTo(num / den, dp) : 0;

/** Compute all derived metrics from either pyData or formData (stringified). */
export function computeMetrics(
  data: PyData | BrsrFormData,
  revenuePPP?: number
): DerivedMetrics {
  const n = (key: keyof PyData): number => {
    const val = data[key];
    if (typeof val === 'number') return isFinite(val) ? val : 0;
    if (typeof val === 'string') return parseFloat(val.replace(/,/g, '')) || 0;
    return 0;
  };

  const revenue = n('Revenue');

  // RevenuePPP: Excel row 25/43/89/109 has NO formula — entities enter it manually.
  // We auto-derive it if not explicitly provided: Revenue(Cr) × 10 ÷ PPP_FACTOR = M USD (PPP).
  const ppp = (revenuePPP !== undefined && revenuePPP > 0)
    ? revenuePPP
    : (revenue > 0 ? roundTo((revenue * 10) / PPP_FACTOR, 4) : 0);

  const prod = n('Production');

  // ── Q1 Energy (Excel R17, R22, R23) ──────────────────────────────────────
  // R17: SUM(F14:F16) = A+B+C
  const A = n('energy_A'), B = n('energy_B'), C = n('energy_C');
  const renewTotal = A + B + C;
  // R22: SUM(F19:F21) = D+E+F
  const D = n('energy_D'), E = n('energy_E'), F = n('energy_F');
  const nonRenewTotal = D + E + F;
  // R23: SUM(F17,F22)
  const energyTotal = renewTotal + nonRenewTotal;
  // R24: ROUND(energyTotal / Revenue, 10)
  const energyIntensityRevenue = safeDivide(energyTotal, revenue);
  // R25: ROUND(energyTotal / RevenuePPP, 10)  [no Excel formula — we compute]
  const energyIntensityPPP = safeDivide(energyTotal, ppp);
  // R26: ROUND(energyTotal / Production, 10)   [no Excel formula — we compute]
  const energyIntensityProduction = safeDivide(energyTotal, prod);

  // ── Q3 Water (Excel R40, R42) ─────────────────────────────────────────────
  // R40: SUM(E35:E39) = surface+ground+thirdparty+seawater+others
  const waterWithdrawTotal =
    n('water_surface') + n('water_ground') + n('water_thirdparty') +
    n('water_seawater') + n('water_others');
  // R41: water_consumption (direct entry)
  const waterConsumption = n('water_consumption');
  // R42: ROUND(water_consumption / Revenue, 10)  — NOT withdrawal, CONSUMPTION
  const waterIntensityRevenue = safeDivide(waterConsumption, revenue);
  // R43: ROUND(water_consumption / RevenuePPP, 10) [no Excel formula — we compute]
  const waterIntensityPPP = safeDivide(waterConsumption, ppp);
  // R44: ROUND(water_consumption / Production, 10) [no Excel formula — we compute]
  const waterIntensityProduction = safeDivide(waterConsumption, prod);

  // ── Q4 Water Discharge (Excel R51,R54,R57,R60,R63,R66) ───────────────────
  // Each destination subtotal: SUM(no_treatment + with_treatment)
  const wdSurface  = n('wd_surface_notx')  + n('wd_surface_tx');
  const wdGround   = n('wd_ground_notx')   + n('wd_ground_tx');
  const wdSea      = n('wd_sea_notx')      + n('wd_sea_tx');
  const wdThird    = n('wd_third_notx')    + n('wd_third_tx');
  const wdOthers   = n('wd_others_notx')   + n('wd_others_tx');
  // R66: SUM(surface,ground,sea,third,others)
  const wdTotal    = wdSurface + wdGround + wdSea + wdThird + wdOthers;

  // ── Q7 GHG (Excel R88) ────────────────────────────────────────────────────
  const scope1 = n('ghg_scope1');
  const scope2 = n('ghg_scope2');
  const ghgTotal = scope1 + scope2;
  // R88: IF(OR(scope1="",scope2=""),"",ROUND(SUM(scope1,scope2)/Revenue,10))
  // Both scopes must be present for intensity; treat 0 as "not entered" only if
  // the raw field is empty — here we apply the formula whenever ghgTotal > 0.
  const ghgIntensityRevenue    = safeDivide(ghgTotal, revenue);
  const ghgIntensityPPP        = safeDivide(ghgTotal, ppp);
  const ghgIntensityProduction = safeDivide(ghgTotal, prod);

  // ── Q9 Waste Generated (Excel R107, R108) ────────────────────────────────
  // R107: SUM(E99:E106) = A+B+C+D+E+F+G+H
  const wasteTotal =
    n('waste_A') + n('waste_B') + n('waste_C') + n('waste_D') +
    n('waste_E') + n('waste_F') + n('waste_G') + n('waste_H');
  // R108: ROUND(wasteTotal / Revenue, 10)
  const wasteIntensityRevenue    = safeDivide(wasteTotal, revenue);
  const wasteIntensityPPP        = safeDivide(wasteTotal, ppp);
  const wasteIntensityProduction = safeDivide(wasteTotal, prod);

  // ── Q9 Waste Recovery (Excel R117: SUM(E114:E116)) ───────────────────────
  const wasteRecoveryTotal =
    n('waste_recycled') + n('waste_reused') + n('waste_recovery_other');

  // ── Q9 Waste Disposal (Excel R123: SUM(E120:E122)) ───────────────────────
  const wasteDisposalTotal =
    n('waste_incineration') + n('waste_landfill') + n('waste_landfill_incineration');

  return {
    energy_renewable_total:     renewTotal,
    energy_nonrenewable_total:  nonRenewTotal,
    energy_total:               energyTotal,
    energy_intensity_revenue:   energyIntensityRevenue,
    energy_intensity_ppp:       energyIntensityPPP,
    energy_intensity_production: energyIntensityProduction,
    RevenuePPP:                 ppp,

    water_withdrawal_total:     waterWithdrawTotal,
    water_intensity_revenue:    waterIntensityRevenue,
    water_intensity_ppp:        waterIntensityPPP,
    water_intensity_production: waterIntensityProduction,

    wd_total: wdTotal,

    ghg_total:               ghgTotal,
    ghg_intensity_revenue:   ghgIntensityRevenue,
    ghg_intensity_ppp:       ghgIntensityPPP,
    ghg_intensity_production: ghgIntensityProduction,

    waste_total:               wasteTotal,
    waste_intensity_revenue:   wasteIntensityRevenue,
    waste_intensity_ppp:       wasteIntensityPPP,
    waste_intensity_production: wasteIntensityProduction,
    waste_recovery_total:      wasteRecoveryTotal,
    waste_disposal_total:      wasteDisposalTotal,
  };
}

// ─── Step Configuration ───────────────────────────────────────────────────────

export interface StepConfig {
  key: keyof PyData;
  title: string;
  category: string;
  section: string;   // Q1, Q3, Q4, Q6, Q7, Q9
  unit: string;
  tip: string;
}

export const STEPS_CONFIG: StepConfig[] = [
  // ── Q1: Energy ──────────────────────────────────────────────────────────
  { key: 'energy_A', section: 'Q1', unit: 'GJ', category: 'renewable sources', title: 'Total electricity consumption (A)', tip: 'Include only electricity verified from renewable grids or green tariffs.' },
  { key: 'energy_B', section: 'Q1', unit: 'GJ', category: 'renewable sources', title: 'Total fuel consumption (B)', tip: 'Includes biofuels and biogas used directly in your operations.' },
  { key: 'energy_C', section: 'Q1', unit: 'GJ', category: 'renewable sources', title: 'Energy through other sources (C)', tip: 'Include solar, wind, and hydro directly produced on-site.' },
  { key: 'energy_D', section: 'Q1', unit: 'GJ', category: 'non-renewable sources', title: 'Total electricity consumption (D)', tip: 'Standard grid electricity from non-renewable sources.' },
  { key: 'energy_E', section: 'Q1', unit: 'GJ', category: 'non-renewable sources', title: 'Total fuel consumption (E)', tip: 'Diesel, petrol, coal, and natural gas.' },
  { key: 'energy_F', section: 'Q1', unit: 'GJ', category: 'non-renewable sources', title: 'Energy through other sources (F)', tip: 'Any other non-renewable energy purchased or generated.' },
  { key: 'Revenue',  section: 'Q1', unit: '₹ Cr', category: 'financials', title: 'Revenue from operations', tip: 'Used to calculate Energy Intensity. Enter in Crores INR.' },
  { key: 'RevenuePPP', section: 'Q1', unit: 'M USD', category: 'financials', title: 'Revenue adjusted for PPP', tip: 'Auto-calculated: Revenue × 10 ÷ 20.66. Required for PPP-adjusted intensity.' },
  { key: 'Production', section: 'Q1', unit: 'MT', category: 'production', title: 'Physical output — Production', tip: 'Used to calculate Energy intensity in terms of physical output.' },

  // ── Q3: Water ────────────────────────────────────────────────────────────
  { key: 'water_surface',     section: 'Q3', unit: 'kL', category: 'water withdrawal', title: '(i) Surface water', tip: 'Total kiloliters withdrawn from rivers, lakes, streams, or any surface body.' },
  { key: 'water_ground',      section: 'Q3', unit: 'kL', category: 'water withdrawal', title: '(ii) Groundwater', tip: 'Water extracted from wells and boreholes.' },
  { key: 'water_thirdparty',  section: 'Q3', unit: 'kL', category: 'water withdrawal', title: '(iii) Third party water (Municipal)', tip: 'Water purchased from municipal or commercial suppliers.' },
  { key: 'water_seawater',    section: 'Q3', unit: 'kL', category: 'water withdrawal', title: '(iv) Seawater / desalinated water', tip: 'Seawater withdrawn or desalinated water used.' },
  { key: 'water_others',      section: 'Q3', unit: 'kL', category: 'water withdrawal', title: '(v) Others', tip: 'Any other source of water not covered above.' },
  { key: 'water_consumption', section: 'Q3', unit: 'kL', category: 'water consumption', title: 'Total volume of water consumption', tip: 'Total water consumed (may differ from withdrawal due to recycling/reuse).' },

  // ── Q4: Water Discharge ──────────────────────────────────────────────────
  { key: 'wd_surface_notx', section: 'Q4', unit: 'kL', category: 'surface water', title: 'To surface water — no treatment', tip: 'Untreated discharge directly to rivers, lakes, or streams.' },
  { key: 'wd_surface_tx',   section: 'Q4', unit: 'kL', category: 'surface water', title: 'To surface water — with treatment', tip: 'Treated effluent discharged to surface water bodies.' },
  { key: 'wd_ground_notx',  section: 'Q4', unit: 'kL', category: 'groundwater', title: 'To groundwater — no treatment', tip: 'Untreated water discharged to ground (e.g., seepage).' },
  { key: 'wd_ground_tx',    section: 'Q4', unit: 'kL', category: 'groundwater', title: 'To groundwater — with treatment', tip: 'Treated water recharged to ground.' },
  { key: 'wd_sea_notx',     section: 'Q4', unit: 'kL', category: 'seawater', title: 'To seawater — no treatment', tip: 'Untreated discharge to sea.' },
  { key: 'wd_sea_tx',       section: 'Q4', unit: 'kL', category: 'seawater', title: 'To seawater — with treatment', tip: 'Treated effluent discharged to sea.' },
  { key: 'wd_third_notx',   section: 'Q4', unit: 'kL', category: 'third party', title: 'To third parties — no treatment', tip: 'Sent to CETP or other third parties without prior treatment.' },
  { key: 'wd_third_tx',     section: 'Q4', unit: 'kL', category: 'third party', title: 'To third parties — with treatment', tip: 'Pre-treated before sending to third parties.' },
  { key: 'wd_others_notx',  section: 'Q4', unit: 'kL', category: 'others', title: 'Others — no treatment', tip: 'Any other discharge method, untreated.' },
  { key: 'wd_others_tx',    section: 'Q4', unit: 'kL', category: 'others', title: 'Others — with treatment', tip: 'Any other discharge method, treated (e.g., used for irrigation after STP).' },

  // ── Q6: Air Emissions ────────────────────────────────────────────────────
  { key: 'air_nox', section: 'Q6', unit: 'MT', category: 'air emissions', title: 'NOx emissions', tip: 'Total nitrogen oxides emitted from combustion and process sources.' },
  { key: 'air_sox', section: 'Q6', unit: 'MT', category: 'air emissions', title: 'SOx emissions', tip: 'Total sulphur oxides emitted from combustion of sulphur-containing fuels.' },
  { key: 'air_pm',  section: 'Q6', unit: 'MT', category: 'air emissions', title: 'Particulate matter (PM)', tip: 'Total suspended particulate matter from stacks and fugitive sources.' },

  // ── Q7: GHG ──────────────────────────────────────────────────────────────
  { key: 'ghg_scope1', section: 'Q7', unit: 'tCO₂Eq', category: 'GHG emissions', title: 'Total Scope 1 emissions', tip: 'Direct GHG from owned/controlled sources (combustion, process, fugitive).' },
  { key: 'ghg_scope2', section: 'Q7', unit: 'tCO₂Eq', category: 'GHG emissions', title: 'Total Scope 2 emissions', tip: 'Indirect GHG from purchased electricity, heat or steam.' },

  // ── Q9: Waste Generated ──────────────────────────────────────────────────
  { key: 'waste_A', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'Plastic waste (A)', tip: 'Total plastic waste generated including packaging and product waste.' },
  { key: 'waste_B', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'E-waste (B)', tip: 'Electronic waste including obsolete equipment and batteries.' },
  { key: 'waste_C', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'Bio-medical waste (C)', tip: 'Waste from medical or healthcare activities at your premises.' },
  { key: 'waste_D', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'Construction & demolition waste (D)', tip: 'From any building, renovation, or demolition activities.' },
  { key: 'waste_E', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'Battery waste (E)', tip: 'Spent batteries from operations, vehicles, and equipment.' },
  { key: 'waste_F', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'Radioactive waste (F)', tip: 'Applicable if entity uses radioactive materials. Usually 0.' },
  { key: 'waste_G', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'Other hazardous waste (G)', tip: 'Used oil, spent chemicals, empty chemical containers, etc.' },
  { key: 'waste_H', section: 'Q9', unit: 'MT', category: 'waste generated', title: 'Other non-hazardous waste (H)', tip: 'Metal scrap, bottom ash, general solid waste, etc.' },

  // ── Q9: Waste Recovery ───────────────────────────────────────────────────
  { key: 'waste_recycled',        section: 'Q9', unit: 'MT', category: 'waste recovery', title: '(i) Recycled', tip: 'Waste sent to recycling processes.' },
  { key: 'waste_reused',          section: 'Q9', unit: 'MT', category: 'waste recovery', title: '(ii) Re-used', tip: 'Waste repurposed without reprocessing.' },
  { key: 'waste_recovery_other',  section: 'Q9', unit: 'MT', category: 'waste recovery', title: '(iii) Other recovery operations', tip: 'Energy recovery, composting, or other recovery not covered above.' },

  // ── Q9: Waste Disposal ───────────────────────────────────────────────────
  { key: 'waste_incineration',           section: 'Q9', unit: 'MT', category: 'waste disposal', title: '(i) Incineration', tip: 'Waste sent for thermal destruction.' },
  { key: 'waste_landfill',               section: 'Q9', unit: 'MT', category: 'waste disposal', title: '(ii) Landfilling', tip: 'Waste disposed in controlled or uncontrolled landfills.' },
  { key: 'waste_landfill_incineration',  section: 'Q9', unit: 'MT', category: 'waste disposal', title: '(iii) Other disposal operations', tip: 'Any other disposal method (e.g. landfilling after incineration, co-processing). Matches Excel row 122.' },

  // ── Theory Questions ─────────────────────────────────────────────────────
  { key: 'theory_q1', section: 'Q1', unit: '', category: 'theory', title: 'Energy Intensity Applicability', tip: 'Whether total energy consumption and energy intensity is applicable to the company?' },
  { key: 'theory_q2', section: 'Q2', unit: '', category: 'theory', title: 'Designated Consumers (DCs)', tip: 'Does the entity have any sites / facilities identified as designated consumers (DCs) under PAT scheme?' },
  { key: 'theory_q5', section: 'Q5', unit: '', category: 'theory', title: 'ZLD Mechanism', tip: 'Provide details of Zero Liquid Discharge Mechanism if applicable' },
  { key: 'theory_q7', section: 'Q7', unit: '', category: 'theory', title: 'GHG Emissions details', tip: 'Provide details of greenhouse gas emissions' },
  { key: 'theory_q8', section: 'Q8', unit: '', category: 'theory', title: 'GHG Reduction Initiatives', tip: 'Does the entity have any project / initiative undertaken to reduce greenhouse gas emissions?' },
  { key: 'theory_q9', section: 'Q9', unit: '', category: 'theory', title: 'Waste Management details (optional)', tip: 'Provide generic detail of waste management here if requested' },
  { key: 'theory_q10', section: 'Q10', unit: '', category: 'theory', title: 'Waste Management Practices', tip: 'Briefly describe the waste management practices adopted in your establishments.' },
  { key: 'theory_q11', section: 'Q11', unit: '', category: 'theory', title: 'Ecologically Sensitive Areas', tip: 'Operations/offices in/around ecologically sensitive areas.' },
  { key: 'theory_q12', section: 'Q12', unit: '', category: 'theory', title: 'EIA Projects', tip: 'Details of environmental impact assessments of projects undertaken.' },
  { key: 'theory_q13', section: 'Q13', unit: '', category: 'theory', title: 'Environmental Compliance', tip: 'Is the entity compliant with the applicable environmental law/regulations/guidelines.' },
];

// Keys that are formula/derived (read-only in forms)
const FORMULA_KEY_LIST: (keyof PyData)[] = ['RevenuePPP'];
/** @deprecated use isFormulaKey() instead */
export const FORMULA_KEYS: Set<keyof PyData> = new Set(FORMULA_KEY_LIST);
/** Returns true if `key` is auto-computed and should be read-only in forms. */
export const isFormulaKey = (key: keyof PyData): boolean => FORMULA_KEY_LIST.includes(key);

// ─── Principle 6 Question Registry ───────────────────────────────────────────

export interface QuestionConfig {
  number: number;       // 1–9
  section: string;      // 'Q1' … 'Q9'
  title: string;
  description: string;
  icon: string;         // material-symbols name
  color: string;        // emerald | blue | cyan | orange | red | purple | slate
  hasTable: boolean;    // false = text-only, no data entry
  fields: StepConfig[]; // populated at runtime from STEPS_CONFIG
}

export const QUESTIONS_CONFIG: QuestionConfig[] = [
  {
    number: 1, section: 'Q1',
    title: 'Details of total energy consumption (in Joules or multiples) and energy intensity, in the following format:',
    description: 'Total energy from renewable and non-renewable sources, plus energy intensity metrics.',
    icon: 'bolt', color: 'emerald', hasTable: true, fields: [],
  },
  {
    number: 2, section: 'Q2',
    title: 'Does the entity have any sites / facilities identified as designated consumers (DCs) under the Performance, Achieve and Trade (PAT) Scheme of the Government of India? (Y/N) If yes, disclose whether targets set under the PAT scheme have been achieved. In case targets have not been achieved, provide the remedial action taken, if any.',
    description: 'Designated consumers (PAT) disclosure.',
    icon: 'verified', color: 'slate', hasTable: true, fields: [],
  },
  {
    number: 3, section: 'Q3',
    title: 'Provide details of the following disclosures related to water, in the following format:',
    description: 'Volume of water withdrawn by source, total consumption, and water intensity metrics.',
    icon: 'water_drop', color: 'blue', hasTable: true, fields: [],
  },
  {
    number: 4, section: 'Q4',
    title: 'Provide the following details related to water discharged:',
    description: 'Water discharge by destination and level of treatment.',
    icon: 'water', color: 'cyan', hasTable: true, fields: [],
  },
  {
    number: 5, section: 'Q5',
    title: 'Has the entity implemented a mechanism for Zero Liquid Discharge? If yes, provide details of its coverage and implementation.',
    description: 'Implementation and coverage details of ZLD mechanism.',
    icon: 'recycling', color: 'slate', hasTable: true, fields: [],
  },
  {
    number: 6, section: 'Q6',
    title: 'Please provide details of air emissions (other than GHG emissions) by the entity, in the following format *:',
    description: 'Emissions of NOx, SOx, particulate matter, etc.',
    icon: 'air', color: 'orange', hasTable: true, fields: [],
  },
  {
    number: 7, section: 'Q7',
    title: 'Provide details of greenhouse gas emissions (Scope 1 and Scope 2 emissions) & its intensity, in the following format:',
    description: 'Scope 1 and Scope 2 GHG emissions in tCO₂Eq and intensity metrics.',
    icon: 'co2', color: 'red', hasTable: true, fields: [],
  },
  {
    number: 8, section: 'Q8',
    title: 'Does the entity have any project related to reducing Green House Gas emission? If Yes, then provide details.',
    description: 'Projects and initiatives undertaken to reduce greenhouse gas emissions.',
    icon: 'eco', color: 'slate', hasTable: true, fields: [],
  },
  {
    number: 9, section: 'Q9',
    title: 'Provide details related to waste management by the entity, in the following format:',
    description: 'Total waste generated, waste recovery operations, and waste disposal methods.',
    icon: 'delete_sweep', color: 'purple', hasTable: true, fields: [],
  },
  {
    number: 10, section: 'Q10',
    title: 'Briefly describe the waste management practices adopted in your establishments. Describe the strategy adopted by your company to reduce usage of hazardous and toxic chemicals in your products and processes and the practices adopted to manage such wastes.',
    description: 'Waste management practices and toxic chemical strategy.',
    icon: 'recycling', color: 'slate', hasTable: true, fields: [],
  },
  {
    number: 11, section: 'Q11',
    title: 'If the entity has operations/offices in/around ecologically sensitive areas (such as national parks, wildlife sanctuaries, biosphere reserves, wetlands, biodiversity hotspots, forests, coastal regulation zones etc.) where environmental approvals / clearances are required, please specify details in the following format:',
    description: 'Details of operations in sensitive areas.',
    icon: 'park', color: 'slate', hasTable: true, fields: [],
  },
  {
    number: 12, section: 'Q12',
    title: 'Details of environmental impact assessments of projects undertaken by the entity based on applicable laws, in the current financial year:',
    description: 'Details of EIA of projects undertaken.',
    icon: 'assessment', color: 'slate', hasTable: true, fields: [],
  },
  {
    number: 13, section: 'Q13',
    title: 'Is the entity compliant with the applicable environmental law / regulations / guidelines in India; such as the Water (Prevention and Control of Pollution) Act, Air (Prevention and Control of Pollution) Act, Environment protection act and rules thereunder (Y/N). If not, provide details of all such non-compliances, in the following format:',
    description: 'Compliance with environmental laws and non-compliance details.',
    icon: 'gavel', color: 'slate', hasTable: true, fields: [],
  },
].map(q => ({
  ...q,
  // Hydrate fields from STEPS_CONFIG at module load time
  fields: STEPS_CONFIG.filter(s => s.section === q.section),
}));

