"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { MessageCircle, Settings, Leaf, LogOut, User } from "lucide-react";

interface HeaderProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  baselineYear: string;
  setBaselineYear: (year: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  yearOptions: string[];
  activePage?: "dashboard" | "ghg-reports" | "edit-data" | "reports";
  onAskAIClick?: () => void;
  showBaseline?: boolean;
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
  showBaseline = true,
}: HeaderProps) {
  const { data: session, status } = useSession();
  
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
                href="/reports"
                className={getNavClass("reports")}
              >
                BRSR Reports
              </Link>
              <Link
                href="/edit-data"
                className={getNavClass("edit-data")}
              >
                Edit Data
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
              {showBaseline && (
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
              )}
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
            {status === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {session.user.name || session.user.email}
                  </span>
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200">
                    <User className="w-4 h-4 text-emerald-700" />
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
