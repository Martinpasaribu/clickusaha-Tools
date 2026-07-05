/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus, Trash2 } from "lucide-react";

interface ReceivedLog {
  date: string; // Menggunakan string format YYYY-MM-DD agar sinkron dengan input type="date"
  qty: number;
}

interface InputReceivedLogsProps {
  label?: string;
  logs: ReceivedLog[];
  onChange: (updatedLogs: ReceivedLog[]) => void;
  disabled?: boolean;
}

export default function InputReceivedDate({
  label = "Riwayat Logistik Masuk (Received Logs)",
  logs = [],
  onChange,
  disabled = false,
}: InputReceivedLogsProps) {
  
  // 1. Tambah baris log baru (default: tanggal hari ini, qty 0)
  const handleAddLog = () => {
    const today = new Date().toISOString().split("T")[0];
    const newLogs = [...logs, { date: today, qty: 0 }];
    onChange(newLogs);
  };

  // 2. Hapus baris log tertentu berdasarkan index
  const handleRemoveLog = (indexToRemove: number) => {
    const newLogs = logs.filter((_, index) => index !== indexToRemove);
    onChange(newLogs);
  };

  // 3. Update field internal (baik tanggal maupun qty)
  const handleUpdateLog = (indexToUpdate: number, key: keyof ReceivedLog, value: any) => {
    const newLogs = logs.map((log, index) => {
      if (index === indexToUpdate) {
        return {
          ...log,
          [key]: key === "qty" ? Number(value) : value,
        };
      }
      return log;
    });
    onChange(newLogs);
  };

  return (
    <div className="space-y-3">
      {/* Label Mikro Kapital Dinamis Konsisten */}
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">
          {label}
        </label>
        
        {/* Tombol Tambah Log Kedatangan Baru */}
        {!disabled && (
          <button
            type="button"
            onClick={handleAddLog}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-brand-auth hover:opacity-80 transition-all cursor-pointer"
          >
            <Plus size={12} strokeWidth={3} />
            <span>Tambah Kedatangan</span>
          </button>
        )}
      </div>

      {/* Jika Belum Ada Data Log Kedatangan */}
      {logs.length === 0 ? (
        <div className="p-4 border border-dashed border-border-strong rounded-xl text-center text-[11px] text-disabled bg-card/10">
          Belum ada rekaman barang masuk. Klik `Tambah Kedatangan`` di atas.
        </div>
      ) : (
        // Container List Item Logs
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-3 animate-fadeIn">
              
              {/* INPUT TANGGAL MASUK */}
              <div className="flex-1">
                <input
                  type="date"
                  required
                  disabled={disabled}
                  value={log.date ? log.date.substring(0, 10) : ""}
                  onChange={(e) => handleUpdateLog(index, "date", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-bold"
                />
              </div>

              {/* INPUT JUMLAH BARANG MASUK (QTY) */}
              <div className="w-1/3">
                <input
                  type="number"
                  required
                  min="1"
                  disabled={disabled}
                  value={log.qty || ""}
                  placeholder="Qty"
                  onChange={(e) => handleUpdateLog(index, "qty", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-bold"
                />
              </div>

              {/* TOMBOL HAPUS BARIS LOG */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveLog(index)}
                  className="p-2.5 text-disabled hover:text-red-500 rounded-xl border border-transparent hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}