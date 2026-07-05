"use client";

import React from "react";

interface InputDateToggleProps {
  isManual: boolean;
  onToggle: (val: boolean) => void;
  dateValue: string;
  onDateChange: (val: string) => void;
  disabled?: boolean;
}

export default function InputDateToggle({
  isManual,
  onToggle,
  dateValue,
  onDateChange,
  disabled = false,
}: InputDateToggleProps) {
  return (
    <div className="bg-ui-hover/40 p-4 rounded-xl border border-border-subtle transition-all duration-200">
      
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
          Pencatatan Stempel Waktu (Timestamp)
        </span>
        
        {!disabled && (
          <label className="relative inline-flex items-center cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={isManual}
              onChange={(e) => {
                onToggle(e.target.checked);
                if (e.target.checked && !dateValue) {
                  const now = new Date();
                  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                  onDateChange(now.toISOString().slice(0, 16));
                }
              }}
              className="sr-only peer"
            />
            
            {/* MICRO-SWITCH SLIDER (Menggunakan token murni) */}
            <div className="w-8 h-4.5 bg-border-strong rounded-full peer peer-checked:after:translate-x-3.5 after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-card after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-main border border-transparent transition-all duration-200" />
            
            <span className="ml-2 text-[11px] text-muted group-hover:text-main font-bold tracking-wide transition-colors">
              Atur Manual
            </span>
          </label>
        )}
      </div>

      {/* DYNAMIC CONTENT EXPANSION */}
      <div className="relative">
        {isManual ? (
          <div className="relative animate-fade-in">
            <input
              type="datetime-local"
              required
              disabled={disabled}
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-strong bg-card text-main outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 transition-all font-bold"
            />
          </div>
        ) : (
          /* NOTIFIKASI REAL-TIME: Memakai token warna fungsional brand-success */
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-success/10 border border-brand-success/20 w-full">
            <span className="text-xs select-none">⚡</span>
            <p className="text-[11px] font-bold text-brand-success tracking-wide">
              Automated Live-Stamp: <span className="font-medium text-muted">Mengikuti waktu aktual server saat entri disimpan.</span>
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
}