/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductState } from "@/utills/function-hpp";
import { AlertCircle, BarChart3, Calendar, CheckCircle2, ChevronRight, Target, TrendingUp, Wallet } from "lucide-react";
import React from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ReferenceLine } from "recharts";
import { InfoTooltip } from "./InfoTooltip";
import { TOOLTIP_TEXT } from "@/constants/tooltips";

// Definisikan tipe data props agar aman dari error TypeScript
interface RightPanelMetricsProps {
product: ProductState;
  financialResult: {
    totalHppPerProduk: number;
    totalVariableCostPerPcs: number;
    saranHargaJual: number;
    hargaJualMinimum: number;
    marginKontribusiPerUnit: number;
    alokasiBiayaTetapPerPcs: number;
    hppSekarang: number;
    hppBaruDampak: number;
    targetUnitHari: number;
    targetUnitBulan: number;
    potensiOmzetBulan: number;
    totalBiayaProduksiBulan: number;
    totalBiayaTotalBulan: number;
    bepUnit: number;
    bepValue: number;
    totalBiayaTetapTeralokasi: number;
    dataSimulasiGraph: Array<{
      volume: number;
      Pendapatan: number;
      "Total Biaya": number;
      "Laba Bersih": number;
    }>;
    benchmarkPendapatan: any
    rekomendasiUnitUntukSamaDenganRataRata: any
    rekomendasi: any
    
  };
  projection: {
    hargaJualPilihan: number;
    targetLabaBersih: number;
  };
  persentaseSensitivitas: number;
  setPersentaseSensitivitas: React.Dispatch<React.SetStateAction<number>>;
  formatIDR: (val: number) => string;
}

export const RightPanelMetrics: React.FC<RightPanelMetricsProps> = ({
product,
  financialResult,
  projection,
  persentaseSensitivitas,
  setPersentaseSensitivitas,
  formatIDR,
}) => {

    const { benchmarkPendapatan, rekomendasi, targetUnitHari } = financialResult;

    const hasData = benchmarkPendapatan.bulanan > 0 && benchmarkPendapatan.qtyBulanan > 0;



  return (
    <section className="xl:col-span-7 space-y-6">
      
      {/* BAR METRIKS FINANSIAL UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-container flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center">
                Harga Pokok Penjualan (HPP) <InfoTooltip textKey="HPP_UTAMA" />
            </span>
            <h4 className="text-xl font-extrabold text-main mt-1">{formatIDR(financialResult.totalHppPerProduk)}</h4>
          </div>
          <div className="border-t border-border-subtle mt-3 pt-2 text-[10px] text-muted">
            Bahan: <span className="font-semibold text-main">{formatIDR(financialResult.totalVariableCostPerPcs)}</span>
          </div>
        </div>

        <div className="card-container flex flex-col justify-between border-l-4 border-l-brand-admin pl-3">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center">
                Saran Harga Jual (Markup 50%) <InfoTooltip textKey="SARAN_HARGA" />
            </span>
            <h4 className="text-xl font-extrabold text-brand-admin mt-1">{formatIDR(financialResult.saranHargaJual)}</h4>
          </div>
          <div className="border-t border-border-subtle mt-3 pt-2 text-[10px] text-muted">
            Safety Threshold: <span className="font-semibold text-main">{formatIDR(financialResult.hargaJualMinimum)}</span>
          </div>
        </div>

        <div className="card-container flex flex-col justify-between border-l-4 border-l-brand-success pl-3">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center">
                Margin Kontribusi /Unit <InfoTooltip textKey="MARGIN_KONTRIBUSI_UNIT" />
            </span>
            <h4 className="text-xl font-extrabold text-brand-success mt-1">{formatIDR(financialResult.marginKontribusiPerUnit)}</h4>
          </div>
          <div className="border-t border-border-subtle mt-3 pt-2 text-[10px] text-muted">
            Rasio Margin: <span className="font-semibold text-brand-success">
              {projection.hargaJualPilihan && projection.hargaJualPilihan > 0
                ? Math.round((financialResult.marginKontribusiPerUnit / projection.hargaJualPilihan) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>


      {/* HASIL RINCIAN HPP & SENSITIVITAS */}

        <div className="card-container space-y-4">
            <div className="border-b border-border-subtle pb-3 mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Rincian HPP &amp; Analisa Sensitivitas</h3>
            <span className="text-[11px] text-brand-error font-medium">Beban &amp; Fluktuasi Pasar</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <span className="text-muted flex items-center">
                    Biaya Variabel per Produk: <InfoTooltip textKey="HPP_VARIABEL" />
                </span>
                <span className="font-semibold">{formatIDR(financialResult.totalVariableCostPerPcs)}</span>
                </div>

                {/* BARIS BARU: Informasi Dasar Alokasi */}
                <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <span className="text-muted flex items-center">
                    Volume Target (Unit/Bln): <InfoTooltip textKey="VOLUME_TARGET" />
                </span>
                <span className="font-semibold text-brand-admin">
                    {Math.ceil(financialResult.targetUnitBulan || 0).toLocaleString()} Unit
                </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <div className="flex flex-col">
                    <span className="text-muted flex items-center">
                        Alokasi Biaya Tetap per Unit: <InfoTooltip textKey="ALOKASI_TETAP" />
                    </span>
                    {/* Teks kecil formula transparansi */}
                    <span className="text-[9px] text-slate-400 italic mt-0.5">
                    ( {formatIDR(financialResult.totalBiayaTetapTeralokasi)} / {Math.ceil(product.estimasiVolumeBulanan || 0)} unit )
                    </span>
                </div>
                <span className="font-semibold">{formatIDR(financialResult.alokasiBiayaTetapPerPcs)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 text-sm font-bold text-main">
                    <span className="flex items-center">
                        TOTAL HPP PER PRODUK: <InfoTooltip textKey="TOTAL_HPP" />
                    </span>
                <span>{formatIDR(financialResult.totalHppPerProduk)}</span>
                </div>
            </div>

            <div className="bg-background/40 p-4 border border-border-subtle rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-muted uppercase block flex items-center">
                    Kontrol Sensitivitas Fluktuasi Bahan Baku <InfoTooltip textKey="KONTROL_SENSITIVITAS" />
                </span>
                <div className="flex items-center gap-2">
                <button
                    onClick={() => setPersentaseSensitivitas((p) => Math.max(-50, p - 5))}
                    className="px-2 py-1  border border-border-strong rounded-lg text-xs font-bold hover:bg-ui-hover transition-colors cursor-pointer"
                >
                    -5%
                </button>
                <span className="font-mono  border border-border-strong px-3 py-1 rounded-lg text-xs font-bold text-brand-admin">
                    {persentaseSensitivitas >= 0 ? `+${persentaseSensitivitas}` : persentaseSensitivitas}% Impact
                </span>
                <button
                    onClick={() => setPersentaseSensitivitas((p) => Math.min(100, p + 5))}
                    className="px-2 py-1 border border-border-strong rounded-lg text-xs font-bold hover:bg-ui-hover transition-colors cursor-pointer"
                >
                    +5%
                </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                    <span className="text-[10px] text-muted block">HPP Saat Ini</span>
                    <span className="font-semibold">{formatIDR(financialResult.hppSekarang)}</span>
                </div>
                <div>
                    <span className="text-[10px] text-brand-error font-medium block">HPP Dampak Fluktuasi</span>
                    <span className="font-bold text-brand-error">{formatIDR(financialResult.hppBaruDampak)}</span>
                </div>
                </div>
            </div>
            </div>
        </div>

      {/* HASIL BrancMark Analisis */}
      { hasData ? (
          
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Analisa Performa vs Target</h3>
        </div>

        {/* 1. Ringkasan Finansial (4 Properti) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
            { label: "Omzet Target", val: formatIDR(financialResult.potensiOmzetBulan), icon: TrendingUp, color: "text-slate-900" ,key: "OMZET_TARGET"},
            { label: "Omzet Performa", val: formatIDR(benchmarkPendapatan.bulanan), icon: Target, color: "text-blue-600", key: "OMZET_PERFORMA" },
            { label: "Total Biaya", val: formatIDR(financialResult.totalBiayaTotalBulan), icon: Wallet, color: "text-red-600", key: "TOTAL_BIAYA_ANALISA" },
            { label: "Estimasi Laba", val: formatIDR(benchmarkPendapatan.bulanan - financialResult.totalBiayaTotalBulan), icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/50", key: "ESTIMASI_LABA" }
            ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-1.5 mb-1 opacity-70">
                <item.icon className={`w-3 h-3 ${item.color}`} />
                <div className="text-[7px] uppercase font-bold text-slate-500 flex items-center">
                    {item.label} <InfoTooltip textKey={item.key as keyof typeof TOOLTIP_TEXT} />
                </div>
                </div>
                <p className={`text-[11px] font-bold ${item.color}`}>{item.val}</p>
            </div>
            ))}
        </div>

        {/* 2. Status Omzet & Qty (2 Properti) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`flex items-center justify-between p-3 rounded-xl border ${financialResult.potensiOmzetBulan < benchmarkPendapatan.bulanan ? "bg-emerald-50/50 border-emerald-100" : "bg-amber-50/50 border-amber-100"}`}>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase text-slate-600">Omzet Performa</span>
                </div>
                <span className={`text-[10px] font-black ${financialResult.potensiOmzetBulan < benchmarkPendapatan.bulanan ? "text-emerald-700" : "text-amber-700"}`}>
                    {financialResult.potensiOmzetBulan < benchmarkPendapatan.bulanan ? "Melampaui" : " Kurang"}
                </span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-xl border ${(financialResult.potensiOmzetBulan / (projection.hargaJualPilihan || 1)) < benchmarkPendapatan.qtyBulanan ? "bg-emerald-50/50 border-emerald-100" : "bg-amber-50/50 border-amber-100"}`}>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase text-slate-600">Qty Performa</span>
                </div>
                <span className={`text-[10px] font-black ${(financialResult.potensiOmzetBulan / (projection.hargaJualPilihan || 1)) < benchmarkPendapatan.qtyBulanan ? "text-emerald-700" : "text-amber-700"}`}>
                    {(financialResult.potensiOmzetBulan / (projection.hargaJualPilihan || 1)) < benchmarkPendapatan.qtyBulanan ? "Melampaui" : " Kurang"}
                </span>
            </div>
        </div>

        {/* 3. Grid Target Mingguan & Bulanan (4 Properti: Nilai & Qty masing-masing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
            { label: "Target Mingguan", val: benchmarkPendapatan.mingguan, qty: benchmarkPendapatan.qtyMingguan },
            { label: "Target Bulanan", val: benchmarkPendapatan.bulanan, qty: benchmarkPendapatan.qtyBulanan }
            ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <Calendar className="w-3 h-3 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[7px] text-slate-400 uppercase font-bold">{item.label}</p>
                        <p className="font-bold text-[11px] text-slate-900">{formatIDR(item.val)}</p>
                    </div>
                </div>
                <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{Math.round(item.qty)} Qty</p>
            </div>
            ))}
        </div>

        {/* 4. Info Tambahan (Insight) */}
        <div className={`p-4 rounded-xl border ${rekomendasi.isTerlampaui ? "bg-emerald-50/50 border-emerald-100" : "bg-blue-50/50 border-blue-100"}`}>
            <div className="flex items-center gap-2 mb-2">
                <AlertCircle className={`w-3 h-3 ${rekomendasi.isTerlampaui ? "text-emerald-600" : "text-blue-600"}`} />
                <p className={`text-[8px] font-bold uppercase ${rekomendasi.isTerlampaui ? "text-emerald-800" : "text-blue-800"}`}>
                    {rekomendasi.isTerlampaui ? "Target Qty Terlampaui" : "Status Target Qty"}
                </p>
            </div>
            <p className="text-[10px] text-slate-700 leading-relaxed">
            {rekomendasi.isTerlampaui ? (
                <>Hebat! Penjualan Anda sudah <span className="font-black text-emerald-600">lebih {Math.abs(rekomendasi.selisih)} unit/hari</span> di atas target  <span className="font-bold">{Math.ceil(targetUnitHari)}</span>.</>
            ) : (
                <>Kurang <span className="font-black text-blue-600">{Math.abs(rekomendasi.selisih)} unit/hari</span> lagi untuk mencapai target  <span className="font-bold">{Math.ceil(targetUnitHari)}</span>.</>
            )}
            </p>
        </div>
        </div>
      ):(
        <></>
      )}

      {/* TARGET & PROYEKSI PENJUALAN BULANAN */}
      <div className="card-container">
        <div className="border-b border-border-subtle pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Target &amp; Proyeksi Manajemen</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 border border-border-subtle rounded-xl">
            <span className="text-[10px] text-muted flex items-center">Target/Hari <InfoTooltip textKey="TARGET_HARI"/></span>
            <span className="text-sm font-extrabold text-brand-admin mt-1 block">
              {Math.ceil(financialResult.targetUnitHari || 0)} Unit
            </span>
          </div>
          <div className="p-3 border border-border-subtle rounded-xl">
            <span className="text-[10px] text-muted flex items-center">Target/Bulan <InfoTooltip textKey="VOLUME_BULAN"/></span>
            <span className="text-sm font-extrabold text-brand-admin mt-1 block">
              {Math.ceil(financialResult.targetUnitBulan || 0)} Unit
            </span>
          </div>
          <div className="p-3 border border-border-subtle rounded-xl">
            <span className="text-[10px] text-muted flex items-center">Potensi Omzet <InfoTooltip textKey="POTENSI_OMZET"/></span>
            <span className="text-sm font-extrabold text-brand-success mt-1 block">
              {formatIDR(financialResult.potensiOmzetBulan)}
            </span>
          </div>
          <div className="p-3 border border-border-subtle rounded-xl">
            <span className="text-[10px] text-muted flex items-center">Biaya Prosedur <InfoTooltip textKey="BIAYA_PROSEDUR"/></span>
            <span className="text-sm font-extrabold text-brand-error mt-1 block">
              {formatIDR(financialResult.totalBiayaProduksiBulan)}
            </span>
          </div>
          <div className="p-3 border border-border-subtle rounded-xl col-span-2 md:col-span-1">
            <span className="text-[10px] text-muted flex items-center">Biaya Total <InfoTooltip textKey="BIAYA_TOTAL"/></span>
            <span className="text-sm font-extrabold text-main mt-1 block">
              {formatIDR(financialResult.totalBiayaTotalBulan)}
            </span>
          </div>
        </div>
      </div>

      {/* RINGKASAN STRATEGI BEP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-brand-tukang/10 border border-brand-tukang/20 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-brand-tukang uppercase flex items-center">
            Titik Impas (BEP) <InfoTooltip textKey="BEP"/>
            </span>
            <div className="mt-2">
                <h5 className="text-base font-extrabold text-main">{Math.ceil(financialResult.bepUnit || 0)} Unit</h5>
                <p className="text-[10px] text-muted mt-0.5">{formatIDR(financialResult.bepValue)}</p>
            </div>
        </div>

        {/* GANTI BAGIAN CARD TARGET LABA DI RINGKASAN STRATEGI BEP */}
        <div className="p-4 bg-brand-success/10 border border-brand-success/20 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-brand-success uppercase flex items-center">
                Target Laba Bersih <InfoTooltip textKey="TARGET_LABA"/>
            </span>
            <div className="mt-2">
                <h5 className="text-base font-extrabold text-main">{formatIDR(projection.targetLabaBersih)}</h5>
                <p className="text-[10px] text-muted mt-0.5">
                Perlu {Math.ceil(financialResult.targetUnitBulan || 0)} Unit/Bulan
                </p>
            </div>
        </div>

        <div className="p-4 bg-brand-admin/10 border border-brand-admin/20 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-brand-admin uppercase flex items-center">
                Margin Kontribusi <InfoTooltip textKey="MARGIN_KONTRIBUSI"/>
            </span>
          <div className="mt-2">
            <h5 className="text-base font-extrabold text-main">{formatIDR(financialResult.marginKontribusiPerUnit)}</h5>
            <p className="text-[10px] text-muted mt-0.5">Sisa Margin per Unit</p>
          </div>
        </div>
      </div>

      {/* CHART & TABEL DETIL PROYKA LABA */}
      <div className="card-container space-y-6">
        <div className="border-b border-border-subtle pb-3 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Analisa BEP &amp; Proyeksi Laba Rugi</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Representasi grafis perkembangan arus kas finansial</p>
          </div>
        </div>


{/* RESPONSIVE RECHARTS GRAPH */}
<div className="h-64 w-full text-xs">
  <ResponsiveContainer width="100%" height="100%">
    {(() => {
      const originalData = financialResult.dataSimulasiGraph || [];
      const targetVal = Math.ceil(financialResult.targetUnitBulan || 0);

      // 1. Ambil semua nilai volume yang ada untuk dijadikan ticks
      const volumes = originalData.map((d) => d.volume);
      
      // 2. Gabungkan dan urutkan agar nilai target masuk ke daftar ticks
      const allTicks = Array.from(new Set([...volumes, targetVal])).sort((a, b) => a - b);

      return (
        <LineChart data={originalData} margin={{ top: 25, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
          
          <XAxis 
            dataKey="volume" 
            type="number" 
            domain={['auto', 'auto']} 
            ticks={allTicks} // <--- INI KUNCINYA: Memaksa XAxis menampilkan nilai target
            stroke="var(--color-text-muted)" 
            tick={{ fontSize: 9 }} // Sedikit diperkecil agar tidak menumpuk
          />
          
          <YAxis 
            stroke="var(--color-text-muted)" 
            tick={{ fontSize: 10 }} 
            tickFormatter={(val) => `Rp${val / 1000}k`} 
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-sidebar-bg)",
              borderColor: "var(--color-border-strong)",
              borderRadius: "12px",
              color: "var(--color-text-main)"
            }}
            formatter={(val: any) => [formatIDR(Number(val))]}
          />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
          
          <Line type="monotone" dataKey="Pendapatan" stroke="var(--color-role-admin)" strokeWidth={2.5} />
          <Line type="monotone" dataKey="Total Biaya" stroke="var(--color-role-error)" strokeWidth={2} />
          <Line type="monotone" dataKey="Laba Bersih" stroke="var(--color-role-success)" strokeWidth={2} />
          
          <ReferenceLine 
            x={targetVal} 
            stroke="var(--color-role-admin)" 
            strokeDasharray="3 3"
            // isFront={true}
            label={{ 
                value: `TARGET (${targetVal})`, 
                position: 'top', 
                fontSize: 9, 
                fill: "var(--color-role-admin)",
                fontWeight: 'bold' 
            }}
          />
        </LineChart>
      );
    })()}
  </ResponsiveContainer>
</div>

{/* TABEL SIMULASI MATRIKS */}
<div className="space-y-2">
  <span className="text-[10px] font-bold text-muted uppercase block tracking-wider">Tabel Matriks Simulasi Finansial</span>
  <div className="overflow-x-auto rounded-xl border border-border-subtle">
    <table className="w-full text-[11px] text-left border-collapse">
      <thead>
        <tr className="bg-ui-hover text-muted font-bold border-b border-border-subtle">
          <th className="p-2.5">Simulasi Volume</th>
          <th className="p-2.5">Pendapatan (Revenue)</th>
          <th className="p-2.5">Total Biaya (Expenses)</th>
          <th className="p-2.5 text-right">Proyeksi Laba Rugi Bersih</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border-subtle">
        {(() => {
          const target = Math.ceil(financialResult.targetUnitBulan || 0);
          const data = [...financialResult.dataSimulasiGraph];
          
          // Cari posisi untuk menyisipkan target agar urut berdasarkan volume
          const targetIndex = data.findIndex(d => d.volume >= target);

          // Masukkan baris target ke dalam array data jika belum ada
          const rows = [...data];
          if (targetIndex !== -1 && rows[targetIndex].volume !== target) {
            rows.splice(targetIndex, 0, {
              volume: target,
              Pendapatan: financialResult.potensiOmzetBulan,
              "Total Biaya": financialResult.totalBiayaTotalBulan,
              "Laba Bersih": projection.targetLabaBersih,
            });
          }

          return rows.map((row, idx) => {
            const isTargetRow = row.volume === target;
            return (
              <tr 
                key={idx} 
                className={`${isTargetRow ? "bg-brand-admin text-white font-bold" : "hover:bg-ui-hover/50 transition-colors"}`}
              >
                <td className="p-2.5">{isTargetRow ? `TARGET ${row.volume} PCS` : `${row.volume} Pcs`}</td>
                <td className="p-2.5">{formatIDR(row.Pendapatan)}</td>
                <td className="p-2.5">{formatIDR(row["Total Biaya"])}</td>
                <td className="p-2.5 text-right font-black">
                  {formatIDR(row["Laba Bersih"])}
                </td>
              </tr>
            );
          });
        })()}
      </tbody>
    </table>
  </div>
</div>
      </div>

    </section>
  );
};