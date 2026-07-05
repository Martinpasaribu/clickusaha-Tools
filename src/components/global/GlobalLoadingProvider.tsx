/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. Import createPortal
import { 
  Loader2, 
  TableProperties,
  Hammer,
  FileInput,
  SwatchBook,
  Drill,
  ToolCase,
  Axe,
  PaintRoller,
  SquareScissors,
  ShieldCheck, 
  FileUp, 
  FileDown, 
  RefreshCw 
} from "lucide-react";

export type LoadingType = "auth" | "logout" | "tukang" | "supervisor" | "Admin" | "Owner" | "export-pdf" | "import-data" | "default";

interface GlobalLoadingModalProps {
  isOpen: boolean;
  type?: LoadingType;
  title?: string;
  description?: string;
}

export default function GlobalLoadingModal({
  isOpen,
  type = "default",
  title,
  description,
}: GlobalLoadingModalProps) {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isFade, setIsFade] = useState(true);
  const [mounted, setMounted] = useState(false); // State pelacak SSR Next.js

  const iconGroups: Record<LoadingType, React.ElementType[]> = {
    auth: [ShieldCheck, ToolCase, RefreshCw],
    logout: [ShieldCheck, ToolCase, RefreshCw],
    tukang: [Hammer, Drill, Axe, PaintRoller, SquareScissors],
    supervisor: [Hammer, Drill, Axe, PaintRoller, SquareScissors],
    Admin: [TableProperties, SwatchBook, FileInput, ToolCase],
    Owner: [SwatchBook, TableProperties, ShieldCheck],
    "export-pdf": [FileDown, TableProperties, FileInput],
    "import-data": [FileUp, TableProperties, FileInput],
    default: [RefreshCw, ToolCase, SwatchBook],
  };

  const activeIcons = iconGroups[type] || iconGroups.default;

  useEffect(() => {
    setMounted(true); // Komponen siap dieksekusi di sisi client browser
    if (!isOpen) return;

    const interval = setInterval(() => {
      setIsFade(false);

      setTimeout(() => {
        setCurrentIconIndex((prevIndex) => (prevIndex + 1) % activeIcons.length);
        setIsFade(true);
      }, 700);

    }, 1200);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, activeIcons.length]);

  // Early return jika modal tidak aktif atau DOM belum siap di client
  if (!isOpen || !mounted) return null;

  // ==========================================
  // KONFIGURASI TEMA MODAL SEMANTIK TAILWIND v4
  // ==========================================
  const config = {
    auth: {
      bgIcon: "bg-brand-auth/10",
      border: "border-brand-auth/20",
      progressBg: "bg-brand-auth",
      spinnerColor: "text-brand-auth/30",
      iconColor: "text-brand-auth",
      defaultTitle: "Autentikasi Keamanan",
      defaultDesc: "Memverifikasi akun dan hak akses Anda, mohon tunggu..."
    },
    logout: {
      bgIcon: "bg-brand-error/10",
      border: "border-brand-error/20",
      progressBg: "bg-brand-error",
      spinnerColor: "text-brand-error/30",
      iconColor: "text-brand-error",
      defaultTitle: "Keluar Aplikasi",
      defaultDesc: "Sedang membersihkan riwayat aset dan session login..."
    },
    tukang: {
      bgIcon: "bg-orange-500/10",
      border: "border-orange-500/20",
      progressBg: "bg-orange-500",
      spinnerColor: "text-orange-500/30",
      iconColor: "text-orange-500",
      defaultTitle: "Memproses Data Lapangan",
      defaultDesc: "Sedang mengolah material dan kalkulasi volume tukang..."
    },
    supervisor: {
      bgIcon: "bg-green-500/10",
      border: "border-green-500/20",
      progressBg: "bg-green-500",
      spinnerColor: "text-green-500/30",
      iconColor: "text-green-500",
      defaultTitle: "Memproses Data Lapangan",
      defaultDesc: "Menyiapkan data lapangan."
    },
    Admin: {
      bgIcon: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      progressBg: "bg-indigo-500",
      spinnerColor: "text-indigo-500/30",
      iconColor: "text-indigo-500",
      defaultTitle: "Sinkronisasi Data Admin",
      defaultDesc: "Menyusun lembar rekonsiliasi ke dalam sistem, mohon tunggu..."
    },
    Owner: {
      bgIcon: "bg-purple-500/10",
      border: "border-purple-500/20",
      progressBg: "bg-purple-500",
      spinnerColor: "text-purple-500/30",
      iconColor: "text-purple-500",
      defaultTitle: "Memuat Laporan Ringkas",
      defaultDesc: "Menyiapkan metrik dan grafik performa untuk Owner..."
    },
    "export-pdf": {
      bgIcon: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      progressBg: "bg-emerald-500",
      spinnerColor: "text-emerald-500/30",
      iconColor: "text-emerald-500",
      defaultTitle: "Mengekspor Dokumen",
      defaultDesc: "Sedang menyusun dan mengunduh berkas PDF Anda..."
    },
    "import-data": {
      bgIcon: "bg-amber-500/10",
      border: "border-amber-500/20",
      progressBg: "bg-amber-500",
      spinnerColor: "text-amber-500/30",
      iconColor: "text-amber-500",
      defaultTitle: "Mengimpor Data",
      defaultDesc: "Membaca berkas dan memperbarui sistem database..."
    },
    default: {
      bgIcon: "bg-ui-hover",
      border: "border-border-subtle",
      progressBg: "bg-main",
      spinnerColor: "text-disabled/40",
      iconColor: "text-muted",
      defaultTitle: "Memproses Permintaan",
      defaultDesc: "Sistem sedang mengolah data Anda, harap tunggu sebentar."
    }
  };

  const currentConfig = (config as any)[type] || config.default;
  const CurrentActiveIcon = activeIcons[currentIconIndex] || RefreshCw;

  // 2. Gunakan createPortal untuk memaksa letak HTML berada langsung di bawah <body>
  return createPortal(
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-150 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className={`bg-card w-full max-w-sm rounded-2xl p-6 shadow-2xl border ${currentConfig.border} flex flex-col items-center text-center transition-all duration-300`}>
        
        {/* Kontainer Lingkaran Ikon */}
        <div className="relative mb-4 flex items-center justify-center w-16 h-16">
          {/* Ring Tracker Statis */}
          <div className="absolute inset-0 rounded-full border-4 border-border-subtle" />
          
          {/* Ring Spinner Bergerak Aktif */}
          <Loader2 
            className={`absolute animate-spin ${currentConfig.spinnerColor}`} 
            style={{ width: '4rem', height: '4rem' }} 
          />
          
          {/* Inner Badge Icon Holder */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 ${currentConfig.bgIcon}`}>
            <div className={`transition-all duration-200 transform ${
              isFade ? "opacity-100 scale-100 animate-pulse" : "opacity-0 scale-75"
            }`}>
              <CurrentActiveIcon className={`w-7 h-7 ${currentConfig.iconColor}`} />
            </div>
          </div>
        </div>

        {/* Judul Status */}
        <h4 className="text-sm font-bold text-main mb-1 tracking-wide">
          {title || currentConfig.defaultTitle}
        </h4>

        {/* Deskripsi Status */}
        <p className="text-xs text-muted font-medium max-w-[280px] leading-relaxed">
          {description || currentConfig.defaultDesc}
        </p>

        {/* Progress Bar Track */}
        <div className="w-full bg-border-subtle h-1 rounded-full mt-5 overflow-hidden relative">
          <div className={`h-full rounded-full absolute left-0 animate-infinite-loading ${currentConfig.progressBg}`} />
        </div>

      </div>
    </div>,
    document.body // Target lemparan portal
  );
}