/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // 1. Import createPortal dari react-dom
import { Plus } from "lucide-react";
import InputSupplierModal from "@/components/global/modal/SupplierModal";

interface SupplierOption {
  _id: string;
  name: string;
}

interface InputSupplierSelectProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function InputSupplierSelect({ value, onChange, disabled = false }: InputSupplierSelectProps) {
  const [options, setOptions] = useState<SupplierOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // State untuk memastikan komponen sudah terpasang di client

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suppliers");
      const resData = await res.json();
      if (resData.success) setOptions(resData.data || []);
    } catch (err) {
      console.error("Dropdown supplier load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    setMounted(true); // Set true setelah komponen di-render di client side
  }, []);

  return (
    <div className="flex items-center gap-2 w-full">
      {/* DROPDOWN SELECT */}
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || disabled}
          className="w-full px-4 py-2.5 pr-10 text-xs rounded-xl border border-border-strong bg-card text-main placeholder:text-disabled outline-hidden focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 transition-all font-medium appearance-none cursor-pointer"
        >
          <option value="" disabled>
            {loading ? "Loading suppliers..." : "Select supplier vendor"}
          </option>
          {options.map((supplier) => (
            <option key={supplier._id} value={supplier._id} className="bg-card text-main">
              {supplier.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-disabled border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-current w-0 h-0" />
      </div>

      {/* TOMBOL PLUS */}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsModalOpen(true)}
        className="p-2.5 bg-card hover:bg-ui-hover text-main border border-border-strong rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
      >
        <Plus size={16} className="text-muted hover:text-brand-auth transition-colors" />
      </button>

      {/* 2. GUNAKAN PORTAL UNTUK MELEMPAR MODAL KE BODY */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl">
            <InputSupplierModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSaveSuccess={() => {
                fetchOptions();
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>,
        document.body // Target portal dipindahkan secara fisik ke root body HTML
      )}
    </div>
  );
}