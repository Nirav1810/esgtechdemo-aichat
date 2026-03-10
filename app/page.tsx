"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChart3,
  Factory,
} from "lucide-react";
import Header from "./components/Header";
import AISidebar from "./components/AISidebar";
import DetachedAIChat from "./components/DetachedAIChat";

// Helper function to clean LaTeX/math notation from AI responses
const cleanLatex = (content: string): string => {
  return content
    // Remove inline math delimiters but preserve content
    .replace(/\\\[\s*([\s\S]+?)\s*\\\]/g, '$1')  // Remove \[ ... \]
    .replace(/\\\(\s*([\s\S]+?)\s*\\\)/g, '$1')  // Remove \( ... \)
    .replace(/\$\$\s*([\s\S]+?)\s*\$\$/g, '$1')    // Remove $$ ... $$
    .replace(/\$\s*([^$\n]+?)\s*\$/g, '$1')        // Remove $ ... $ (single line only)
    // Clean up common LaTeX commands but preserve text inside
    .replace(/\\text\{([^}]+)\}/g, '$1')  // Remove \text{...} wrapper
    .replace(/\\textbf\{([^}]+)\}/g, '**$1**')  // Convert \textbf to markdown bold
    .replace(/\\textit\{([^}]+)\}/g, '*$1*')    // Convert \textit to markdown italic
    // Remove environment tags but keep content
    .replace(/\\begin\{[^}]+\}\s*/g, '')     // Remove \begin{...}
    .replace(/\\end\{[^}]+\}\s*/g, '')       // Remove \end{...}
    // Replace math symbols
    .replace(/\\times/g, '×')             // Replace \times with ×
    .replace(/\\approx/g, '≈')            // Replace \approx with ≈
    .replace(/\\%/g, '%')                 // Replace \% with %
    .replace(/\\,/g, ' ')                 // Replace \, with space
    .replace(/\\!/g, '')                  // Remove \!
    // Clean up subscripts and superscripts (keep the text)
    .replace(/_\{([^}]+)\}/g, '$1')       // Remove _{...} subscripts
    .replace(/\^\{([^}]+)\}/g, '$1')      // Remove ^{...} superscripts
    // Clean up multiple spaces (but preserve line breaks)
    .replace(/[ \t]+/g, ' ')              // Collapse multiple spaces/tabs to single space
    .replace(/\n{3,}/g, '\n\n')           // Limit consecutive line breaks to 2
    .trim();
};

// API Configuration - prefer primary key, fall back to legacy env or fallback key
const PRIMARY_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_PRIMARY_KEY || "";
const FALLBACK_API_KEY =
  process.env.NEXT_PUBLIC_OPENROUTER_FALLBACK_KEY || "";
const API_KEY = PRIMARY_API_KEY || FALLBACK_API_KEY;
const API_URL = "/api/chat";

// Types
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DashboardData {
  current_view: string;
  fiscal_year: string;
  total_emissions: number;
  scope_1: { value: number; status: string };
  scope_2: { value: number; status: string };
  scope_3: { value: number; status: string };
  breakdown?: {
    scope_1_percentage: number;
    scope_2_percentage: number;
    scope_3_percentage: number;
  };
  top_emitters?: string[];
  scope1_monthly?: Scope1MonthlyRecord[];
  scope2_monthly?: Scope2MonthlyRecord[];
  scope3_breakdown?: Scope3Slice[];
}

interface Scope1MonthlyRecord {
  month: string;
  stationary: number;
  mobile: number;
  fugitive: number;
}

interface Scope2MonthlyRecord {
  month: string;
  renewable: number;
  imported: number;
  electricity: number;
}

interface Scope3Slice {
  name: string;
  value: number;
  color: string;
}

interface YearDataset {
  summary: DashboardData & {
    breakdown: {
      scope_1_percentage: number;
      scope_2_percentage: number;
      scope_3_percentage: number;
    };
    top_emitters: string[];
  };
  scope1Data: Scope1MonthlyRecord[];
  scope2Data: Scope2MonthlyRecord[];
  scope3Data: Scope3Slice[];
}

const YEAR_DATASETS = {
  "FY 2025-26": {
    summary: {
      current_view: "GHG Dashboard",
      fiscal_year: "2025-26",
      total_emissions: 87725.26,
      scope_1: { value: 35533.1, status: "Data available" },
      scope_2: { value: 6352.18, status: "Data available" },
      scope_3: { value: 45839.982416, status: "Data available" },
      breakdown: {
        scope_1_percentage: 40.50,
        scope_2_percentage: 7.24,
        scope_3_percentage: 52.26,
      },
      top_emitters: [
        "Scope 3 - Purchased Goods (52.25%)",
        "Scope 1 - Stationary Combustion (40.50%)",
        "Scope 2 - Imported Electricity (7.24%)",
      ],
    },
    scope1Data: [
      { month: "Apr", stationary: 8526.23, mobile: 0, fugitive: 1300.0 },
      { month: "May", stationary: 1750.93, mobile: 0, fugitive: 0 },
      { month: "Jun", stationary: 54.34, mobile: 0, fugitive: 0 },
      { month: "Jul", stationary: 533.51, mobile: 0, fugitive: 0 },
      { month: "Aug", stationary: 595.14, mobile: 0, fugitive: 0 },
      { month: "Sep", stationary: 349.96, mobile: 0, fugitive: 0 },
      { month: "Oct", stationary: 0.23, mobile: 0, fugitive: 0 },
      { month: "Nov", stationary: 2570.23, mobile: 0, fugitive: 14.22 },
      { month: "Dec", stationary: 0, mobile: 0, fugitive: 30.82 },
      { month: "Jan", stationary: 15296.19, mobile: 0, fugitive: 4464.03 },
      { month: "Feb", stationary: 0, mobile: 0, fugitive: 29.76 },
      { month: "Mar", stationary: 0, mobile: 0, fugitive: 0 },
    ],
    scope2Data: [
      { month: "Apr", renewable: 0, imported: 0, electricity: 1.57 },
      { month: "May", renewable: 0, imported: 0, electricity: 186.53 },
      { month: "Jun", renewable: 0, imported: 0, electricity: 0.22 },
      { month: "Jul", renewable: 0, imported: 0, electricity: 0.26 },
      { month: "Aug", renewable: 0, imported: 0, electricity: 3.43 },
      { month: "Sep", renewable: 0, imported: 0, electricity: 5795.62 },
      { month: "Oct", renewable: 0, imported: 0, electricity: 3.06 },
      { month: "Nov", renewable: 0, imported: 0, electricity: 0 },
      { month: "Dec", renewable: 0, imported: 0, electricity: 345.41 },
      { month: "Jan", renewable: 0, imported: 0, electricity: 0 },
      { month: "Feb", renewable: 0, imported: 0, electricity: 15.87 },
      { month: "Mar", renewable: 0, imported: 0, electricity: 0 },
    ],
    scope3Data: [
      { name: "Purchased Goods", value: 44952.301031, color: "#6366f1" },
      { name: "Downstream Activities", value: 206.723297, color: "#ef4444" },
      { name: "T&D Loss", value: 181.32087, color: "#10b981" },
      { name: "Water Treatment", value: 165.871319, color: "#84cc16" },
      { name: "Upstream Activities", value: 107.237389, color: "#8b5cf6" },
      { name: "Water Supply", value: 93.849879, color: "#06b6d4" },
      { name: "Air Travel", value: 85.780954, color: "#f97316" },
      { name: "Hotel Stay", value: 20.4363, color: "#ec4899" },
      { name: "Sea Travel", value: 11.8335, color: "#14b8a6" },
      { name: "Food Consumption", value: 5.07625, color: "#78716c" },
      { name: "Waste Disposal", value: 4.606446, color: "#f59e0b" },
      { name: "Employee Commute", value: 3.713639, color: "#64748b" },
      { name: "Land Travel", value: 1.231542, color: "#a3a3a3" },
    ],
  },
} satisfies Record<string, YearDataset>;

type YearKey = keyof typeof YEAR_DATASETS;

const formatDelta = (delta: number, digits = 2) => {
  const rounded = Math.abs(delta).toFixed(digits);
  if (Number(rounded) === 0) {
    return "0";
  }
  return `${delta >= 0 ? "+" : "-"}${rounded}`;
};

const buildContextPayload = (dataset: YearDataset) =>
  JSON.stringify(
    {
      ...dataset.summary,
      scope1_monthly: dataset.scope1Data,
      scope2_monthly: dataset.scope2Data,
      scope3_breakdown: dataset.scope3Data,
    },
    null,
    2
  );

// Circular Progress Component
const CircularProgress = ({
  value,
  max,
  color,
  size = 80,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`progress-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={1}/>
            <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#progress-${color.replace('#', '')})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-gray-800">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

// Scope Card Component
const ScopeCard = ({
  title,
  value,
  unit,
  color,
  percentage,
  baselineValue,
  baselineYear,
}: {
  title: string;
  value: number;
  unit: string;
  color: string;
  percentage: number;
  baselineValue?: number;
  baselineYear?: string | null;
}) => {
  const delta = baselineYear && typeof baselineValue === "number" ? value - baselineValue : null;
  const isPositive = delta !== null ? delta > 0 : false;
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100/50 overflow-hidden relative">
      {/* Colored top accent */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">
              {value.toLocaleString('en-US')}
            </span>
            <span className="text-xs text-gray-400">{unit}</span>
          </div>
          {delta !== null && (
            <div className={`mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(delta).toLocaleString()} {unit}
              <span className="text-gray-400 ml-1">vs {baselineYear}</span>
            </div>
          )}
        </div>
        <CircularProgress value={percentage} max={100} color={color} size={72} />
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function ESGDashboard() {
  const yearOptions = Object.keys(YEAR_DATASETS) as YearKey[];
  const defaultYear = yearOptions[0];
  const defaultBaseline = (yearOptions[1] ?? "") as YearKey | "";
  const [selectedYear, setSelectedYear] = useState<YearKey>(defaultYear);
  const [baselineYear, setBaselineYear] = useState<YearKey | "">(
    defaultBaseline
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isDetached, setIsDetached] = useState(false);
  const [contextData, setContextData] = useState<string>(() =>
    buildContextPayload(YEAR_DATASETS[defaultYear])
  );

  useEffect(() => {
    setContextData(buildContextPayload(YEAR_DATASETS[selectedYear]));
  }, [selectedYear]);

  const currentYearDataset = YEAR_DATASETS[selectedYear];
  const baselineDataset = baselineYear ? YEAR_DATASETS[baselineYear] : null;

  const dashboardData: DashboardData = JSON.parse(contextData);
  const { scope1Data, scope2Data, scope3Data } = currentYearDataset;
  const baselineSummary = baselineDataset?.summary;
  const baselineLabel = baselineYear || null;
  const scope1BaselineValue = baselineSummary?.scope_1.value;
  const scope2BaselineValue = baselineSummary?.scope_2.value;
  const scope3BaselineValue = baselineSummary?.scope_3.value;
  const totalDelta = baselineSummary
    ? dashboardData.total_emissions - baselineSummary.total_emissions
    : null;

  // Calculate percentages based on total
  const total = dashboardData.total_emissions || 1;
  const scope1Percentage = (dashboardData.scope_1.value / total) * 100;
  const scope2Percentage = (dashboardData.scope_2.value / total) * 100;
  const scope3Percentage = (dashboardData.scope_3.value / total) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <main
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginRight: (sidebarOpen && !isDetached) ? sidebarWidth : 0 }}
      >
        <Header
          selectedYear={selectedYear}
          setSelectedYear={(year) => setSelectedYear(year as YearKey)}
          baselineYear={baselineYear}
          setBaselineYear={(year) => setBaselineYear(year as YearKey | "")}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          yearOptions={yearOptions}
          activePage="dashboard"
        />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">GHG Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Monitor your greenhouse gas emissions across all scopes
              </p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Main Total Emissions Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <Factory className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                    FY {dashboardData.fiscal_year}
                  </span>
                </div>
                <h3 className="text-emerald-100 text-sm font-medium mb-2">
                  Total GHG Emissions
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {dashboardData.total_emissions.toLocaleString('en-US')}
                  </span>
                  <span className="text-emerald-200 text-sm">TCO2Eq</span>
                </div>
                <div className="mt-5 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-sm text-emerald-100">
                    <BarChart3 className="w-4 h-4" />
                    <span>Across all scopes</span>
                  </div>
                  {baselineSummary && baselineLabel && totalDelta !== null && (
                    <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${totalDelta > 0 ? 'bg-red-500/20 text-red-100' : 'bg-emerald-500/20 text-emerald-100'}`}>
                      <span>
                        {totalDelta > 0 ? '↑' : '↓'} {Math.abs(totalDelta).toLocaleString()} TCO2Eq
                      </span>
                      <span className="opacity-70">vs {baselineLabel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scope 1 Card */}
              <ScopeCard
                title="Scope 1"
                value={dashboardData.scope_1.value}
                unit="TCO2Eq"
                color="#10b981"
                percentage={scope1Percentage}
                baselineValue={scope1BaselineValue}
                baselineYear={baselineLabel}
              />

              {/* Scope 2 Card */}
              <ScopeCard
                title="Scope 2"
                value={dashboardData.scope_2.value}
                unit="TCO2Eq"
                color="#ec4899"
                percentage={scope2Percentage}
                baselineValue={scope2BaselineValue}
                baselineYear={baselineLabel}
              />

              {/* Scope 3 Card */}
              <ScopeCard
                title="Scope 3"
                value={dashboardData.scope_3.value}
                unit="TCO2Eq"
                color="#3b82f6"
                percentage={scope3Percentage}
                baselineValue={scope3BaselineValue}
                baselineYear={baselineLabel}
              />
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              {/* Scope 1 Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Scope 1
                    </h3>
                    <p className="text-sm text-gray-500">
                      Direct emissions from owned or controlled sources
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Detailed
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 rounded-lg">
                      Overall
                    </button>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scope1Data} barCategoryGap="20%">
                      <defs>
                        <linearGradient id="stationaryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="mobileGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#db2777" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="fugitiveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                        }}
                        cursor={{ fill: '#f9fafb' }}
                      />
                      <Bar
                        dataKey="stationary"
                        stackId="a"
                        fill="url(#stationaryGradient)"
                        radius={[0, 0, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey="mobile"
                        stackId="a"
                        fill="url(#mobileGradient)"
                        radius={[0, 0, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey="fugitive"
                        stackId="a"
                        fill="url(#fugitiveGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-600">Stationary Combustion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    <span className="text-gray-600">Mobile Combustion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">Fugitive Emissions</span>
                  </div>
                </div>
              </div>

              {/* Scope 2 Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Scope 2
                    </h3>
                    <p className="text-sm text-gray-500">
                      Indirect emissions from purchased energy
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Detailed
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 rounded-lg">
                      Overall
                    </button>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scope2Data}>
                      <defs>
                        <linearGradient id="renewableGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="importedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="electricityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="renewable"
                        stackId="a"
                        stroke="#10b981"
                        fill="url(#renewableGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="imported"
                        stackId="a"
                        stroke="#ec4899"
                        fill="url(#importedGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="electricity"
                        stackId="a"
                        stroke="#3b82f6"
                        fill="url(#electricityGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-600">Renewable Electricity Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    <span className="text-gray-600">Imported Energy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">Imported Electricity</span>
                  </div>
                </div>
              </div>

              {/* Scope 3 Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Scope 3
                  </h3>
                  <p className="text-sm text-gray-500">
                    All other indirect emissions in your value chain
                  </p>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {scope3Data.map((entry: Scope3Slice, index: number) => (
                          <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={scope3Data}
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={150}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {scope3Data.map((entry: Scope3Slice, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#pieGradient-${index})`}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                        }}
                        formatter={(value) => {
                          const numValue = typeof value === 'number' ? value : 0;
                          return [numValue.toLocaleString() + ' TCO2Eq', ''];
                        }}
                      />
                      <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }}
                        formatter={(value) => <span style={{ color: '#374151', fontWeight: 500 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* AI Sidebar - Only show when not detached */}
      {!isDetached && (
        <div className="fixed right-0 top-0 h-full z-50">
          <AISidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            contextData={contextData}
            pageType="dashboard"
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
            isDetached={isDetached}
            onDetach={() => setIsDetached(true)}
          />
        </div>
      )}

      {/* Detached window handler */}
      {isDetached && (
        <DetachedAIChat
          isOpen={sidebarOpen}
          onClose={() => {
            setIsDetached(false);
            setSidebarOpen(false);
          }}
          contextData={contextData}
          pageType="dashboard"
          onDock={() => setIsDetached(false)}
        />
      )}
    </div>
  );
}
