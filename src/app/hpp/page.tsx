/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { BiayaVariabelItem, hitungSistemHPP, ProductState, ProjectionState } from "@/utills/function-hpp";
import React, { useState, useMemo, useEffect } from "react";

import { RightPanelMetrics } from "./RightPanelMetrics";
import { InputField, SelectField } from "./FormInput";
import { LeftPanel } from "./LeftPanel";



export default function App() {
 
  const [product, setProduct] = useState<ProductState>({
    nama: "", tipeOutput: "jadi", image: null, modePerhitungan: "pcs",
    batchSize: 1, modeAlokasiBiayaTetap: "bagi_rata", totalBiayaTetapGlobal: 0,
    jumlahVariasiProduk: 1, tambahanBiaya: 0, hargaJualSaatIni: 0, estimasiVolumeBulanan: 0,
    pendapatanRataHarian: 0, pendapatanRataMingguan: 0, pendapatanQtyRataHarian: 0, pendapatanQtyRataMingguan : 0,
  });

  const [biayaVariabel, setBiayaVariabel] = useState<BiayaVariabelItem[]>([]);
  const [projection, setProjection] = useState<ProjectionState>({ targetLabaBersih: 0, hargaJualPilihan: 0 });


  const [persentaseSensitivitas, setPersentaseSensitivitas] = useState<number>(10);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Memanfaatkan Pure Engine Function untuk menghitung nilai keuangan secara dinamis
  const financialResult = useMemo(() => {
    return hitungSistemHPP(product, biayaVariabel, projection, persentaseSensitivitas);
  }, [product, biayaVariabel, projection, persentaseSensitivitas]);

  // Mode gelap kelas sinkronisasi
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAddField = () => {
    setBiayaVariabel((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        namaBahan: "Bahan Baku Baru",
        takaranPakai: 0,
        satuanPakai: "gram",
        pembelianJumlah: 1000,
        pembelianSatuan: "gram",
        pembelianHarga: 0
      }
    ]);
  };

  const handleRemoveField = (id: string) => {
    setBiayaVariabel((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateField = (id: string, key: keyof BiayaVariabelItem, val: string | number) => {
    setBiayaVariabel((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: val } : item))
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProduct((prev) => ({
        ...prev,
        image: URL.createObjectURL(e.target.files[0])
      }));
    }
  };

return (
  <div className="min-h-screen bg-background text-main transition-colors duration-200">
    
    {/* HEADER UTAMA */}
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-sidebar px-6 py-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-brand-admin flex items-center justify-center text-white font-bold text-base shadow-xs">
          H
        </div>
        <div>
          <h1 className="text-base font-bold text-main leading-tight">HPP &amp; BEP Enterprise Suite</h1>
          <p className="text-xs text-muted">Sistem Proyeksi Laba dan Manajemen Harga Pokok Penjualan</p>
        </div>
      </div>
      <div className="flex items-center gap-4">

        <div className="hidden md:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-success animate-pulse"></span>
          <span className="text-[11px] text-muted font-semibold uppercase tracking-wider">Engine Aktif (IDR)</span>
        </div>
      </div>
    </header>

    {/* DASHBOARD GRID */}
    <main className="max-w-[1600px] mx-auto p-4 md:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
      
        <LeftPanel 
        product={product}
        setProduct={setProduct}
        biayaVariabel={biayaVariabel}
        setBiayaVariabel={setBiayaVariabel}
        projection={projection}
        setProjection={setProjection}
        financialResult={financialResult}
        handleImageUpload={handleImageUpload}
        handleAddField={handleAddField}
        handleRemoveField={handleRemoveField}
        handleUpdateField={handleUpdateField}
        formatIDR={formatIDR}
        />

      {/* PANEL KANAN - LIVE METRICS & VISUALISASI GRAPH (7 COLS) */}
        <RightPanelMetrics 
                financialResult={financialResult}
                projection={projection}
                persentaseSensitivitas={persentaseSensitivitas}
                setPersentaseSensitivitas={setPersentaseSensitivitas}
                formatIDR={formatIDR} product={product}        />

    </main>

    {/* FOOTER */}
    <footer className="border-t border-border-subtle py-4 mt-8 text-center text-xs text-muted bg-sidebar">
      <p>&copy; {new Date().getFullYear()} Enterprise HPP Optimizer Suite. Perhitungan didasarkan pada standardisasi akuntansi manajerial dan analisis BEP linier.</p>
    </footer>
  </div>
);
}