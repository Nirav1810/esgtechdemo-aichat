"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Save, Plus, Trash2, Edit2, X, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface SummaryData {
  fiscal_year: string;
  total_emissions: number;
  scope_1: { value: number; status: string };
  scope_2: { value: number; status: string };
  scope_3: { value: number; status: string };
  breakdown: {
    scope_1_percentage: number;
    scope_2_percentage: number;
    scope_3_percentage: number;
  };
  top_emitters: string[];
}

interface MonthlyData {
  _id?: string;
  month: string;
  stationary?: number;
  mobile?: number;
  fugitive?: number;
  renewable?: number;
  imported?: number;
  electricity?: number;
}

interface CategoryData {
  _id?: string;
  category: string;
  value: number;
  color: string;
}

interface RecordData {
  _id: string;
  date: string;
  entryPeriod: string;
  siteName: string;
  scope: number;
  category: string;
  subcategory?: string;
  unitOfMeasure: string;
  consumption: number;
  source?: string;
  emissionFactor?: number;
  nameOfCountry?: string;
}

type TabType = "summary" | "monthly" | "records" | "categories";

export default function EditDataPage() {
  const [fiscalYears, setFiscalYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("FY 2025-26");
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [monthlyScope1, setMonthlyScope1] = useState<MonthlyData[]>([]);
  const [monthlyScope2, setMonthlyScope2] = useState<MonthlyData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [records, setRecords] = useState<RecordData[]>([]);

  // Filters
  const [recordFilter, setRecordFilter] = useState<{ scope: string; category: string }>({ scope: "", category: "" });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Partial<RecordData> | null>(null);

  // Fetch fiscal years on mount
  useEffect(() => {
    fetchFiscalYears();
  }, []);

  // Fetch data when year changes
  useEffect(() => {
    if (selectedYear) {
      fetchAllData();
    }
  }, [selectedYear]);

  const fetchFiscalYears = async () => {
    try {
      const res = await fetch("/api/emissions");
      const data = await res.json();
      if (data.fiscalYears && data.fiscalYears.length > 0) {
        setFiscalYears(data.fiscalYears);
        setSelectedYear(data.fiscalYears[0]);
      } else {
        setFiscalYears(["FY 2025-26"]);
      }
    } catch (error) {
      console.error("Error fetching fiscal years:", error);
      setFiscalYears(["FY 2025-26"]);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emissions/${selectedYear}`);
      const data = await res.json();
      if (!data.error) {
        setSummary(data.summary);
        setMonthlyScope1(data.monthlyScope1 || []);
        setMonthlyScope2(data.monthlyScope2 || []);
        setCategories(data.categories || []);
        setRecords(data.records || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Save handlers
  const saveSummary = async () => {
    if (!summary) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/emissions/${selectedYear}/summary`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary)
      });
      if (res.ok) {
        showMessage("success", "Summary saved successfully");
      } else {
        showMessage("error", "Failed to save summary");
      }
    } catch (error) {
      showMessage("error", "Error saving summary");
    }
    setSaving(false);
  };

  const saveMonthly = async (scope: number, data: MonthlyData[]) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/emissions/${selectedYear}/monthly`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, data })
      });
      if (res.ok) {
        showMessage("success", "Monthly data saved successfully");
      } else {
        showMessage("error", "Failed to save monthly data");
      }
    } catch (error) {
      showMessage("error", "Error saving monthly data");
    }
    setSaving(false);
  };

  const saveCategories = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/emissions/${selectedYear}/categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: categories })
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        showMessage("success", "Categories saved successfully");
      } else {
        showMessage("error", "Failed to save categories");
      }
    } catch (error) {
      showMessage("error", "Error saving categories");
    }
    setSaving(false);
  };

  const saveRecord = async () => {
    if (!editingRecord) return;
    setSaving(true);
    try {
      let res;
      if (editingRecord._id) {
        res = await fetch(`/api/emissions/${selectedYear}/records`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRecord)
        });
      } else {
        res = await fetch(`/api/emissions/${selectedYear}/records`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRecord)
        });
      }
      if (res.ok) {
        showMessage("success", "Record saved successfully");
        fetchAllData();
        setShowModal(false);
        setEditingRecord(null);
      } else {
        showMessage("error", "Failed to save record");
      }
    } catch (error) {
      showMessage("error", "Error saving record");
    }
    setSaving(false);
  };

  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/emissions/${selectedYear}/records?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showMessage("success", "Record deleted successfully");
        fetchAllData();
      } else {
        showMessage("error", "Failed to delete record");
      }
    } catch (error) {
      showMessage("error", "Error deleting record");
    }
  };

  const filteredRecords = records.filter(r => {
    if (recordFilter.scope && r.scope !== parseInt(recordFilter.scope)) return false;
    if (recordFilter.category && r.category !== recordFilter.category) return false;
    return true;
  });

  const scope3Categories = Array.from(new Set(records.filter(r => r.scope === 3).map(r => r.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        baselineYear=""
        setBaselineYear={() => {}}
        sidebarOpen={false}
        setSidebarOpen={() => {}}
        yearOptions={fiscalYears as any}
        activePage="edit-data"
        showBaseline={false}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border border-b-0 border-gray-200">
          <div className="flex">
            {(["summary", "monthly", "records", "categories"] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize ${activeTab === tab ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Tab */}
        {activeTab === "summary" && summary && (
          <div className="bg-white rounded-b-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Emissions Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Emissions (TCO2Eq)</label>
                <input
                  type="number"
                  value={summary.total_emissions}
                  onChange={e => setSummary({ ...summary, total_emissions: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope 1 - Direct Emissions (TCO2Eq)</label>
                <input
                  type="number"
                  value={summary.scope_1.value}
                  onChange={e => setSummary({ ...summary, scope_1: { ...summary.scope_1, value: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope 2 - Indirect Emissions (TCO2Eq)</label>
                <input
                  type="number"
                  value={summary.scope_2.value}
                  onChange={e => setSummary({ ...summary, scope_2: { ...summary.scope_2, value: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope 3 - Other Indirect (TCO2Eq)</label>
                <input
                  type="number"
                  value={summary.scope_3.value}
                  onChange={e => setSummary({ ...summary, scope_3: { ...summary.scope_3, value: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope 1 %</label>
                <input
                  type="number"
                  step="0.01"
                  value={summary.breakdown.scope_1_percentage}
                  onChange={e => setSummary({ ...summary, breakdown: { ...summary.breakdown, scope_1_percentage: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope 2 %</label>
                <input
                  type="number"
                  step="0.01"
                  value={summary.breakdown.scope_2_percentage}
                  onChange={e => setSummary({ ...summary, breakdown: { ...summary.breakdown, scope_2_percentage: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope 3 %</label>
                <input
                  type="number"
                  step="0.01"
                  value={summary.breakdown.scope_3_percentage}
                  onChange={e => setSummary({ ...summary, breakdown: { ...summary.breakdown, scope_3_percentage: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={saveSummary}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Monthly Tab */}
        {activeTab === "monthly" && (
          <div className="bg-white rounded-b-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Monthly Emissions Data</h2>
            
            <div className="mb-8">
              <h3 className="text-md font-medium mb-4 text-emerald-700">Scope 1 - Monthly Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Month</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Stationary</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Mobile</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Fugitive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyScope1.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-sm">{item.month}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.stationary || 0}
                            onChange={e => {
                              const updated = [...monthlyScope1];
                              updated[idx] = { ...updated[idx], stationary: parseFloat(e.target.value) || 0 };
                              setMonthlyScope1(updated);
                            }}
                            className="w-32 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.mobile || 0}
                            onChange={e => {
                              const updated = [...monthlyScope1];
                              updated[idx] = { ...updated[idx], mobile: parseFloat(e.target.value) || 0 };
                              setMonthlyScope1(updated);
                            }}
                            className="w-32 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.fugitive || 0}
                            onChange={e => {
                              const updated = [...monthlyScope1];
                              updated[idx] = { ...updated[idx], fugitive: parseFloat(e.target.value) || 0 };
                              setMonthlyScope1(updated);
                            }}
                            className="w-32 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => saveMonthly(1, monthlyScope1)}
                disabled={saving}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Scope 1
              </button>
            </div>

            <div>
              <h3 className="text-md font-medium mb-4 text-pink-700">Scope 2 - Monthly Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Month</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Renewable</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Imported</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Electricity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyScope2.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-sm">{item.month}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.renewable || 0}
                            onChange={e => {
                              const updated = [...monthlyScope2];
                              updated[idx] = { ...updated[idx], renewable: parseFloat(e.target.value) || 0 };
                              setMonthlyScope2(updated);
                            }}
                            className="w-32 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.imported || 0}
                            onChange={e => {
                              const updated = [...monthlyScope2];
                              updated[idx] = { ...updated[idx], imported: parseFloat(e.target.value) || 0 };
                              setMonthlyScope2(updated);
                            }}
                            className="w-32 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.electricity || 0}
                            onChange={e => {
                              const updated = [...monthlyScope2];
                              updated[idx] = { ...updated[idx], electricity: parseFloat(e.target.value) || 0 };
                              setMonthlyScope2(updated);
                            }}
                            className="w-32 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => saveMonthly(2, monthlyScope2)}
                disabled={saving}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Scope 2
              </button>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === "records" && (
          <div className="bg-white rounded-b-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Detailed Records</h2>
              <button
                onClick={() => {
                  setEditingRecord({ date: "", entryPeriod: "", siteName: "", scope: 1, category: "Stationary Combustion", unitOfMeasure: "", consumption: 0 });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <select
                value={recordFilter.scope}
                onChange={e => setRecordFilter({ ...recordFilter, scope: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Scopes</option>
                <option value="1">Scope 1</option>
                <option value="2">Scope 2</option>
                <option value="3">Scope 3</option>
              </select>
              <select
                value={recordFilter.category}
                onChange={e => setRecordFilter({ ...recordFilter, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {Array.from(new Set(records.map(r => r.category))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Site</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Scope</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Category</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Consumption</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Unit</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 100).map((record) => (
                    <tr key={record._id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs">{record.date}</td>
                      <td className="px-3 py-2 text-xs">{record.siteName}</td>
                      <td className="px-3 py-2 text-xs">Scope {record.scope}</td>
                      <td className="px-3 py-2 text-xs">{record.category}</td>
                      <td className="px-3 py-2 text-xs">{record.subcategory || record.nameOfCountry || "-"}</td>
                      <td className="px-3 py-2 text-xs">{record.consumption?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-xs">{record.unitOfMeasure}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingRecord(record);
                              setShowModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRecord(record._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRecords.length > 100 && (
              <p className="text-sm text-gray-500 mt-2">Showing first 100 of {filteredRecords.length} records</p>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="bg-white rounded-b-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Scope 3 Categories Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Value (TCO2Eq)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Color</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-sm">{cat.category}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={cat.value}
                          onChange={e => {
                            const updated = [...categories];
                            updated[idx] = { ...updated[idx], value: parseFloat(e.target.value) || 0 };
                            setCategories(updated);
                          }}
                          className="w-40 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="color"
                          value={cat.color}
                          onChange={e => {
                            const updated = [...categories];
                            updated[idx] = { ...updated[idx], color: e.target.value };
                            setCategories(updated);
                          }}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={saveCategories}
              disabled={saving}
              className="mt-6 flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </main>

      {/* Modal for Record Edit/Add */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingRecord?._id ? "Edit Record" : "Add New Record"}
              </h3>
              <button onClick={() => { setShowModal(false); setEditingRecord(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={editingRecord?.date || ""}
                  onChange={e => setEditingRecord({ ...editingRecord, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="23 - April - 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Period</label>
                <input
                  type="text"
                  value={editingRecord?.entryPeriod || ""}
                  onChange={e => setEditingRecord({ ...editingRecord, entryPeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="April - 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={editingRecord?.siteName || ""}
                  onChange={e => setEditingRecord({ ...editingRecord, siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
                  <select
                    value={editingRecord?.scope || 1}
                    onChange={e => setEditingRecord({ ...editingRecord, scope: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={1}>Scope 1</option>
                    <option value={2}>Scope 2</option>
                    <option value={3}>Scope 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingRecord?.category || ""}
                    onChange={e => setEditingRecord({ ...editingRecord, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                <input
                  type="text"
                  value={editingRecord?.unitOfMeasure || ""}
                  onChange={e => setEditingRecord({ ...editingRecord, unitOfMeasure: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consumption</label>
                  <input
                    type="number"
                    value={editingRecord?.consumption || 0}
                    onChange={e => setEditingRecord({ ...editingRecord, consumption: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emission Factor</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editingRecord?.emissionFactor || 0}
                    onChange={e => setEditingRecord({ ...editingRecord, emissionFactor: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setEditingRecord(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveRecord}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
