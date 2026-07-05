"use client";

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Tutup otomatis via tombol ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      
      {/* BACKDROP GLASS OVERLAY (Gelap Transparan dengan Efek Blur Tipis Premium) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* MODAL CONTENT CONTAINER (Murni Menggunakan Token v4) */}
      <div className="relative w-full max-w-xl bg-card border border-border-subtle rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-98 duration-150">
        
        {/* STICKY MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-card select-none">
          <h3 className="text-sm font-black tracking-tight text-main uppercase">
            {title}
          </h3>
          
          {/* TOMBOL CLOSE (Sleek Minimalis Tanpa Karakter Times AI Mentah) */}
          <button 
            onClick={onClose}
            aria-label="Close Modal"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-main hover:bg-ui-hover border border-transparent hover:border-border-subtle text-base font-medium transition-all active:scale-95"
          >
            ✕
          </button>
        </div>
        
        {/* SCROLLABLE MODAL BODY (Mencegah Header Ikut Tergulung Ke Atas) */}
        <div className="p-6 overflow-y-auto text-main custom-scrollbar">
          {children}
        </div>
        
      </div>
    </div>
  );
}