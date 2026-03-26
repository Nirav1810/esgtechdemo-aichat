"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AISidebar from "../components/AISidebar";
import DetachedAIChat from "../components/DetachedAIChat";
import { Download, ChevronDown, Filter } from "lucide-react";

// Types
interface TableRow {
  id: string;
  date: string;
  entryPeriod: string;
  siteName: string;
  type?: string;
  unitOfMeasure: string;
  consumption?: number;
  source?: string;
  emissionFactor?: number;
  nameOfCountry?: string;
  heatSource?: string;
  fuelType?: string;
  commuteType?: string;
  vehicleType?: string;
  foodType?: string;
  typeOfGoods?: string;
  loop?: string;
  generation?: number;
  flightType?: string;
  passengerClass?: string;
  transportMode?: string;
  hotelCountry?: string;
  roomNights?: number;
}

interface TableSection {
  title: string;
  totalEmissions: number;
  columns: { key: string; label: string }[];
  data: TableRow[];
}

// Summary card component
const SummaryCard = ({
  title,
  value,
  unit = "TCO2Eq",
  isTotal = false,
}: {
  title: string;
  value: number;
  unit?: string;
  isTotal?: boolean;
}) => (
  <div
    className={`rounded-xl p-6 ${
      isTotal
        ? "bg-gradient-to-br from-[#3e6b3e] to-[#2d522d] text-white"
        : "bg-white border border-gray-200"
    }`}
  >
    <h3
      className={`text-sm font-medium mb-2 ${
        isTotal ? "text-emerald-100" : "text-gray-600"
      }`}
    >
      {title}
    </h3>
    <div className="flex items-baseline gap-1">
      <span
        className={`text-3xl font-bold ${
          isTotal ? "text-white" : "text-gray-900"
        }`}
      >
        {value.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
      </span>
      <span
        className={`text-sm ${isTotal ? "text-emerald-200" : "text-gray-500"}`}
      >
        {unit}
      </span>
    </div>
  </div>
);

// Table component
const DataTable = ({
  title,
  totalEmissions,
  columns,
  data,
}: TableSection) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getCellValue = (row: TableRow, key: string): string => {
    const value = row[key as keyof TableRow];
    if (value === undefined || value === null) return "-";
    if (typeof value === "number") return value.toLocaleString('en-US');
    return String(value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
      <div
        className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            Total GHG Emissions: {totalEmissions.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} TCO2Eq
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? "" : "-rotate-90"
          }`}
        />
      </div>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <Filter className="w-3 h-3" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {getCellValue(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function GHGReportPage() {
  const [fiscalYears, setFiscalYears] = useState<string[]>(["FY 2025-26"]);
  const [loadingData, setLoadingData] = useState(false);
  const [dbData, setDbData] = useState<{
    summary: any;
    records: any[];
  } | null>(null);
  
  const [selectedYear, setSelectedYear] = useState("FY 2025-26");
  const [baselineYear, setBaselineYear] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isDetached, setIsDetached] = useState(false);
  const [fromDate, setFromDate] = useState("Apr - 2025");
  const [toDate, setToDate] = useState("Mar - 2026");
  const [selectedSite, setSelectedSite] = useState("All Sites");
  const [exportType, setExportType] = useState("Select Export Type");
  const [contextData, setContextData] = useState<string>("");

  // Fetch fiscal years on mount
  useEffect(() => {
    fetchFiscalYears();
  }, []);

  const fetchFiscalYears = async () => {
    try {
      const res = await fetch("/api/emissions");
      const data = await res.json();
      if (data.fiscalYears && data.fiscalYears.length > 0) {
        setFiscalYears(data.fiscalYears);
        setSelectedYear(data.fiscalYears[0]);
      }
    } catch (error) {
      console.error("Error fetching fiscal years:", error);
    }
  };

  // Fetch emissions data when year changes
  useEffect(() => {
    fetchEmissionsData();
  }, [selectedYear]);

  const fetchEmissionsData = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`/api/emissions/${selectedYear}`);
      const data = await res.json();
      if (!data.error) {
        setDbData(data);
        // Build context for AI
        const contextPayload = {
          fiscal_year: data.summary?.fiscal_year || selectedYear,
          total_emissions: data.summary?.total_emissions || 0,
          scope_1: data.summary?.scope_1?.value || 0,
          scope_2: data.summary?.scope_2?.value || 0,
          scope_3: data.summary?.scope_3?.value || 0,
          records: data.records || [],
        };
        setContextData(JSON.stringify(contextPayload, null, 2));
      }
    } catch (error) {
      console.error("Error fetching emissions data:", error);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (dbData) {
      const contextPayload = {
        fiscal_year: dbData.summary?.fiscal_year || selectedYear,
        total_emissions: dbData.summary?.total_emissions || 0,
        scope_1: dbData.summary?.scope_1?.value || 0,
        scope_2: dbData.summary?.scope_2?.value || 0,
        scope_3: dbData.summary?.scope_3?.value || 0,
        records: dbData.records || [],
      };
      setContextData(JSON.stringify(contextPayload, null, 2));
    }
  }, [selectedYear, dbData]);

  // Summary values - from MongoDB only
  const totalEmissions = dbData?.summary?.total_emissions || 0;
  const scope1Value = dbData?.summary?.scope_1?.value || 0;
  const scope2Value = dbData?.summary?.scope_2?.value || 0;
  const scope3Value = dbData?.summary?.scope_3?.value || 0;

  // Derive table data from MongoDB records
  const records = dbData?.records || [];
  
  const scope1StationaryData = records.filter((r: any) => r.scope === 1 && r.category === "Stationary Combustion");
  const scope1MobileData = records.filter((r: any) => r.scope === 1 && r.category === "Mobile Combustion");
  const scope1FugitiveData = records.filter((r: any) => r.scope === 1 && r.category === "Fugitive Emissions");
  
  const scope2ElectricityData = records.filter((r: any) => r.scope === 2 && r.category === "Purchased Electricity");
  const scope2HeatSteamData = records.filter((r: any) => r.scope === 2 && r.category === "Purchased Heat and Steam");
  const scope2RenewableData = records.filter((r: any) => r.scope === 2 && r.category === "Renewable Electricity Generation");
  
  const scope3CommuteData = records.filter((r: any) => r.scope === 3 && r.category === "Employee Commute");
  const scope3FoodData = records.filter((r: any) => r.scope === 3 && r.category === "Food Consumption");
  const scope3GoodsData = records.filter((r: any) => r.scope === 3 && r.category === "Purchased Goods");
  const scope3TransmissionData = records.filter((r: any) => r.scope === 3 && (r.category === "Transmission & Distribution Loss" || r.category === "T&D Loss"));
  const scope3UpstreamData = records.filter((r: any) => r.scope === 3 && r.category === "Upstream Activities");
  const scope3DownstreamData = records.filter((r: any) => r.scope === 3 && r.category === "Downstream Activities");
  const scope3WasteData = records.filter((r: any) => r.scope === 3 && r.category === "Waste Disposal");
  const scope3WaterSupplyData = records.filter((r: any) => r.scope === 3 && r.category === "Water Supply");
  const scope3WaterTreatmentData = records.filter((r: any) => r.scope === 3 && r.category === "Water Treatment");
  const scope3TravelAirData = records.filter((r: any) => r.scope === 3 && r.category === "Air Travel");
  const scope3TravelSeaData = records.filter((r: any) => r.scope === 3 && r.category === "Sea Travel");
  const scope3TravelLandData = records.filter((r: any) => r.scope === 3 && r.category === "Land Travel");
  const scope3HotelData = records.filter((r: any) => r.scope === 3 && r.category === "Hotel Stay");

  // Calculate totals from records
  const calcTotal = (data: any[]) => data.reduce((sum, r) => sum + (r.consumption * r.emissionFactor || 0), 0);

  // Show loading while fetching data
  if (!dbData && fiscalYears.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <main
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginRight: (sidebarOpen && !isDetached) ? sidebarWidth : 0 }}
      >
      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        baselineYear={baselineYear}
        setBaselineYear={setBaselineYear}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        yearOptions={fiscalYears}
        activePage="ghg-reports"
        onAskAIClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-8 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="text-emerald-600">Dashboard</span>
          <span>/</span>
          <span>Reports</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Report for All Sites - Financial Year 2025
          </h1>
          <p className="text-gray-500 mt-1">Management period: Apr 2025 - Mar 2026</p>
        </div>

        {/* Scope Emission Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope Emission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total GHG Emissions"
              value={totalEmissions}
              isTotal={true}
            />
            <SummaryCard title="Scope 1" value={scope1Value} />
            <SummaryCard title="Scope 2" value={scope2Value} />
            <SummaryCard title="Scope 3" value={scope3Value} />
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Report</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Reporting Year
              </label>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                  CY
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  FY
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                From
              </label>
              <select
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Apr - 2025</option>
                <option>May - 2025</option>
                <option>Jun - 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                To
              </label>
              <select
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Mar - 2026</option>
                <option>Feb - 2026</option>
                <option>Jan - 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Sites
              </label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>All Sites</option>
                <option>Growlity Inc</option>
                <option>Growlity Hong Kong</option>
                <option>Growlity Pvt. Ltd.</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Export Type
              </label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Select Export Type</option>
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scope 1 Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope 1</h2>
          
          <DataTable
            title="Stationary Combustion"
            totalEmissions={calcTotal(scope1StationaryData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope1StationaryData}
          />

          <DataTable
            title="Mobile Combustion"
            totalEmissions={calcTotal(scope1MobileData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope1MobileData}
          />

          <DataTable
            title="Fugitive Emissions"
            totalEmissions={calcTotal(scope1FugitiveData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope1FugitiveData}
          />
        </div>

        {/* Scope 2 Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope 2</h2>
          
          <DataTable
            title="Purchased Electricity"
            totalEmissions={calcTotal(scope2ElectricityData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope2ElectricityData}
          />

          <DataTable
            title="Purchased Heat and Steam"
            totalEmissions={calcTotal(scope2HeatSteamData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "heatSource", label: "Heat Source" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope2HeatSteamData}
          />

          <DataTable
            title="Renewable Electricity Generation - Avoided Emission"
            totalEmissions={calcTotal(scope2RenewableData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Name of Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "generation", label: "Generation" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope2RenewableData}
          />
        </div>

        {/* Scope 3 Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope 3</h2>
          
          <DataTable
            title="Employee Commute"
            totalEmissions={calcTotal(scope3CommuteData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "commuteType", label: "Commute Type" },
              { key: "fuelType", label: "Fuel Type" },
              { key: "vehicleType", label: "Vehicle Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
            ]}
            data={scope3CommuteData}
          />

          <DataTable
            title="Food Consumption"
            totalEmissions={calcTotal(scope3FoodData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "foodType", label: "Food Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3FoodData}
          />

          <DataTable
            title="Purchased Goods"
            totalEmissions={calcTotal(scope3GoodsData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "typeOfGoods", label: "Type of Goods" },
              { key: "loop", label: "Loop" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3GoodsData}
          />

          <DataTable
            title="Transmission & Distribution Loss"
            totalEmissions={calcTotal(scope3TransmissionData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Name of Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TransmissionData}
          />

          <DataTable
            title="Upstream Activities"
            totalEmissions={calcTotal(scope3UpstreamData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3UpstreamData}
          />

          <DataTable
            title="Downstream Activities"
            totalEmissions={calcTotal(scope3DownstreamData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3DownstreamData}
          />

          <DataTable
            title="Waste Disposal"
            totalEmissions={calcTotal(scope3WasteData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3WasteData}
          />

          <DataTable
            title="Water Supply"
            totalEmissions={calcTotal(scope3WaterSupplyData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3WaterSupplyData}
          />

          <DataTable
            title="Water Treatment"
            totalEmissions={calcTotal(scope3WaterTreatmentData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3WaterTreatmentData}
          />

          <DataTable
            title="Business Travel (Air)"
            totalEmissions={calcTotal(scope3TravelAirData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TravelAirData}
          />

          <DataTable
            title="Business Travel (Sea)"
            totalEmissions={calcTotal(scope3TravelSeaData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TravelSeaData}
          />

          <DataTable
            title="Business Travel (Land)"
            totalEmissions={calcTotal(scope3TravelLandData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TravelLandData}
          />

          <DataTable
            title="Hotel Stay"
            totalEmissions={calcTotal(scope3HotelData)}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Room Nights" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3HotelData}
          />
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
            pageType="ghg-report"
            selectedYear={selectedYear}
            title="AI Companion"
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
          pageType="ghg-report"
          onDock={() => setIsDetached(false)}
        />
      )}
    </div>
  );
}
