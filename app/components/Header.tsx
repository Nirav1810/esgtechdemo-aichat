"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Settings, Leaf } from "lucide-react";

interface HeaderProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  baselineYear: string;
  setBaselineYear: (year: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  yearOptions: string[];
  activePage?: "dashboard" | "ghg-reports";
  onAskAIClick?: () => void;
}

export default function Header({
  selectedYear,
  setSelectedYear,
  baselineYear,
  setBaselineYear,
  sidebarOpen,
  setSidebarOpen,
  yearOptions,
  activePage = "dashboard",
  onAskAIClick,
}: HeaderProps) {
  const handleAskAIClick = () => {
    if (onAskAIClick) {
      onAskAIClick();
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };
  const getNavClass = (page: string) => {
    const isActive = activePage === page;
    return `text-sm font-medium pb-4 -mb-4 transition-colors ${
      isActive
        ? "text-emerald-600 border-b-2 border-emerald-600"
        : "text-gray-600 hover:text-gray-900"
    }`;
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                ESGtech<span className="text-emerald-600">.ai</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={getNavClass("dashboard")}
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-4 -mb-4"
              >
                Sites
              </Link>
              <Link
                href="/ghg-report"
                className={getNavClass("ghg-reports")}
              >
                GHG Reports
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-4 -mb-4"
              >
                Help
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="flex flex-wrap gap-4 items-end bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex flex-col min-w-[150px]">
                <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                  Current Year
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="mt-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col min-w-[180px]">
                <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                  Baseline Year (Optional)
                </span>
                <select
                  value={baselineYear}
                  onChange={(e) => setBaselineYear(e.target.value)}
                  className="mt-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">None</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Button */}
            <button
              onClick={handleAskAIClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                sidebarOpen
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>✨ Ask AI</span>
            </button>

            <div className="h-6 w-px bg-gray-200"></div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">
                Nirav Surti
              </span>
              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200">
                <span className="text-sm font-semibold text-emerald-700">
                  NS
                </span>
              </div>
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
