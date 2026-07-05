import React from "react";

interface PageHeaderProps {
  role: "TUKANG" | "ADMIN" | "OWNER" | "SUPERVISOR";
  onAddClick?: () => void;
  children?: React.ReactNode; // Tempat InputSupplierModal jika ada
}

export const PageHeader: React.FC<PageHeaderProps> = ({ role, onAddClick, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border-subtle">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-black tracking-tight text-main sm:text-2xl">
          {role === "TUKANG" && "Panel PO Lapangan"}
          {role === "ADMIN" && "Verifikasi & Manifest"}
          {role === "OWNER" && "Eksekutif Ledger & Owner"}
        </h1>

        {/* Kondisional Badge Status */}
        {/* {role === "TUKANG" && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-success/10 border border-brand-success/20 text-[10px] font-bold text-brand-success select-none/80">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></span>
            Live
          </div>
        )}
        {role === "SUPERVISOR" && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-admin/10 border border-brand-admin/20 text-[10px] font-bold text-brand-admin select-none/80">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-admin animate-pulse"></span>
            Audit Active
          </div>
        )}
        {role === "ADMIN" && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-admin/10 border border-brand-admin/20 text-[10px] font-bold text-brand-admin select-none/80">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-admin animate-pulse"></span>
            Audit Active
          </div>
        )}
        {role === "OWNER" && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-success/10 border border-brand-success/20 text-[10px] font-bold text-brand-success select-none/80">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></span>
            Ledger Sync
          </div>
        )} */}
      </div>

      {/* Hanya TUKANG yang memiliki tombol aksi tambah data */}
      {role === "TUKANG" && (
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={onAddClick}
            className="px-3 py-1.5 bg-main text-card hover:opacity-90 active:scale-98 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            ➕ Buat PO Baru
          </button>
          {children}
        </div>
      )}

      {role === "OWNER" && (
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={onAddClick}
            className="px-3 py-1.5 bg-main text-card hover:opacity-90 active:scale-98 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            ➕ Anggota
          </button>
          {children}
        </div>
      )}

    </div>
  );
};