import React from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wallet, 
  Receipt, 
  PackageCheck
} from "lucide-react";

interface BarangItem {
  status: string;
}

interface MiniMetricsProps {
  role: "TUKANG" | "ADMIN" | "OWNER" | "SUPERVISOR";
  data: BarangItem[];
  totalCost?: number;
  totalDebt?: number;
}

export const MiniMetrics: React.FC<MiniMetricsProps> = ({ 
  role, 
  data, 
  totalCost = 0, 
  totalDebt = 0 
}) => {
  const totalCount = data.length;
  const pendingCount = data.filter((i) => i.status === "MENUNGGU_PO").length;
  const dibeliCount = data.filter((i) => i.status === "DIBELI").length;
  const lapanganCount = data.filter((i) => i.status === "DITERIMA_LAPANGAN").length;
  const selesaiCount = data.filter((i) => i.status === "SELESAI").length;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isOwner = role === "OWNER";

  return (
    <div className="w-full bg-[var(--color-component-bg)] border border-[var(--color-border-subtle)]/60 rounded-xl p-4 shadow-sm select-none">
      
      {/* ⚡ PERBAIKAN GRID & DIVIDER RESPONSIF:
        - Mobile (grid-cols-2): Menggunakan flex-wrap atau grid dengan gap bersih, 
          ditambah flex-col / flex-row dinamis agar grid ganjil (5 item) tidak pincang.
        - Desktop (md:grid-cols-5): Otomatis membagi rata dengan garis pembatas vertikal (divide-x).
      */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 md:grid-cols-5 md:gap-y-0 md:divide-x md:divide-[var(--color-border-subtle)]/40">
        
        {isOwner ? (
          <>
            {/* 1. Total Tagihan */}
            <div className="flex items-center gap-2.5 h-full pr-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <Receipt size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">Total Tagihan</span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{formatRupiah(totalCost)}</span>
              </div>
            </div>

            {/* 2. Sisa Utang */}
            <div className="flex items-center gap-2.5 h-full pr-2 md:pl-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <Wallet size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">Sisa Utang</span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{formatRupiah(totalDebt)}</span>
              </div>
            </div>

            {/* 3. Menunggu Review */}
            <div className="flex items-center gap-2.5 h-full pr-2 md:pl-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <Clock size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">Menunggu Review</span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{pendingCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">item</span></span>
              </div>
            </div>

            {/* 4. Total Transaksi */}
            <div className="flex items-center gap-2.5 h-full pr-2 md:pl-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <FileText size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">Total Transaksi</span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{totalCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">manifes</span></span>
              </div>
            </div>

            {/* 5. Selesai */}
            <div className="flex items-center gap-2.5 h-full col-span-2 sm:col-span-1 pr-2 md:pl-4 border-t border-[var(--color-border-subtle)]/30 pt-3 md:border-t-0 md:pt-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <PackageCheck size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">Selesai</span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{selesaiCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">barang</span></span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 1. Pending / Perlu Verifikasi */}
            <div className="flex items-center gap-2.5 h-full pr-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <AlertCircle size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">
                  {role === "ADMIN" ? "Perlu Verifikasi" : "Pending PO"}
                </span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{pendingCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">item</span></span>
              </div>
            </div>

            {/* 2. Status Dibeli */}
            <div className="flex items-center gap-2.5 h-full pr-2 md:pl-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <Clock size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">Status Dibeli</span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{dibeliCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">item</span></span>
              </div>
            </div>

            {/* 3. Di Lapangan */}
            <div className="flex items-center gap-2.5 h-full pr-2 md:pl-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <CheckCircle2 size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">Di Lapangan</span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{lapanganCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">item</span></span>
              </div>
            </div>

            {/* 4. Total Manifes / PO */}
            <div className="flex items-center gap-2.5 h-full pr-2 md:pl-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <FileText size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">
                  {role === "ADMIN" ? "Total Manifes" : "Total Item"}
                </span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{totalCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">{role === "ADMIN" ? "barang" : "item"}</span></span>
              </div>
            </div>

            {/* 5. Selesai */}
            <div className="flex items-center gap-2.5 h-full col-span-2 sm:col-span-1 pr-2 md:pl-4 border-t border-[var(--color-border-subtle)]/30 pt-3 md:border-t-0 md:pt-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-page-bg)] border border-[var(--color-border-subtle)]/40 text-[var(--color-text-muted)] shrink-0">
                <PackageCheck size={15} strokeWidth={2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider truncate">
                  {role === "ADMIN" ? "Selesai" : "Selesai"}
                </span>
                <span className="font-mono font-semibold text-xs text-[var(--color-text-main)] truncate">{selesaiCount} <span className="text-[10px] font-sans font-normal text-[var(--color-text-disabled)]">{role === "ADMIN" ? "barang" : "item"}</span></span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};