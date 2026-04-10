import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { DEFAULT_FORM_DATA, BrsrFormData } from '../../reports/types';

export async function POST(req: Request) {
  try {
    const formPayload = await req.formData();
    const file = formPayload.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });

    let result: BrsrFormData = { ...DEFAULT_FORM_DATA };
    let sheetUsed = '';
    const sheetName = wb.SheetNames.find(n => n.trim().toUpperCase() === 'PRINCIPLE 6');

    if (sheetName) {
      // SEBI FORMAT PARSING
      sheetUsed = sheetName;
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });

      let currentEnergyType = '';
      let currentDischargeDest = '';
      let isWasteRecovery = false;
      let isWasteDisposal = false;
      let fyCol = 5;

      for (const row of rows) {
        const rawText = String(row[3] || '').trim().replace(/\s+/g, ' ');
        const text = rawText.toLowerCase();

        // Update FY col dynamically on header rows (where Col D is "Parameter")
        if (text === 'parameter') {
          const possibleFyIndex = row.findIndex((cell: any) => String(cell).toUpperCase().includes('FY'));
          if (possibleFyIndex !== -1) fyCol = possibleFyIndex;
          continue;
        }
        
        const rawVal = row[fyCol];
        const val = rawVal !== undefined && rawVal !== '' ? String(rawVal).replace(/,/g, '').trim() : '0';

        const theoryVal = String(row[4] || row[5] || '').replace(/,/g, '').trim() || '0';

        // State Tracking Updates
        if (text.includes('from renewable sources')) currentEnergyType = 'renewable';
        if (text.includes('from non-renewable sources')) currentEnergyType = 'non-renewable';

        if (text.includes('(i) to surface water')) currentDischargeDest = 'surface';
        if (text.includes('(ii) to groundwater')) currentDischargeDest = 'ground';
        if (text.includes('(iii) to seawater')) currentDischargeDest = 'sea';
        if (text.includes('(iv) sent to third-parties')) currentDischargeDest = 'third';
        if (text === '(v) others') currentDischargeDest = 'others';

        if (text.includes('total waste recovered through recycling')) { isWasteRecovery = true; isWasteDisposal = false; }
        if (text.includes('total waste disposed by nature')) { isWasteRecovery = false; isWasteDisposal = true; }

        // --- Q1: Energy ---
        if (text === 'total electricity consumption (a)') {
            if (currentEnergyType === 'renewable') result.energy_A = val;
            if (currentEnergyType === 'non-renewable') result.energy_D = val;
        }
        if (text === 'total fuel consumption (b)') result.energy_B = val;
        if (text === 'energy consumption through other sources (c)') result.energy_C = val;
        if (text === 'total electricity consumption (d)') result.energy_D = val;
        if (text === 'total fuel consumption (e)') result.energy_E = val;
        if (text === 'energy consumption through other sources (f)') result.energy_F = val;
        if (text.includes('revenue from operations (in rs')) result.Revenue = String(parseFloat(val) / 10000000 || 0);

        // --- Q3: Water Withdrawal ---
        if (text.includes('(i) surface water')) result.water_surface = val;
        if (text.includes('(ii) groundwater')) result.water_ground = val;
        if (text.includes('(iii) third party water')) result.water_thirdparty = val;
        if (text.includes('(iv) seawater / desalinated water')) result.water_seawater = val;
        if (text === '(v) others' && !text.includes('treatment')) result.water_others = val; // Assuming withdrawal "others" has a value directly
        if (text.includes('total volume of water consumption (in kilolitres)')) result.water_consumption = val;

        // --- Q4: Water Discharge ---
        if (text.includes('no treatment')) {
          if (currentDischargeDest === 'surface') result.wd_surface_notx = val;
          if (currentDischargeDest === 'ground') result.wd_ground_notx = val;
          if (currentDischargeDest === 'sea') result.wd_sea_notx = val;
          if (currentDischargeDest === 'third') result.wd_third_notx = val;
          if (currentDischargeDest === 'others') result.wd_others_notx = val;
        }
        if (text.includes('with treatment')) {
          if (currentDischargeDest === 'surface') result.wd_surface_tx = val;
          if (currentDischargeDest === 'ground') result.wd_ground_tx = val;
          if (currentDischargeDest === 'sea') result.wd_sea_tx = val;
          if (currentDischargeDest === 'third') result.wd_third_tx = val;
          if (currentDischargeDest === 'others') result.wd_others_tx = val;
        }

        // --- Q6: Air Emissions ---
        if (text === 'nox' || text.includes('nox')) result.air_nox = val;
        if (text === 'sox' || text.includes('sox')) result.air_sox = val;
        if (text.includes('particulate matter (pm)')) result.air_pm = val;

        // --- Q7: GHG ---
        if (text.includes('total scope 1 emissions')) result.ghg_scope1 = val;
        if (text.includes('total scope 2 emissions')) result.ghg_scope2 = val;

        // --- Q9: Waste Generated ---
        if (text.includes('plastic waste (a)')) result.waste_A = val;
        if (text.includes('e-waste (b)')) result.waste_B = val;
        if (text.includes('bio-medical waste (c)')) result.waste_C = val;
        if (text.includes('construction and demolition waste (d)')) result.waste_D = val;
        if (text.includes('battery waste (e)')) result.waste_E = val;
        if (text.includes('radioactive waste (f)')) result.waste_F = val;
        if (text.includes('other hazardous waste')) result.waste_G = val;
        if (text.includes('other non-hazardous waste generated')) result.waste_H = val;

        // --- Q9: Waste Recovery & Disposal ---
        if (isWasteRecovery) {
          if (text.includes('(i) recycled')) result.waste_recycled = val;
          if (text.includes('(ii) re-used')) result.waste_reused = val;
          if (text.includes('(iii) other recovery operations')) result.waste_recovery_other = val;
        }
        if (isWasteDisposal) {
          if (text.includes('(i) incineration')) result.waste_incineration = val;
          if (text.includes('(ii) landfilling')) result.waste_landfill = val;
          if (text.includes('(iii) other disposal operations')) result.waste_landfill_incineration = val;
        }

        // --- Theory Questions ---
        if (text.includes('whether total energy consumption and energy intensity is applicable')) result.theory_q1 = theoryVal;
        if (text.includes('identified as designated consumers (dcs)')) result.theory_q2 = theoryVal;
        if (text.includes('whether greenhouse gas emissions (scope 1 and scope 2 emissions)') && text.includes('applicable')) result.theory_q7 = theoryVal;
        if (text.includes('reducing green house gas emission')) result.theory_q8 = theoryVal;
        if (text.includes('implemented a mechanism for zero liquid discharge')) result.theory_q5 = theoryVal;
        if (text.includes('briefly describe the waste management practices adopted in your establishments')) result.theory_q10 = theoryVal;
        if (text.includes('operations/offices in/around ecologically sensitive areas')) result.theory_q11 = theoryVal;
        if (text.includes('details of environmental impact assessments of projects')) result.theory_q12 = theoryVal;
        if (text.includes('compliant with the applicable environmental law')) result.theory_q13 = theoryVal;
      }
    } else {
      // CUSTOM DATA ENTRY FORMAT (Old format support)
      sheetUsed = wb.SheetNames.find((n) => n === 'Data Entry') ?? wb.SheetNames[0];
      const ws = wb.Sheets[sheetUsed];
      const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws, { defval: '', raw: true });

      const KEY_COL = 'Internal Key (DO NOT EDIT)';
      const VAL_COL = 'FY 2024-25 Value';

      const validKeys = new Set<string>(Object.keys(DEFAULT_FORM_DATA));

      for (const row of rows) {
        const key = String(row[KEY_COL] ?? '').trim();
        if (!key) continue;

        const rawVal = row[VAL_COL];
        const val = rawVal !== undefined && rawVal !== '' ? String(rawVal).replace(/,/g, '').trim() : '';

        if (validKeys.has(key)) {
          result[key as keyof BrsrFormData] = val;
        }
      }
    }

    // Auto-derive RevenuePPP
    if (!result.RevenuePPP || result.RevenuePPP === '0') {
      const rev = parseFloat(result.Revenue);
      result.RevenuePPP = rev > 0 ? String(Math.round((rev * 10) / 20.66)) : '';
    }

    return NextResponse.json({
      success: true,
      data: result,
      meta: { sheetUsed },
    });
  } catch (error) {
    console.error('[parse-brsr-excel] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Failed to parse the Excel file.' }, { status: 500 });
  }
}
