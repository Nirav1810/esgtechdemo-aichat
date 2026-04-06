"use client";

import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import DataUpload from "./components/DataUpload";
import GuidedEntry from "./components/GuidedEntry";
import ReportsSidebar from "./components/ReportsSidebar";
import Overview from "./components/Overview";
import FinalReview from "./components/FinalReview";
import ExcelReview from "./components/ExcelReview";
import {
  PyData, BrsrFormData,
  DEFAULT_PY_DATA, DEFAULT_FORM_DATA,
  computeMetrics, PPP_FACTOR,
} from './types';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';
type ReportView = 'overview' | 'upload' | 'entry' | 'review' | 'excel-review';

const setView = (setter: React.Dispatch<React.SetStateAction<ReportView>>) =>
  (v: ReportView) => setter(v);

export default function ReportsPage() {
  const [currentView, setCurrentView] = useState<ReportView>('overview');

  // Header state
  const [selectedYear, setSelectedYear] = useState('FY 2024-25');
  const [baselineYear, setBaselineYear] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const yearOptions = ['FY 2024-25', 'FY 2023-24'];

  // Upload state
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isUploaded = uploadState === 'success';

  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [pyData, setPyData] = useState<PyData>(DEFAULT_PY_DATA);

  // Wizard state
  const [formData, setFormData] = useState<BrsrFormData>(DEFAULT_FORM_DATA);

  /**
   * Handles PDF file selection.
   * Sends the file to /api/parse-brsr-pdf which uses pdf2json + LLM to extract PY data.
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadState('uploading');

    try {
      const fd = new FormData();
      fd.append('file', file);

      const response = await fetch('/api/parse-brsr-pdf', {
        method: 'POST',
        body: fd,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? `Server error: ${response.status}`);
      }

      setPyData(result.data as PyData);
      setUploadState('success');
    } catch (err) {
      console.error('[ReportsPage] PDF upload error:', err);
      setUploadError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while processing the PDF.'
      );
      setUploadState('error');
    }

    e.target.value = '';
  };

  // Auto-calc RevenuePPP from Revenue whenever Revenue changes (current year)
  useEffect(() => {
    const rev = parseFloat(String(formData.Revenue).replace(/,/g, ''));
    const computed = rev > 0 ? String(Math.round((rev * 10) / PPP_FACTOR)) : '';
    if (formData.RevenuePPP !== computed) {
      setFormData((prev: BrsrFormData) => ({ ...prev, RevenuePPP: computed }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.Revenue]);

  // Derived metrics (live calculation engine)
  const pyMetrics = computeMetrics(pyData);
  const fyMetrics = computeMetrics(formData, parseFloat(formData.RevenuePPP) || 0);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-hidden">
      <ReportsSidebar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 flex flex-col w-full relative h-screen overflow-y-auto overflow-x-hidden">
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

        <div className="flex-1 flex flex-col w-full relative">
          {currentView === 'overview' && (
            <Overview
              setCurrentView={setCurrentView}
              isUploaded={isUploaded}
              step={0}
              totalSteps={9}
              isReportGenerated={isReportGenerated}
            />
          )}
          {currentView === 'upload' && (
            <DataUpload
              currentView={currentView}
              setCurrentView={setCurrentView}
              isUploaded={isUploaded}
              uploadState={uploadState}
              uploadError={uploadError}
              pyData={pyData}
              setPyData={setPyData}
              handleFileUpload={handleFileUpload}
            />
          )}
          {currentView === 'entry' && (
            <GuidedEntry
              setCurrentView={setView(setCurrentView)}
              isUploaded={isUploaded}
              pyData={pyData}
              pyMetrics={pyMetrics}
              formData={formData}
              setFormData={setFormData}
              fyMetrics={fyMetrics}
            />
          )}
          {currentView === 'review' && (
            <FinalReview
              setCurrentView={setView(setCurrentView)}
              formData={formData}
              pyData={pyData}
              fyMetrics={fyMetrics}
              pyMetrics={pyMetrics}
              setIsReportGenerated={setIsReportGenerated}
            />
          )}
          {currentView === 'excel-review' && (
            <ExcelReview
              setCurrentView={setView(setCurrentView)}
              formData={formData}
              setFormData={setFormData}
              pyData={pyData}
              fyMetrics={fyMetrics}
              pyMetrics={pyMetrics}
              setIsReportGenerated={setIsReportGenerated}
            />
          )}
        </div>
      </main>
    </div>
  );
}
