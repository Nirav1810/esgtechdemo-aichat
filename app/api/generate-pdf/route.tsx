import React from 'react';
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';
import type { PyData, BrsrFormData, DerivedMetrics } from '../../reports/types';

// ─── Brand colours ────────────────────────────────────────────────────────────
const C = {
  green:       '#005C40',   // primary dark green (header bg, grand-total border)
  greenMid:    '#007A55',   // section heading text
  greenLight:  '#E8F5F0',   // formula/total row bg
  greenXLight: '#F2FAF7',   // grand-total row bg
  pinkLight:   '#FDF2F8',   // non-renewable formula bg
  pinkText:    '#9B1C5E',   // non-renewable formula text
  subheadBg:   '#EEF2F6',   // sub-header row bg
  subheadText: '#1E293B',   // sub-header text
  rowAlt:      '#F8FAFB',   // zebra stripe
  border:      '#C8D8D0',   // outer table border
  borderInner: '#E2EBE8',   // inner row border
  text:        '#1E293B',   // body text
  textMuted:   '#64748B',   // muted / secondary
  white:       '#FFFFFF',
  headerText:  '#FFFFFF',
  footerBg:    '#F1F5F3',
  coverBg:     '#003D2B',   // cover page banner bg
  coverAccent: '#00B87A',   // cover page accent stripe
};

// ─── Typography scale ─────────────────────────────────────────────────────────
const F = { xs: 7, sm: 8, base: 9, md: 10, lg: 12, xl: 16, xxl: 22 };

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Pages
  page: {
    paddingTop: 36, paddingBottom: 52, paddingHorizontal: 36,
    fontFamily: 'Helvetica', fontSize: F.base, color: C.text, backgroundColor: C.white,
  },
  coverPage: {
    padding: 0, fontFamily: 'Helvetica', backgroundColor: C.white,
  },

  // ── Cover ──
  coverBanner: {
    backgroundColor: C.coverBg, paddingHorizontal: 48,
    paddingTop: 64, paddingBottom: 48,
  },
  coverAccentLine: { height: 4, backgroundColor: C.coverAccent, marginBottom: 28 },
  coverTitle: {
    fontSize: F.xxl + 4, fontFamily: 'Helvetica-Bold',
    color: C.white, lineHeight: 1.3, letterSpacing: 1.5, textTransform: 'uppercase',
  },
  coverSubTitle: {
    fontSize: F.lg, color: '#90D5B8', marginTop: 12, fontFamily: 'Helvetica',
  },
  coverMeta: { fontSize: F.base, color: '#7AB89E', marginTop: 8 },
  coverBody: { paddingHorizontal: 48, paddingTop: 36 },
  coverInfoBox: {
    backgroundColor: C.greenXLight, borderRadius: 4,
    padding: 16, marginBottom: 12,
    borderLeftWidth: 3, borderLeftColor: C.greenMid, borderLeftStyle: 'solid',
  },
  coverInfoLabel: { fontSize: F.sm, color: C.textMuted, marginBottom: 2 },
  coverInfoValue: { fontSize: F.base, fontFamily: 'Helvetica-Bold', color: C.text },
  coverGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  coverGridItem: { width: '47%' },
  coverDivider: { height: 1, backgroundColor: C.border, marginVertical: 24 },
  coverDisclaimer: { fontSize: F.xs, color: C.textMuted, lineHeight: 1.6, fontStyle: 'italic' },

  // ── Running header (content pages) ──
  runningHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'stretch', height: 22,
  },
  runningHeaderBar: {
    backgroundColor: C.green, flex: 1,
    justifyContent: 'center', paddingHorizontal: 36,
  },
  runningHeaderText: { fontSize: F.xs, color: C.white, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8 },
  runningHeaderAccent: { width: 5, backgroundColor: C.coverAccent },

  // ── Footer ──
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
    backgroundColor: C.footerBg, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 36,
    borderTopWidth: 1, borderTopColor: C.border, borderTopStyle: 'solid',
  },
  footerText: { fontSize: F.xs, color: C.textMuted, flex: 1, fontStyle: 'italic' },
  footerPage: { fontSize: F.xs, color: C.textMuted, fontFamily: 'Helvetica-Bold' },

  // ── Section heading ──
  sectionBlock: { marginTop: 20, marginBottom: 6 },
  sectionNumber: {
    fontSize: F.base, fontFamily: 'Helvetica-Bold', color: C.greenMid,
    borderBottomWidth: 2, borderBottomColor: C.greenMid, borderBottomStyle: 'solid',
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: F.base, fontFamily: 'Helvetica-Bold', color: C.text,
  },

  // ── Table ──
  table: {
    width: '100%', borderStyle: 'solid',
    borderWidth: 1, borderColor: C.border, borderRadius: 2,
  },

  // Header row
  tHead: { flexDirection: 'row', backgroundColor: C.green },
  thC1: { flex: 45, padding: '5 8' },
  thC2: { flex: 15, padding: '5 8', borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.25)', borderLeftStyle: 'solid' },
  thC3: { flex: 20, padding: '5 8', borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.25)', borderLeftStyle: 'solid' },
  thC4: { flex: 20, padding: '5 8', borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.25)', borderLeftStyle: 'solid' },
  thText: { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.white },

  // Sub-header row (e.g. "From renewable sources")
  subHead: {
    flexDirection: 'row',
    backgroundColor: C.subheadBg,
    borderTopWidth: 1, borderTopColor: C.borderInner, borderTopStyle: 'solid',
    padding: '5 8',
  },
  subHeadText: { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.subheadText },

  // Data rows
  rowBase: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: C.borderInner, borderTopStyle: 'solid',
    minHeight: 20,
  },
  rowBaseAlt: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: C.borderInner, borderTopStyle: 'solid',
    backgroundColor: C.rowAlt, minHeight: 20,
  },

  // Formula/total rows
  rowGreen: { flexDirection: 'row', backgroundColor: C.greenLight, borderTopWidth: 1.5, borderTopColor: C.green, borderTopStyle: 'solid', minHeight: 20 },
  rowPink: { flexDirection: 'row', backgroundColor: C.pinkLight, borderTopWidth: 1.5, borderTopColor: '#C3588A', borderTopStyle: 'solid', minHeight: 20 },
  rowGrand: { flexDirection: 'row', backgroundColor: C.greenXLight, borderTopWidth: 2, borderTopColor: C.green, borderTopStyle: 'solid', minHeight: 22 },

  // Cells
  tdC1: { flex: 45, padding: '4 8', borderRightWidth: 1, borderRightColor: C.borderInner, borderRightStyle: 'solid', justifyContent: 'center' },
  tdC2: { flex: 15, padding: '4 8', borderRightWidth: 1, borderRightColor: C.borderInner, borderRightStyle: 'solid', justifyContent: 'center', alignItems: 'center' },
  tdC3: { flex: 20, padding: '4 8', borderRightWidth: 1, borderRightColor: C.borderInner, borderRightStyle: 'solid', justifyContent: 'center', alignItems: 'flex-end' },
  tdC4: { flex: 20, padding: '4 8', justifyContent: 'center', alignItems: 'flex-end' },

  // Cell text variants
  tdText:      { fontSize: F.base, color: C.text },
  tdTextMuted: { fontSize: F.sm, color: C.textMuted },
  tdTextBold:  { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.text },
  tdTextGreen: { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.green },
  tdTextPink:  { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.pinkText },
  tdTextUnit:  { fontSize: F.xs, color: C.textMuted },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const n = (v: unknown): number => {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (typeof v === 'string') return parseFloat(v) || 0;
  return 0;
};
const fmt  = (v: number, dp = 2) => isFinite(v) && v !== 0 ? v.toFixed(dp) : '0.00';
const locNum = (v: number) => isFinite(v) && v !== 0 ? v.toLocaleString('en-IN') : '0';

// ─── Shared layout components ─────────────────────────────────────────────────

const RunningHeader = ({ section }: { section: string }) => (
  <View style={styles.runningHeader} fixed>
    <View style={styles.runningHeaderBar}>
      <Text style={styles.runningHeaderText}>BRSR — Principle 6: Environment  ·  {section}</Text>
    </View>
    <View style={styles.runningHeaderAccent} />
  </View>
);

const PageFooter = ({ pageNum, total }: { pageNum: number; total: number }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      Generated by ESGtech.ai  ·  BRSR Principle 6 Environmental KPIs  ·  This report is system-generated
    </Text>
    <Text style={styles.footerPage}>Page {pageNum} of {total}</Text>
  </View>
);

// ─── Table primitives ─────────────────────────────────────────────────────────

const THead = ({ fyLabel, pyLabel }: { fyLabel: string; pyLabel: string }) => (
  <View style={styles.tHead}>
    <View style={styles.thC1}><Text style={styles.thText}>Parameter</Text></View>
    <View style={styles.thC2}><Text style={[styles.thText, { textAlign: 'center' }]}>Unit</Text></View>
    <View style={styles.thC3}><Text style={[styles.thText, { textAlign: 'right' }]}>{fyLabel}</Text></View>
    <View style={styles.thC4}><Text style={[styles.thText, { textAlign: 'right' }]}>{pyLabel}</Text></View>
  </View>
);

const SubHead = ({ label }: { label: string }) => (
  <View style={styles.subHead}>
    <Text style={styles.subHeadText}>{label}</Text>
  </View>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStyle = any;
const TRow = ({
  label, unit, fy, py,
  rowStyle, textStyle,
  indent = false,
}: {
  label: string; unit: string; fy: string; py: string;
  rowStyle?: AnyStyle; textStyle?: AnyStyle; indent?: boolean;
}) => (
  <View style={rowStyle ?? styles.rowBase} wrap={false}>
    <View style={styles.tdC1}>
      <Text style={[textStyle ?? styles.tdText, indent && { paddingLeft: 8 }]}>{label}</Text>
    </View>
    <View style={styles.tdC2}>
      <Text style={styles.tdTextUnit}>{unit}</Text>
    </View>
    <View style={styles.tdC3}>
      <Text style={textStyle ?? styles.tdText}>{fy}</Text>
    </View>
    <View style={styles.tdC4}>
      <Text style={textStyle ?? styles.tdText}>{py}</Text>
    </View>
  </View>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ num, title }: { num: string; title: string }) => (
  <View style={styles.sectionBlock} wrap={false}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
      <Text style={styles.sectionNumber}>{num}.</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  </View>
);

// ─── Document ─────────────────────────────────────────────────────────────────
interface DocProps {
  fd: BrsrFormData;
  py: PyData;
  fym: DerivedMetrics;
  pym: DerivedMetrics;
}

const FY_LABEL = 'FY 2024-25';
const PY_LABEL = 'FY 2023-24';

const BrsrDocument = ({ fd, py, fym, pym }: DocProps) => (
  <Document
    title="BRSR Principle 6 — Environmental KPIs"
    author="ESGtech.ai"
    subject="Business Responsibility and Sustainability Report"
  >

    {/* ═══════════════════════════════════════════════════════════════
        COVER PAGE
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.coverPage}>
      {/* Top dark banner */}
      <View style={styles.coverBanner}>
        <View style={styles.coverAccentLine} />
        <Text style={styles.coverTitle}>Business Responsibility{'\n'}and Sustainability{'\n'}Report</Text>
        <Text style={styles.coverSubTitle}>Principle 6 — Environment</Text>
        <Text style={styles.coverMeta}>Essential Indicators  ·  {FY_LABEL}</Text>
      </View>

      {/* Info grid */}
      <View style={styles.coverBody}>
        <View style={styles.coverGrid}>
          <View style={styles.coverGridItem}>
            <View style={styles.coverInfoBox}>
              <Text style={styles.coverInfoLabel}>Reporting Year</Text>
              <Text style={styles.coverInfoValue}>{FY_LABEL}</Text>
            </View>
          </View>
          <View style={styles.coverGridItem}>
            <View style={styles.coverInfoBox}>
              <Text style={styles.coverInfoLabel}>Previous Year</Text>
              <Text style={styles.coverInfoValue}>{PY_LABEL}</Text>
            </View>
          </View>
          <View style={styles.coverGridItem}>
            <View style={styles.coverInfoBox}>
              <Text style={styles.coverInfoLabel}>Framework</Text>
              <Text style={styles.coverInfoValue}>SEBI BRSR (Schedule III)</Text>
            </View>
          </View>
          <View style={styles.coverGridItem}>
            <View style={styles.coverInfoBox}>
              <Text style={styles.coverInfoLabel}>Principle</Text>
              <Text style={styles.coverInfoValue}>6 — Environmental Stewardship</Text>
            </View>
          </View>
        </View>

        <View style={styles.coverDivider} />

        <Text style={{ fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.text, marginBottom: 8 }}>
          Sections Covered
        </Text>
        {[
          { n: '1', t: 'Energy Consumption & Intensity' },
          { n: '3', t: 'Water Withdrawal & Consumption' },
          { n: '4', t: 'Water Discharged' },
          { n: '6', t: 'Air Emissions (other than GHG)' },
          { n: '7', t: 'Greenhouse Gas Emissions & Intensity' },
          { n: '9', t: 'Waste Management' },
        ].map(s => (
          <View key={s.n} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <View style={{ width: 18, height: 18, backgroundColor: C.green, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
              <Text style={{ fontSize: F.xs, color: C.white, fontFamily: 'Helvetica-Bold' }}>{s.n}</Text>
            </View>
            <Text style={{ fontSize: F.base, color: C.text }}>{s.t}</Text>
          </View>
        ))}

        <View style={styles.coverDivider} />
        <Text style={styles.coverDisclaimer}>
          This report has been generated automatically by the ESGtech.ai reporting engine. Data entered via the
          guided BRSR data-entry workflow has been used to populate all figures. Intensity metrics are calculated
          using the revenue, PPP adjustment factor, and production volume provided during data entry.
          All figures are reported in the units specified in each table.
        </Text>
      </View>
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE 1 — Q1: ENERGY
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Energy" />
      <View style={{ marginTop: 28 }}>
        <SectionHeading
          num="1"
          title="Details of total energy consumption (in Joules or multiples) and energy intensity"
        />
        <View style={styles.table}>
          <THead fyLabel={FY_LABEL} pyLabel={PY_LABEL} />

          <SubHead label="From renewable sources" />
          <TRow label="Total electricity consumption (A)"              unit="GJ" fy={locNum(n(fd.energy_A))} py={locNum(py.energy_A)} indent />
          <TRow label="Total fuel consumption (B)"                     unit="GJ" fy={locNum(n(fd.energy_B))} py={locNum(py.energy_B)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Energy consumption through other sources (C)"   unit="GJ" fy={locNum(n(fd.energy_C))} py={locNum(py.energy_C)} indent />
          <TRow
            label="Total energy consumed from renewable sources (A+B+C)"
            unit="GJ"
            fy={locNum(fym.energy_renewable_total)}
            py={locNum(pym.energy_renewable_total)}
            rowStyle={styles.rowGreen}
            textStyle={styles.tdTextGreen}
          />

          <SubHead label="From non-renewable sources" />
          <TRow label="Total electricity consumption (D)"              unit="GJ" fy={locNum(n(fd.energy_D))} py={locNum(py.energy_D)} indent />
          <TRow label="Total fuel consumption (E)"                     unit="GJ" fy={locNum(n(fd.energy_E))} py={locNum(py.energy_E)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Energy consumption through other sources (F)"   unit="GJ" fy={locNum(n(fd.energy_F))} py={locNum(py.energy_F)} indent />
          <TRow
            label="Total energy consumed from non-renewable sources (D+E+F)"
            unit="GJ"
            fy={locNum(fym.energy_nonrenewable_total)}
            py={locNum(pym.energy_nonrenewable_total)}
            rowStyle={styles.rowPink}
            textStyle={styles.tdTextPink}
          />

          <TRow
            label="Total energy consumed (A+B+C+D+E+F)"
            unit="GJ"
            fy={locNum(fym.energy_total)}
            py={locNum(pym.energy_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />

          <TRow label="Energy intensity per rupee of turnover (Total energy / Revenue from operations)" unit="GJ/Cr. Rs."  fy={fmt(fym.energy_intensity_revenue, 4)} py={fmt(pym.energy_intensity_revenue, 4)} />
          <TRow label="Energy intensity per rupee of turnover adjusted for PPP"                         unit="GJ/M USD"    fy={fmt(fym.energy_intensity_ppp, 4)}     py={fmt(pym.energy_intensity_ppp, 4)}     rowStyle={styles.rowBaseAlt} />
          <TRow label="Energy intensity in terms of physical output — Production"                       unit="GJ/MT"       fy={fmt(fym.energy_intensity_production, 4)} py={fmt(pym.energy_intensity_production, 4)} />
        </View>
      </View>
      <PageFooter pageNum={1} total={4} />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE 2 — Q3: WATER WITHDRAWAL + Q4: WATER DISCHARGE
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Water" />
      <View style={{ marginTop: 28 }}>
        <SectionHeading num="3" title="Details of water withdrawal and consumption" />
        <View style={styles.table}>
          <THead fyLabel={FY_LABEL} pyLabel={PY_LABEL} />
          <SubHead label="Water withdrawal by source (in kiloliters)" />
          <TRow label="(i) Surface water"                                    unit="kL" fy={locNum(n(fd.water_surface))}     py={locNum(py.water_surface)}     indent />
          <TRow label="(ii) Groundwater"                                     unit="kL" fy={locNum(n(fd.water_ground))}      py={locNum(py.water_ground)}      rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(iii) Third party water (Municipal)"                  unit="kL" fy={locNum(n(fd.water_thirdparty))}  py={locNum(py.water_thirdparty)}  indent />
          <TRow label="(iv) Seawater / desalinated water"                    unit="kL" fy={locNum(n(fd.water_seawater))}   py={locNum(py.water_seawater)}    rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(v) Others"                                           unit="kL" fy={locNum(n(fd.water_others))}     py={locNum(py.water_others)}      indent />
          <TRow
            label="Total volume of water withdrawal (i+ii+iii+iv+v)"
            unit="kL"
            fy={locNum(fym.water_withdrawal_total)}
            py={locNum(pym.water_withdrawal_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
          <TRow label="Total volume of water consumption"           unit="kL"         fy={locNum(n(fd.water_consumption))}           py={locNum(py.water_consumption)}    rowStyle={styles.rowBaseAlt} />
          <TRow label="Water intensity per rupee of turnover"        unit="kL/Cr. Rs." fy={fmt(fym.water_intensity_revenue, 4)}        py={fmt(pym.water_intensity_revenue, 4)} />
          <TRow label="Water intensity per rupee adjusted for PPP"   unit="kL/M USD"   fy={fmt(fym.water_intensity_ppp, 4)}            py={fmt(pym.water_intensity_ppp, 4)}     rowStyle={styles.rowBaseAlt} />
          <TRow label="Water intensity in terms of physical output"  unit="kL/MT"     fy={fmt(fym.water_intensity_production, 4)}     py={fmt(pym.water_intensity_production, 4)} />
        </View>

        <SectionHeading num="4" title="Details of water discharged" />
        <View style={styles.table}>
          <THead fyLabel={FY_LABEL} pyLabel={PY_LABEL} />
          <SubHead label="To Surface water" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_surface_notx))} py={locNum(py.wd_surface_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_surface_tx))}   py={locNum(py.wd_surface_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="To Groundwater" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_ground_notx))} py={locNum(py.wd_ground_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_ground_tx))}   py={locNum(py.wd_ground_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="To Seawater" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_sea_notx))} py={locNum(py.wd_sea_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_sea_tx))}   py={locNum(py.wd_sea_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="To Third parties" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_third_notx))} py={locNum(py.wd_third_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_third_tx))}   py={locNum(py.wd_third_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="Others" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_others_notx))} py={locNum(py.wd_others_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_others_tx))}   py={locNum(py.wd_others_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <TRow
            label="Total water discharged"
            unit="kL"
            fy={locNum(fym.wd_total)}
            py={locNum(pym.wd_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
        </View>
      </View>
      <PageFooter pageNum={2} total={4} />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE 3 — Q6: AIR EMISSIONS + Q7: GHG
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Air Emissions & GHG" />
      <View style={{ marginTop: 28 }}>
        <SectionHeading num="6" title="Air emissions (other than GHG)" />
        <View style={styles.table}>
          <THead fyLabel={FY_LABEL} pyLabel={PY_LABEL} />
          <TRow label="NOx"                                    unit="MT"  fy={locNum(n(fd.air_nox))} py={locNum(py.air_nox)} />
          <TRow label="SOx"                                    unit="MT"  fy={locNum(n(fd.air_sox))} py={locNum(py.air_sox)} rowStyle={styles.rowBaseAlt} />
          <TRow label="Particulate matter (PM)"                unit="MT"  fy={locNum(n(fd.air_pm))}  py={locNum(py.air_pm)} />
          <TRow label="Persistent organic pollutants (POP)"   unit="—"   fy="NA" py="NA" rowStyle={styles.rowBaseAlt} />
          <TRow label="Volatile organic compounds (VOC)"       unit="—"   fy="NA" py="NA" />
          <TRow label="Hazardous air pollutants (HAP)"         unit="—"   fy="NA" py="NA" rowStyle={styles.rowBaseAlt} />
        </View>

        <SectionHeading num="7" title="Greenhouse gas emissions (Scope 1 & Scope 2) and intensity" />
        <View style={styles.table}>
          <THead fyLabel={FY_LABEL} pyLabel={PY_LABEL} />
          <TRow label="Total Scope 1 emissions" unit="tCO\u2082Eq" fy={locNum(n(fd.ghg_scope1))} py={locNum(py.ghg_scope1)} />
          <TRow label="Total Scope 2 emissions" unit="tCO\u2082Eq" fy={locNum(n(fd.ghg_scope2))} py={locNum(py.ghg_scope2)} rowStyle={styles.rowBaseAlt} />
          <TRow
            label="Total Scope 1 and Scope 2 emissions"
            unit="tCO\u2082Eq"
            fy={locNum(fym.ghg_total)}
            py={locNum(pym.ghg_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
          <TRow label="GHG intensity per rupee of turnover (Scope 1+2 / Revenue)"    unit="tCO\u2082Eq/Cr. Rs." fy={fmt(fym.ghg_intensity_revenue, 4)}    py={fmt(pym.ghg_intensity_revenue, 4)} />
          <TRow label="GHG intensity per rupee adjusted for PPP (Scope 1+2 / PPP)"   unit="tCO\u2082Eq/M USD"   fy={fmt(fym.ghg_intensity_ppp, 4)}        py={fmt(pym.ghg_intensity_ppp, 4)}     rowStyle={styles.rowBaseAlt} />
          <TRow label="GHG intensity in terms of physical output"                     unit="tCO\u2082Eq/MT"      fy={fmt(fym.ghg_intensity_production, 4)} py={fmt(pym.ghg_intensity_production, 4)} />
        </View>
      </View>
      <PageFooter pageNum={3} total={4} />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE 4 — Q9: WASTE
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Waste Management" />
      <View style={{ marginTop: 28 }}>
        <SectionHeading num="9" title="Waste management" />
        <View style={styles.table}>
          <THead fyLabel={FY_LABEL} pyLabel={PY_LABEL} />

          <SubHead label="Total Waste Generated (in metric tons)" />
          <TRow label="Plastic waste (A)"                     unit="MT" fy={locNum(n(fd.waste_A))} py={locNum(py.waste_A)} indent />
          <TRow label="E-waste (B)"                           unit="MT" fy={locNum(n(fd.waste_B))} py={locNum(py.waste_B)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Bio-medical waste (C)"                 unit="MT" fy={locNum(n(fd.waste_C))} py={locNum(py.waste_C)} indent />
          <TRow label="Construction and demolition waste (D)" unit="MT" fy={locNum(n(fd.waste_D))} py={locNum(py.waste_D)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Battery waste (E)"                     unit="MT" fy={locNum(n(fd.waste_E))} py={locNum(py.waste_E)} indent />
          <TRow label="Radioactive waste (F)"                 unit="MT" fy={locNum(n(fd.waste_F))} py={locNum(py.waste_F)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Other hazardous waste (G)"             unit="MT" fy={locNum(n(fd.waste_G))} py={locNum(py.waste_G)} indent />
          <TRow label="Other non-hazardous waste (H)"         unit="MT" fy={locNum(n(fd.waste_H))} py={locNum(py.waste_H)} rowStyle={styles.rowBaseAlt} indent />
          <TRow
            label="Total waste generated (A+B+C+D+E+F+G+H)"
            unit="MT"
            fy={locNum(fym.waste_total)}
            py={locNum(pym.waste_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
          <TRow label="Waste intensity per crore rupees of turnover"                 unit="MT/Cr. Rs." fy={fmt(fym.waste_intensity_revenue, 4)}    py={fmt(pym.waste_intensity_revenue, 4)} />
          <TRow label="Waste intensity per million USD of turnover (PPP)"            unit="MT/M USD"   fy={fmt(fym.waste_intensity_ppp, 4)}        py={fmt(pym.waste_intensity_ppp, 4)}     rowStyle={styles.rowBaseAlt} />
          <TRow label="Waste intensity in terms of physical output"                  unit="MT/MT"      fy={fmt(fym.waste_intensity_production, 4)} py={fmt(pym.waste_intensity_production, 4)} />

          <SubHead label="Waste Recovery (in metric tons)" />
          <TRow label="(i) Recycled"                    unit="MT" fy={locNum(n(fd.waste_recycled))}        py={locNum(py.waste_recycled)}        indent />
          <TRow label="(ii) Re-used"                    unit="MT" fy={locNum(n(fd.waste_reused))}           py={locNum(py.waste_reused)}          rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(iii) Other recovery operations" unit="MT" fy={locNum(n(fd.waste_recovery_other))}   py={locNum(py.waste_recovery_other)}  indent />
          <TRow
            label="Total waste recovered"
            unit="MT"
            fy={locNum(fym.waste_recovery_total)}
            py={locNum(pym.waste_recovery_total)}
            rowStyle={styles.rowGreen}
            textStyle={styles.tdTextGreen}
          />

          <SubHead label="Waste Disposal (in metric tons)" />
          <TRow label="(i) Incineration"                     unit="MT" fy={locNum(n(fd.waste_incineration))}          py={locNum(py.waste_incineration)}         indent />
          <TRow label="(ii) Landfilling"                     unit="MT" fy={locNum(n(fd.waste_landfill))}              py={locNum(py.waste_landfill)}             rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(iii) Other disposal operations"        unit="MT" fy={locNum(n(fd.waste_landfill_incineration))} py={locNum(py.waste_landfill_incineration)} indent />
          <TRow
            label="Total waste disposed"
            unit="MT"
            fy={locNum(fym.waste_disposal_total)}
            py={locNum(pym.waste_disposal_total)}
            rowStyle={styles.rowGreen}
            textStyle={styles.tdTextGreen}
          />
        </View>
      </View>
      <PageFooter pageNum={4} total={4} />
    </Page>

  </Document>
);

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let data: { formData: BrsrFormData; pyData: PyData; fyMetrics: DerivedMetrics; pyMetrics: DerivedMetrics };
    try {
      data = JSON.parse(body.contextData);
    } catch {
      data = body;
    }

    const { formData, pyData, fyMetrics, pyMetrics } = data;

    const buffer = await renderToBuffer(
      <BrsrDocument fd={formData} py={pyData} fym={fyMetrics} pym={pyMetrics} />
    );

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="BRSR_P6_Report_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('[generate-pdf] Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
