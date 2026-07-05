/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Calendar, Layers, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Maximize2, Minimize2 } from "lucide-react";


export interface FilterState {
  periodMonth: string;
  status: string;
  searchQuery: string;
  searchSupp: string;
}

interface MasterReconciliationFilterProps {
  role: "TUKANG" | "ADMIN" | "OWNER" |"SUPERVISOR";
  filters: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>> | ((newFilters: FilterState) => void);
  showChart: boolean;
  fullScreen: boolean;
  setShowChart: (show: boolean) => void;
  setIsFullscreen: (show: boolean) => void;
}

export default function MasterReconciliationFilter({
  role,
  filters,
  onFilterChange,
  showChart,
  fullScreen,
  setShowChart,
  setIsFullscreen,
}: MasterReconciliationFilterProps) {
  
  // const [isFullscreen, setIsFullscreen] = useState(false);
  

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    if (typeof onFilterChange === "function") {
      (onFilterChange as any)((prev: FilterState) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleReset = () => {
    if (typeof onFilterChange === "function") {
      (onFilterChange as any)({
        periodMonth: "",
        status: "",
        searchQuery: "",
        searchSupp: "",
      });
    }
  };

  const hasActiveFilters = !!(filters.searchQuery ||  filters.searchSupp ||filters.periodMonth || filters.status);

  return (
    <div className="bg-[var(--color-component-bg)] border select-none  border-[var(--color-border-subtle)] p-4 rounded-xl mb-6 transition-all">
      
      {/* HEADER UTILITY BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-[var(--color-text-main)] uppercase">
            Filters
          </span>
          {hasActiveFilters && (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-role-auth)] animate-pulse" />
          )}
        </div>
        
        {/* ACTION CONTROLS */}
        <div className="flex items-center gap-2 self-stretch justify-end sm:self-auto">
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            type="button"
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              hasActiveFilters
                ? "text-[var(--color-text-muted)] hover:bg-[var(--color-component-hover)] cursor-pointer"
                : "text-[var(--color-text-disabled)] opacity-40 cursor-not-allowed"
            }`}
          >
            <RotateCcw size={13} />
            Reset
          </button>

          <button
            type="button"
            onClick={() => setShowChart(!showChart)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              showChart 
                ? "bg-[var(--color-component-hover)] text-[var(--color-text-main)] border-[var(--color-border-strong)]" 
                : "bg-[var(--color-component-bg)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)] hover:text-[var(--color-text-main)] hover:border-[var(--color-border-strong)]"
            }`}
          >
            {showChart ? <EyeOff size={13} /> : <Eye size={13} />}
            {showChart ? "Hide Calendar" : "Show Calendar"}

          </button>
          
          <button
            onClick={ () =>  setIsFullscreen(!fullScreen)}
            className="p-2 rounded-md border border-border-subtle hover:bg-card"
          >
            {fullScreen ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </button>

        </div>
      </div>

      {/* INPUT CONTROLS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        
        {/* 1. SEARCH INPUT */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-[var(--color-text-muted)]">
            Material Name
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[var(--color-text-disabled)]">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search items..."
              value={filters.searchQuery || ""}
              onChange={(e) => handleSelectChange("searchQuery", e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-component-bg)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-disabled)] outline-none focus:border-[var(--color-border-strong)] focus:ring-1 focus:ring-[var(--color-border-strong)] transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-[var(--color-text-muted)]">
            Supplier Name
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[var(--color-text-disabled)]">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search Supplier..."
              value={filters.searchSupp || ""}
              onChange={(e) => handleSelectChange("searchSupp", e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-component-bg)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-disabled)] outline-none focus:border-[var(--color-border-strong)] focus:ring-1 focus:ring-[var(--color-border-strong)] transition-all font-medium"
            />
          </div>
        </div>

        {/* 2. PERIOD INPUT */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-[var(--color-text-muted)]">
            Purchase Period
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[var(--color-text-disabled)] pointer-events-none">
              <Calendar size={14} />
            </span>
            <input
              type="month"
              value={filters.periodMonth || ""}
              onChange={(e) => handleSelectChange("periodMonth", e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-component-bg)] text-[var(--color-text-main)] outline-none focus:border-[var(--color-border-strong)] focus:ring-1 focus:ring-[var(--color-border-strong)] transition-all font-medium font-mono"
            />
          </div>
        </div>

        {/* 3. LOGISTICS STATUS SELECT */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-[var(--color-text-muted)]">
            Logistics Status
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[var(--color-text-disabled)] pointer-events-none">
              <Layers size={14} />
            </span>
            <select
              value={filters.status || ""}
              onChange={(e) => handleSelectChange("status", e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-component-bg)] text-[var(--color-text-main)] outline-none focus:border-[var(--color-border-strong)] focus:ring-1 focus:ring-[var(--color-border-strong)] transition-all font-medium cursor-pointer appearance-none"
            >
              <option value="" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">ALL STATUS</option>
              <option value="MENUNGGU_PO" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">PENDING PO</option>
              <option value="DIBELI" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">DIBELI</option>
              <option value="DALAM_PENGIRIMAN" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">DALAM PENGIRIMAN</option>
              <option value="DITERIMA_LAPANGAN" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">BARANG DITERIMA</option>
              <option value="SUDAH_DIBAYAR" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">SUDAH DIBAYAR</option>
              <option value="DIBATALKAN" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">DIBATALKAN</option>
              <option value="PENDING_VERIFIKASI" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">PENDING PENGECEKAN</option>
              <option value="PENGECEKAN_BARANG" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">PENGECEKAN BARANG</option>
              {role === "OWNER" && (
                <option value="PAID" className="bg-[var(--color-component-bg)] font-semibold text-[var(--color-role-success)]">
                  PAID (Final)
                </option>
              )}
              <option value="SELESAI" className="bg-[var(--color-component-bg)] text-[var(--color-text-main)]">SELESAI</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}