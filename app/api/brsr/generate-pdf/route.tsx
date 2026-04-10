import React from 'react';
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';
import type { PyData, BrsrFormData, DerivedMetrics } from '../../../brsr/types';

// ─── Brand colours ────────────────────────────────────────────────────────────
const C = {
  greenPrimary:   '#004C3F', // Deep professional green
  greenHeader:    '#005B4E',
  greenAccent:    '#00A386',
  greenHighlight: '#F1FAF4', // Narrative answer background
  renewableText:  '#00875A',
  nonRenewText:   '#C1121F',
  subheadBg:      '#F8FAFB',
  border:         '#D1D5DB',
  borderInner:    '#E5E7EB',
  text:           '#111827',
  textMuted:      '#4B5563',
  white:          '#FFFFFF',
  noteBg:         '#FFFBEB',
  noteBorder:     '#F59E0B',
};

const F = { xs: 7, sm: 8.5, base: 9.5, md: 10, lg: 12, xl: 16, xxl: 22 };

const styles = StyleSheet.create({
  page: {
    paddingTop: 48, paddingBottom: 60, paddingHorizontal: 40,
    fontFamily: 'Helvetica', fontSize: F.base, color: C.text, backgroundColor: C.white,
  },
  coverPage: { padding: 0, fontFamily: 'Helvetica', backgroundColor: C.white },

  // Cover
  coverBanner:      { backgroundColor: C.greenPrimary, paddingHorizontal: 48, paddingTop: 64, paddingBottom: 48 },
  coverAccentLine:  { height: 4, backgroundColor: C.greenAccent, marginBottom: 28 },
  coverTitle:       { fontSize: F.xxl + 4, fontFamily: 'Helvetica-Bold', color: C.white, lineHeight: 1.3, letterSpacing: 1.5, textTransform: 'uppercase' },
  coverSubTitle:    { fontSize: F.lg, color: '#90D5B8', marginTop: 12, fontFamily: 'Helvetica' },
  coverMeta:        { fontSize: F.base, color: '#7AB89E', marginTop: 8 },
  coverBody:        { paddingHorizontal: 48, paddingTop: 36 },
  coverInfoBox:     { backgroundColor: C.greenHighlight, borderRadius: 4, padding: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: C.greenPrimary, borderLeftStyle: 'solid' },
  coverInfoLabel:   { fontSize: F.sm, color: C.textMuted, marginBottom: 2 },
  coverInfoValue:   { fontSize: F.base, fontFamily: 'Helvetica-Bold', color: C.text },
  coverGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  coverGridItem:    { width: '47%' },
  coverDivider:     { height: 1, backgroundColor: C.border, marginVertical: 24 },

  // Running header
  runningHeader:     { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 40, borderBottomWidth: 0.5, borderBottomColor: C.border },
  runningHeaderText: { fontSize: F.xs, color: C.greenPrimary, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1 },

  // Footer
  footer:     { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40, borderTopWidth: 0.5, borderTopColor: C.border },
  footerText: { fontSize: F.xs - 1, color: C.textMuted, flex: 1 },
  footerPage: { fontSize: F.xs, color: C.textMuted, fontFamily: 'Helvetica-Bold' },

  // Section heading
  sectionBlock:  { marginTop: 24, marginBottom: 12 },
  sectionNumber: { fontSize: F.lg, fontFamily: 'Helvetica-Bold', color: C.greenPrimary },
  sectionTitle:  { fontSize: F.md, fontFamily: 'Helvetica-Bold', color: C.text, lineHeight: 1.4 },

  // Table
  table:  { width: '100%', borderStyle: 'solid', borderWidth: 0.8, borderColor: C.border, overflow: 'hidden' },
  tHead:  { flexDirection: 'row', backgroundColor: C.greenHeader, minHeight: 34 },
  thC1:   { flex: 45, padding: '8 10', justifyContent: 'center' },
  thC2:   { flex: 12, padding: '8 4', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: 'rgba(255,255,255,0.3)' },
  thC3:   { flex: 21.5, padding: '8 10', justifyContent: 'center', alignItems: 'flex-end', borderLeftWidth: 0.5, borderLeftColor: 'rgba(255,255,255,0.3)' },
  thC4:   { flex: 21.5, padding: '8 10', justifyContent: 'center', alignItems: 'flex-end', borderLeftWidth: 0.5, borderLeftColor: 'rgba(255,255,255,0.3)' },
  thText: { fontSize: F.xs + 1, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'center' },
  
  subHead:     { flexDirection: 'row', backgroundColor: C.subheadBg, borderTopWidth: 0.5, borderTopColor: C.border, padding: '7 10' },
  subHeadText: { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.greenPrimary, letterSpacing: 0.3 },
  
  rowBase:    { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: C.borderInner, minHeight: 24 },
  rowAlt:     { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: C.borderInner, backgroundColor: '#FAFAFA', minHeight: 24 },
  rowGreen:   { flexDirection: 'row', backgroundColor: C.greenHighlight, borderTopWidth: 1.2, borderTopColor: C.greenAccent, minHeight: 26 },
  rowPink:    { flexDirection: 'row', backgroundColor: '#FFF5F5', borderTopWidth: 1.2, borderTopColor: '#E53E3E', minHeight: 26 },
  rowGrand:   { flexDirection: 'row', backgroundColor: '#F0FDF4', borderTopWidth: 1.8, borderTopColor: C.greenPrimary, minHeight: 28 },
  
  tdC1: { flex: 45, padding: '6 10', justifyContent: 'center' },
  tdC2: { flex: 12, padding: '6 4', justifyContent: 'center', alignItems: 'center' },
  tdC3: { flex: 21.5, padding: '6 10', justifyContent: 'center', alignItems: 'flex-end' },
  tdC4: { flex: 21.5, padding: '6 10', justifyContent: 'center', alignItems: 'flex-end' },
  
  tdText:      { fontSize: F.sm, color: C.text },
  tdTextBold:  { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.text },
  tdTextGreen: { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.greenPrimary },
  tdTextPink:  { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.nonRenewText },
  tdTextUnit:  { fontSize: F.xs, color: C.textMuted },

  // Narrative
  qBlock:       { marginTop: 22 },
  qQuestion:    { fontSize: F.md, fontFamily: 'Helvetica-Bold', color: C.text, marginBottom: 10, lineHeight: 1.4 },
  qAnswer:      { fontSize: F.base, color: C.text, lineHeight: 1.6, backgroundColor: C.greenHighlight, padding: '14 18', borderLeftWidth: 4, borderLeftColor: C.greenPrimary, borderLeftStyle: 'solid' },
  qAnswerEmpty: { fontSize: F.base, color: C.textMuted, fontStyle: 'italic', paddingLeft: 16 },

  // Note block
  noteBlock:  { borderLeftWidth: 3, borderLeftColor: C.noteBorder, padding: '10 16', marginTop: 14, marginBottom: 10 },
  noteText:   { fontSize: F.sm, color: '#92400E', lineHeight: 1.5, fontWeight: 'medium' },

  // Narrow table
  narrowTableWide: { width: '100%', borderStyle: 'solid', borderWidth: 0.8, borderColor: C.border },
  narrowHead:      { flexDirection: 'row', backgroundColor: C.greenHeader },
  narrowRow:       { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.borderInner, minHeight: 20 },
  narrowCell:      { flex: 1, padding: '6 8', borderRightWidth: 1, borderRightColor: C.borderInner, justifyContent: 'center' },
  narrowCellLast:  { flex: 1, padding: '6 8', justifyContent: 'center' },
  narrowThText:    { fontSize: F.xs, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'center' },
  narrowTdText:    { fontSize: F.xs + 0.5, color: C.text },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const n = (v: unknown): number => {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (typeof v === 'string') return parseFloat(v) || 0;
  return 0;
};
const fmt    = (v: number, dp = 2) => isFinite(v) && v !== 0 ? v.toFixed(dp) : '0.00';
const locNum = (v: number) => isFinite(v) && v !== 0 ? v.toLocaleString('en-IN') : '0';
const s = (v: unknown): string => (typeof v === 'string' ? v : String(v ?? '')).trim();

// ─── Shared layout components ─────────────────────────────────────────────────
const RunningHeader = ({ section }: { section: string }) => (
  <View style={styles.runningHeader} fixed>
    <View style={styles.runningHeaderBar}>
      <Text style={styles.runningHeaderText}>BRSR — Principle 6: Environment  ·  {section}</Text>
    </View>
    <View style={styles.runningHeaderAccent} />
  </View>
);

const PageFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      Generated by ESGtech.ai  ·  BRSR Principle 6 Environmental KPIs  ·  This report is system-generated
    </Text>
    <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </View>
);

// Table primitives
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

// eslint-disable-next-line
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

// Section heading
const SectionHeading = ({ num, title }: { num: string; title: string }) => (
  <View style={styles.sectionBlock} wrap={false}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
      <Text style={styles.sectionNumber}>{num}.</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  </View>
);

// Narrative / theory question block
const NarrativeQ = ({ num, question, answer }: { num: string; question: string; answer: string }) => (
  <View style={styles.qBlock} wrap={false}>
    <Text style={styles.qQuestion}>{num}. {question}</Text>
    {answer ? (
      <Text style={styles.qAnswer}>{answer}</Text>
    ) : (
      <Text style={styles.qAnswerEmpty}>  (Not provided)</Text>
    )}
  </View>
);

// ─── Document ─────────────────────────────────────────────────────────────────
interface DocProps {
  fd: BrsrFormData;
  py: PyData;
  fym: DerivedMetrics;
  pym: DerivedMetrics;
}

const FY_LABEL = 'FY 2024-25\nCurrent Financial Year';
const PY_LABEL = 'FY 2023-24\nPrevious Financial Year';

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
      <View style={styles.coverBanner}>
        <View style={styles.coverAccentLine} />
        <Text style={styles.coverTitle}>Business Responsibility{'\n'}and Sustainability{'\n'}Report</Text>
        <Text style={styles.coverSubTitle}>Principle 6 — Businesses should respect and make efforts to protect and restore the environment</Text>
        <Text style={styles.coverMeta}>Essential Indicators  ·  FY 2024-25</Text>
      </View>

      <View style={styles.coverBody}>
        <View style={styles.coverGrid}>
          {[
            { label: 'Reporting Year', value: 'FY 2024-25' },
            { label: 'Previous Year', value: 'FY 2023-24' },
            { label: 'Framework', value: 'SEBI BRSR (Schedule III)' },
            { label: 'Principle', value: '6 — Environmental Stewardship' },
          ].map(item => (
            <View key={item.label} style={styles.coverGridItem}>
              <View style={styles.coverInfoBox}>
                <Text style={styles.coverInfoLabel}>{item.label}</Text>
                <Text style={styles.coverInfoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.coverDivider} />

        <Text style={{ fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.text, marginBottom: 8 }}>
          Sections Covered — All 13 Essential Indicators
        </Text>
        {[
          { n: '1',  t: 'Energy Consumption & Intensity' },
          { n: '2',  t: 'PAT Scheme — Designated Consumers' },
          { n: '3',  t: 'Water Withdrawal & Consumption' },
          { n: '4',  t: 'Water Discharge by Destination' },
          { n: '5',  t: 'Zero Liquid Discharge Mechanism' },
          { n: '6',  t: 'Air Emissions (other than GHG)' },
          { n: '7',  t: 'Greenhouse Gas Emissions & Intensity' },
          { n: '8',  t: 'GHG Reduction Projects & Initiatives' },
          { n: '9',  t: 'Waste Management — Quantities' },
          { n: '10', t: 'Waste Management Practices (Narrative)' },
          { n: '11', t: 'Ecologically Sensitive Areas' },
          { n: '12', t: 'Environmental Impact Assessments' },
          { n: '13', t: 'Environmental Compliance' },
        ].map(item => (
          <View key={item.n} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ width: 16, height: 16, backgroundColor: C.green, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
              <Text style={{ fontSize: F.xs, color: C.white, fontFamily: 'Helvetica-Bold' }}>{item.n}</Text>
            </View>
            <Text style={{ fontSize: F.sm, color: C.text }}>{item.t}</Text>
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
        PAGE — Q1: ENERGY + Q2: PAT SCHEME
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Energy Consumption" />
      <View style={{ marginTop: 28 }}>

        {/* Q1 */}
        <SectionHeading
          num="1"
          title="Details of total energy consumption (in Joules or multiples) and energy intensity, in the following format:"
        />
        <View style={styles.table}>
          <THead fyLabel="FY 2024-25\nCurrent Financial Year" pyLabel="FY 2023-24\nPrevious Financial Year" />

          <SubHead label="From renewable sources" />
          <TRow label="Total electricity consumption (A)"             unit="GJ" fy={locNum(n(fd.energy_A))} py={locNum(py.energy_A)} indent />
          <TRow label="Total fuel consumption (B)"                    unit="GJ" fy={locNum(n(fd.energy_B))} py={locNum(py.energy_B)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Energy consumption through other sources (C)"  unit="GJ" fy={locNum(n(fd.energy_C))} py={locNum(py.energy_C)} indent />
          <TRow
            label="Total energy consumed from renewable sources (A+B+C)"
            unit="GJ"
            fy={locNum(fym.energy_renewable_total)}
            py={locNum(pym.energy_renewable_total)}
            rowStyle={styles.rowGreen}
            textStyle={styles.tdTextGreen}
          />

          <SubHead label="From non-renewable sources" />
          <TRow label="Total electricity consumption (D)"             unit="GJ" fy={locNum(n(fd.energy_D))} py={locNum(py.energy_D)} indent />
          <TRow label="Total fuel consumption (E)"                    unit="GJ" fy={locNum(n(fd.energy_E))} py={locNum(py.energy_E)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Energy consumption through other sources (F)"  unit="GJ" fy={locNum(n(fd.energy_F))} py={locNum(py.energy_F)} indent />
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

          <TRow label="Energy intensity per rupee of turnover (Total energy consumed / Revenue from operations)" unit="GJ/Cr. Rs."  fy={fmt(fym.energy_intensity_revenue, 2)} py={fmt(pym.energy_intensity_revenue, 2)} />
          <TRow label="Energy intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP)"         unit="GJ/M USD"    fy={fmt(fym.energy_intensity_ppp, 2)}     py={fmt(pym.energy_intensity_ppp, 2)}     rowStyle={styles.rowBaseAlt} />
          <TRow label="Energy intensity in terms of physical output — Production"                                  unit="GJ/MT"       fy={fmt(fym.energy_intensity_production, 2)} py={fmt(pym.energy_intensity_production, 2)} />
        </View>

        <View style={styles.noteBlock}>
          <Text style={styles.noteText}>
            Note: Indicate if any independent assessment/evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.
          </Text>
        </View>

        {/* Q2 */}
        <NarrativeQ
          num="2"
          question="Does the entity have any sites / facilities identified as designated consumers (DCs) under the Performance, Achieve and Trade (PAT) Scheme of the Government of India? (Y/N) If yes, disclose whether targets set under the PAT scheme have been achieved. In case targets have not been achieved, provide the remedial action taken, if any."
          answer={s(fd.theory_q2) || s(py.theory_q2)}
        />
      </View>
      <PageFooter />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE — Q3: WATER WITHDRAWAL + Q4: WATER DISCHARGE + Q5: ZLD
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Water" />
      <View style={{ marginTop: 28 }}>

        {/* Q3 */}
        <SectionHeading num="3" title="Provide details of the following disclosures related to water, in the following format:" />
        <View style={styles.table}>
          <THead fyLabel="FY 2024-25\nCurrent Financial Year" pyLabel="FY 2023-24\nPrevious Financial Year" />
          <SubHead label="Water withdrawal by source (in kiloliters)" />
          <TRow label="(i) Surface water"                              unit="kL" fy={locNum(n(fd.water_surface))}     py={locNum(py.water_surface)}     indent />
          <TRow label="(ii) Groundwater"                               unit="kL" fy={locNum(n(fd.water_ground))}      py={locNum(py.water_ground)}      rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(iii) Third party water (Municipal water supplies)" unit="kL" fy={locNum(n(fd.water_thirdparty))} py={locNum(py.water_thirdparty)}  indent />
          <TRow label="(iv) Seawater / desalinated water"              unit="kL" fy={locNum(n(fd.water_seawater))}   py={locNum(py.water_seawater)}    rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(v) Others"                                     unit="kL" fy={locNum(n(fd.water_others))}     py={locNum(py.water_others)}      indent />
          <TRow
            label="Total volume of water withdrawal (i+ii+iii+iv+v)"
            unit="kL"
            fy={locNum(fym.water_withdrawal_total)}
            py={locNum(pym.water_withdrawal_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
          <TRow label="Total volume of water consumption"           unit="kL"         fy={locNum(n(fd.water_consumption))}        py={locNum(py.water_consumption)}    rowStyle={styles.rowBaseAlt} />
          <TRow label="Water intensity per rupee of turnover"        unit="kL/Cr. Rs." fy={fmt(fym.water_intensity_revenue, 2)}    py={fmt(pym.water_intensity_revenue, 2)} />
          <TRow label="Water intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP)" unit="kL/M USD" fy={fmt(fym.water_intensity_ppp, 2)} py={fmt(pym.water_intensity_ppp, 2)} rowStyle={styles.rowBaseAlt} />
          <TRow label="Water intensity in terms of physical output"  unit="kL/MT"     fy={fmt(fym.water_intensity_production, 2)} py={fmt(pym.water_intensity_production, 2)} />
        </View>

        <View style={styles.noteBlock}>
          <Text style={styles.noteText}>Note: Indicate if any independent assessment/evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
        </View>

        {/* Q4 */}
        <SectionHeading num="4" title="Provide the following details related to water discharged:" />
        <View style={styles.table}>
          <THead fyLabel="FY 2024-25" pyLabel="FY 2023-24" />
          <SubHead label="Water discharge by destination and level of treatment (in kilo liters)" />
          <SubHead label="(i) To Surface water" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_surface_notx))} py={locNum(py.wd_surface_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_surface_tx))}   py={locNum(py.wd_surface_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="(ii) To Groundwater" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_ground_notx))} py={locNum(py.wd_ground_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_ground_tx))}   py={locNum(py.wd_ground_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="(iii) To Seawater" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_sea_notx))} py={locNum(py.wd_sea_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_sea_tx))}   py={locNum(py.wd_sea_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="(iv) Sent to third parties" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_third_notx))} py={locNum(py.wd_third_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_third_tx))}   py={locNum(py.wd_third_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <SubHead label="(v) Others" />
          <TRow label="— No treatment"   unit="kL" fy={locNum(n(fd.wd_others_notx))} py={locNum(py.wd_others_notx)} indent />
          <TRow label="— With treatment" unit="kL" fy={locNum(n(fd.wd_others_tx))}   py={locNum(py.wd_others_tx)}   rowStyle={styles.rowBaseAlt} indent />
          <TRow
            label="Total water discharged (in kilo liters)"
            unit="kL"
            fy={locNum(fym.wd_total)}
            py={locNum(pym.wd_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
        </View>

        {/* Q5 */}
        <NarrativeQ
          num="5"
          question="Has the entity implemented a mechanism for Zero Liquid Discharge? If yes, provide details of its coverage and implementation."
          answer={s(fd.theory_q5) || s(py.theory_q5)}
        />
      </View>
      <PageFooter />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE — Q6: AIR EMISSIONS + Q7: GHG + Q8: GHG INITIATIVES
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Air Emissions & GHG" />
      <View style={{ marginTop: 28 }}>

        {/* Q6 */}
        <SectionHeading num="6" title="Please provide details of air emissions (other than GHG emissions) by the entity, in the following format *:" />
        <View style={styles.table}>
          <THead fyLabel="FY 2024-25\nCurrent Financial Year" pyLabel="FY 2023-24\nPrevious Financial Year" />
          <TRow label="NOx"                                    unit="MT"  fy={locNum(n(fd.air_nox))} py={locNum(py.air_nox)} />
          <TRow label="SOx"                                    unit="MT"  fy={locNum(n(fd.air_sox))} py={locNum(py.air_sox)} rowStyle={styles.rowBaseAlt} />
          <TRow label="Particulate matter (PM)"                unit="MT"  fy={locNum(n(fd.air_pm))}  py={locNum(py.air_pm)} />
          <TRow label="Persistent organic pollutants (POP)"   unit="—"   fy="NA" py="NA" rowStyle={styles.rowBaseAlt} />
          <TRow label="Volatile organic compounds (VOC)"       unit="—"   fy="NA" py="NA" />
          <TRow label="Hazardous air pollutants (HAP)"         unit="—"   fy="NA" py="NA" rowStyle={styles.rowBaseAlt} />
        </View>
        <View style={styles.noteBlock}>
          <Text style={styles.noteText}>Note: Indicate if any independent assessment/evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
        </View>

        {/* Q7 */}
        <SectionHeading num="7" title="Provide details of greenhouse gas emissions (Scope 1 and Scope 2 emissions) & its intensity, in the following format:" />
        <View style={styles.table}>
          <THead fyLabel="FY 2024-25\nCurrent Financial Year" pyLabel="FY 2023-24\nPrevious Financial Year" />
          <TRow label="Total Scope 1 emissions (Break-up of the GHG into CO\u2082, CH\u2084, N\u2082O, HFCs, PFCs, SF\u2086, NF\u2083, if available)" unit="MT CO\u2082Eq" fy={locNum(n(fd.ghg_scope1))} py={locNum(py.ghg_scope1)} />
          <TRow label="Total Scope 2 emissions (Break-up of the GHG into CO\u2082, CH\u2084, N\u2082O, HFCs, PFCs, SF\u2086, NF\u2083, if available)" unit="MT CO\u2082Eq" fy={locNum(n(fd.ghg_scope2))} py={locNum(py.ghg_scope2)} rowStyle={styles.rowBaseAlt} />
          <TRow
            label="Total Scope 1 and Scope 2 emissions"
            unit="MT CO\u2082Eq"
            fy={locNum(fym.ghg_total)}
            py={locNum(pym.ghg_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
          <TRow label="Total Scope 1 and Scope 2 emission intensity per rupee of turnover (Total / Revenue from operations)" unit="MT CO\u2082Eq/Cr." fy={fmt(fym.ghg_intensity_revenue, 2)} py={fmt(pym.ghg_intensity_revenue, 2)} />
          <TRow label="Total Scope 1 and Scope 2 emission intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP)" unit="MT CO\u2082Eq/M USD" fy={fmt(fym.ghg_intensity_ppp, 2)} py={fmt(pym.ghg_intensity_ppp, 2)} rowStyle={styles.rowBaseAlt} />
          <TRow label="Total Scope 1 and Scope 2 emission intensity in terms of physical output" unit="MT CO\u2082Eq/MT" fy={fmt(fym.ghg_intensity_production, 2)} py={fmt(pym.ghg_intensity_production, 2)} />
        </View>
        <View style={styles.noteBlock}>
          <Text style={styles.noteText}>Note: Indicate if any independent assessment/evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
        </View>

        {/* Q8 */}
        <NarrativeQ
          num="8"
          question="Does the entity have any project related to reducing Green House Gas emission? If Yes, then provide details."
          answer={s(fd.theory_q8) || s(py.theory_q8)}
        />
      </View>
      <PageFooter />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE — Q9: WASTE
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Waste Management" />
      <View style={{ marginTop: 28 }}>

        {/* Q9 */}
        <SectionHeading num="9" title="Provide details related to waste management by the entity, in the following format:" />
        <View style={styles.table}>
          <THead fyLabel="FY 2024-25\nCurrent Financial Year" pyLabel="FY 2023-24\nPrevious Financial Year" />

          <SubHead label="Total Waste generated (in metric tons)" />
          <TRow label="Plastic waste (A)"                     unit="MT" fy={locNum(n(fd.waste_A))} py={locNum(py.waste_A)} indent />
          <TRow label="E-waste (B)"                           unit="MT" fy={locNum(n(fd.waste_B))} py={locNum(py.waste_B)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Bio-medical waste (C)"                 unit="MT" fy={locNum(n(fd.waste_C))} py={locNum(py.waste_C)} indent />
          <TRow label="Construction and demolition waste (D)" unit="MT" fy={locNum(n(fd.waste_D))} py={locNum(py.waste_D)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Battery waste (E)"                     unit="MT" fy={locNum(n(fd.waste_E))} py={locNum(py.waste_E)} indent />
          <TRow label="Radioactive waste (F)"                 unit="MT" fy={locNum(n(fd.waste_F))} py={locNum(py.waste_F)} rowStyle={styles.rowBaseAlt} indent />
          <TRow label="Other Hazardous waste (G)"             unit="MT" fy={locNum(n(fd.waste_G))} py={locNum(py.waste_G)} indent />
          <TRow label="Other Non-hazardous waste generated (H)" unit="MT" fy={locNum(n(fd.waste_H))} py={locNum(py.waste_H)} rowStyle={styles.rowBaseAlt} indent />
          <TRow
            label="Total (A+B+C+D+E+F+G+H)"
            unit="MT"
            fy={locNum(fym.waste_total)}
            py={locNum(pym.waste_total)}
            rowStyle={styles.rowGrand}
            textStyle={styles.tdTextGreen}
          />
          <TRow label="Waste intensity per crore rupees of Turnover (Total waste generated / Revenue from operations in Cr. Rs.)" unit="MT/Cr. Rs." fy={fmt(fym.waste_intensity_revenue, 2)} py={fmt(pym.waste_intensity_revenue, 2)} />
          <TRow label="Waste intensity per million USD of turnover adjusted for Purchasing Power Parity (PPP)" unit="MT/M USD" fy={fmt(fym.waste_intensity_ppp, 2)} py={fmt(pym.waste_intensity_ppp, 2)} rowStyle={styles.rowBaseAlt} />
          <TRow label="Waste intensity in terms of physical output — Metric tons of waste/Metric ton of production" unit="MT/MT" fy={fmt(fym.waste_intensity_production, 2)} py={fmt(pym.waste_intensity_production, 2)} />

          <SubHead label="For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tons)" />
          <TRow label="(i) Recycled"                    unit="MT" fy={locNum(n(fd.waste_recycled))}       py={locNum(py.waste_recycled)}        indent />
          <TRow label="(ii) Re-used"                    unit="MT" fy={locNum(n(fd.waste_reused))}          py={locNum(py.waste_reused)}          rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(iii) Other recovery operations" unit="MT" fy={locNum(n(fd.waste_recovery_other))}  py={locNum(py.waste_recovery_other)}  indent />
          <TRow
            label="Total waste recovered"
            unit="MT"
            fy={locNum(fym.waste_recovery_total)}
            py={locNum(pym.waste_recovery_total)}
            rowStyle={styles.rowGreen}
            textStyle={styles.tdTextGreen}
          />

          <SubHead label="For each category of waste generated, total waste disposed by nature of disposal method (in metric tons)" />
          <TRow label="(i) Incineration"              unit="MT" fy={locNum(n(fd.waste_incineration))}          py={locNum(py.waste_incineration)}         indent />
          <TRow label="(ii) Landfilling"              unit="MT" fy={locNum(n(fd.waste_landfill))}              py={locNum(py.waste_landfill)}             rowStyle={styles.rowBaseAlt} indent />
          <TRow label="(iii) Landfilling after incineration" unit="MT" fy={locNum(n(fd.waste_landfill_incineration))} py={locNum(py.waste_landfill_incineration)} indent />
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
      <PageFooter />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════
        PAGE — Q10–Q13: NARRATIVE QUESTIONS
    ═══════════════════════════════════════════════════════════════ */}
    <Page size="A4" style={styles.page}>
      <RunningHeader section="Environmental Governance" />
      <View style={{ marginTop: 28 }}>

        {/* Q10 */}
        <NarrativeQ
          num="10"
          question="Briefly describe the waste management practices adopted in your establishments. Describe the strategy adopted by your company to reduce usage of hazardous and toxic chemicals in your products and processes and the practices adopted to manage such wastes."
          answer={s(fd.theory_q10) || s(py.theory_q10)}
        />

        {/* Q11 */}
        <View style={styles.qBlock}>
          <Text style={styles.qQuestion}>
            11. If the entity has operations/offices in/around ecologically sensitive areas (such as national parks, wildlife sanctuaries, biosphere reserves, wetlands, biodiversity hotspots, forests, coastal regulation zones etc.) where environmental approvals / clearances are required, please specify details in the following format:
          </Text>
          {(s(fd.theory_q11) || s(py.theory_q11)) ? (
            <Text style={styles.qAnswer}>{s(fd.theory_q11) || s(py.theory_q11)}</Text>
          ) : (
            <View style={styles.narrowTableWide}>
              <View style={styles.narrowHead}>
                {['S. No.', 'Location of operations/offices', 'Type of operations', 'Whether conditions of environmental approval/clearance are being complied with? (Y/N)'].map((h, i) => (
                  <View key={i} style={i < 3 ? styles.narrowCell : styles.narrowCellLast}>
                    <Text style={styles.narrowThText}>{h}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.narrowRow}>
                <View style={styles.narrowCell}><Text style={styles.narrowTdText}>–</Text></View>
                <View style={{ flex: 3, padding: '4 6' }}><Text style={[styles.narrowTdText, { fontStyle: 'italic', color: C.textMuted }]}>Not Applicable</Text></View>
              </View>
            </View>
          )}
        </View>

        {/* Q12 */}
        <View style={styles.qBlock}>
          <Text style={styles.qQuestion}>
            12. Details of environmental impact assessments of projects undertaken by the entity based on applicable laws, in the current financial year:
          </Text>
          {(s(fd.theory_q12) || s(py.theory_q12)) ? (
            <Text style={styles.qAnswer}>{s(fd.theory_q12) || s(py.theory_q12)}</Text>
          ) : (
            <View style={styles.narrowTableWide}>
              <View style={styles.narrowHead}>
                {['Name & brief details of project', 'EIA Notification No.', 'Date', 'Whether conducted by independent external agency', 'Results communicated in public domain', 'Relevant Web link'].map((h, i) => (
                  <View key={i} style={i < 5 ? styles.narrowCell : styles.narrowCellLast}>
                    <Text style={styles.narrowThText}>{h}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.narrowRow}>
                <View style={styles.narrowCell}><Text style={styles.narrowTdText}>–</Text></View>
                <View style={{ flex: 5, padding: '4 6' }}><Text style={[styles.narrowTdText, { fontStyle: 'italic', color: C.textMuted }]}>Not Applicable</Text></View>
              </View>
            </View>
          )}
        </View>

        {/* Q13 */}
        <NarrativeQ
          num="13"
          question="Is the entity compliant with the applicable environmental law / regulations / guidelines in India; such as the Water (Prevention and Control of Pollution) Act, Air (Prevention and Control of Pollution) Act, Environment protection act and rules thereunder (Y/N). If not, provide details of all such non-compliances, in the following format:"
          answer={s(fd.theory_q13) || s(py.theory_q13)}
        />

        {!s(fd.theory_q13) && !s(py.theory_q13) && (
          <View style={{ ...styles.narrowTableWide, marginTop: 6 }}>
            <View style={styles.narrowHead}>
              {['Specify the law/regulation/guidelines which was not complied with', 'Provide details of the non-compliance', 'Any fines/penalties/action taken by regulatory agencies', 'Corrective action taken, if any'].map((h, i) => (
                <View key={i} style={i < 3 ? styles.narrowCell : styles.narrowCellLast}>
                  <Text style={styles.narrowThText}>{h}</Text>
                </View>
              ))}
            </View>
            <View style={styles.narrowRow}>
              <View style={{ flex: 4, padding: '4 6' }}><Text style={[styles.narrowTdText, { fontStyle: 'italic', color: C.textMuted }]}>Not Applicable</Text></View>
            </View>
          </View>
        )}
      </View>
      <PageFooter />
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
