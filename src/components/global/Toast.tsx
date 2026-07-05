/* eslint-disable react-hooks/immutability */
"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, Loader2, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading'; // 👈 Tambah parameter loading

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [animate, setAnimate] = useState(false);

  // Efek transisi masuk (Slide In)
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Timer penutupan otomatis (Diabaikan jika tipenya adalah 'loading')
  useEffect(() => {
    if (type === 'loading') return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, duration]);

  const handleClose = () => {
    setAnimate(false); // Trigger animasi keluar dahulu
    setTimeout(() => {
      onClose();
    }, 200); // Sinkron dengan durasi transition-all duration-200
  };

  // Desain Monokrom Premium dengan Aksen Mikro
  const styles = {
    success: {
      container: 'border-border-subtle bg-card/80 text-main',
      icon: <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />,
    },
    error: {
      container: 'border-brand-error/20 bg-card/80 text-main',
      icon: <AlertCircle size={15} className="text-brand-error shrink-0" />,
    },
    info: {
      container: 'border-border-subtle bg-card/80 text-main',
      icon: <Info size={15} className="text-muted shrink-0" />,
    },
    loading: {
      container: 'border-border-subtle bg-card/80 text-main',
      icon: <Loader2 size={15} className="text-main animate-spin shrink-0" />,
    },
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-200 ease-out select-none ${
        styles[type].container
      } ${
        animate 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
      }`}
    >
      {/* Visual Indikator Status */}
      {styles[type].icon}
      
      {/* Pesan Toast */}
      <span className="text-[11px] font-mono font-medium tracking-wide leading-none pt-[1px]">
        {message}
      </span>
      
      {/* Tombol Close (Hanya muncul jika bukan tipe loading) */}
      {type !== 'loading' && (
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 p-0.5 rounded text-disabled hover:text-main hover:bg-ui-hover/60 transition-colors outline-none"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}