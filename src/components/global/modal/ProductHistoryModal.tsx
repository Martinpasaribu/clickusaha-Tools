/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TYPE_FLOW } from "@/constants";

interface ProductHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  logs: any[];
  isLoading: boolean;
}

export default function ProductHistoryModal({ isOpen, onClose, name, logs, isLoading }: ProductHistoryModalProps) {
  if (!isOpen) return null;

  // Helper Format Tanggal internal modal
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[80vh] transform transition-all animate-in fade-in zoom-in-98 duration-150">
        
        {/* HEADER MODAL (Sticky & Murni Token V4) */}
        <div className="p-4 border-b border-border-subtle bg-ui-hover/30 flex justify-between items-center select-none">
          <div>
            <h3 className="text-xs font-black tracking-wider text-main uppercase">
              Audit Log History
            </h3>
            <p className="text-[10px] text-muted font-medium mt-0.5 uppercase tracking-wide">
              Material: <span className="text-brand-auth font-black">{name}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Audit Log"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-main hover:bg-ui-hover border border-transparent hover:border-border-subtle text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* KONTEN TIMELINE LOG (Scrollable & Responsive) */}
        <div className="p-5 overflow-y-auto bg-card flex-1 custom-scrollbar">
          {isLoading ? (
            /* ⏳ SKELETON ANIMASI (Menggunakan Token Warna v4) */
            <div className="relative border-l border-border-subtle ml-2 pl-4 space-y-4 animate-pulse">
              {[1, 2, 3].map((index) => (
                <div key={index} className="relative">
                  <span className="absolute -left-[21px] mt-1 w-2 h-2 rounded-full ring-4 ring-card bg-border-strong" />
                  <div className="bg-ui-hover/40 p-3 rounded-xl border border-border-subtle/60 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-16 bg-border-strong rounded" />
                      <div className="h-2 w-24 bg-border-strong rounded" />
                    </div>
                    <div className="h-3 w-full bg-border-strong rounded" />
                    <div className="h-3 w-2/3 bg-border-strong rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted italic tracking-wide">
              Belum ada rekaman riwayat perubahan untuk barang ini.
            </div>
          ) : (
            /* 📜 DATA LOG TIMELINE ASLI */
            <div className="relative border-l border-border-subtle ml-2 pl-4 space-y-4">
              {logs.map((log) => (
                <div key={log._id} className="relative group">
                  
                  {/* Titik Alur Dinamis Menggunakan Token Brand Status / Role */}
                  <span className={`absolute -left-[21px] mt-1.5 w-2 h-2 rounded-full ring-4 ring-card transition-transform group-hover:scale-125 ${
                    log.type === "CPO" ? "bg-brand-auth" : 
                    log.type === "URQ" ? "bg-brand-tukang" : 
                    log.type === "UIQ" ? "bg-brand-admin" : "bg-disabled"
                  }`} />
                  
                  {/* Box Card Log */}
                  <div className="bg-ui-hover/30 p-3 rounded-xl border border-border-subtle hover:border-border-strong transition-all duration-150">
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span className="px-1.5 py-0.5 bg-card border border-border-subtle text-[9px] font-black rounded font-mono text-main tracking-wider">
                        {TYPE_FLOW.find((option) => option.value === log.type)?.label || log.type}
                      </span>
                      <span className="text-[10px] text-muted font-medium font-mono">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-main font-medium leading-relaxed">
                      {log.description}
                    </p>

                    {/* Volume Terpetakan (Memakai Token Sukses Semantik Anda) */}
                    {log.qty !== undefined && (
                      <div className="mt-2 pt-2 border-t border-dashed border-border-subtle text-[11px] font-bold text-brand-success flex items-center gap-1.5">
                        <span>📦 Volume Terpetakan:</span>
                        <span className="bg-brand-success/10 px-1.5 py-0.5 rounded font-mono font-black">{log.qty} Unit</span>
                      </div>
                    )}

                    {/* Identitas Pengubah Sesuai Role CSS */}
                    <div className={`text-[9px] mt-2 font-black text-right uppercase tracking-wider ${
                      log.userRole === "OWNER" ? "text-brand-owner" : 
                      log.userRole === "ADMIN" ? "text-brand-admin" : "text-brand-tukang"
                    }`}>
                      Oleh: {log.userRole}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER MODAL (Sticky) */}
        <div className="p-3 border-t border-border-subtle bg-ui-hover/30 flex justify-end select-none">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-main text-card hover:opacity-90 active:scale-95 text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}