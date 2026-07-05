"use client";

import { COMMON_MATERIAL_UNITS } from "@/constants/unitTypes";

interface InputUnitTypeProps {
  value: string; // Menyimpan value singkatan (cth: 'kg', 'sak', 'pcs')
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function InputUnitType({ value, onChange, disabled = false }: InputUnitTypeProps) {
  // Periksa apakah value dari database terdaftar di daftar 'value' konstanta kita
  const isCommonUnit = COMMON_MATERIAL_UNITS.some((unit) => unit.value === value);
  const showCustomInput = !isCommonUnit || value === "";

  return (
    <div>
      {/* Label Mikro Kapital Konsisten */}
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
        Satuan Unit Material
      </label>
      
      <div className="flex gap-2">
        <select
          disabled={disabled}
          value={isCommonUnit && value !== "" ? value : "LAINNYA"}
          onChange={(e) => {
            if (e.target.value !== "LAINNYA") {
              onChange(e.target.value);
            } else {
              onChange("");
            }
          }}
          /* Menggunakan Token v4 Murni & Lebar Fleksibel Tergantung Input Kustom */
          className={`px-3 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-bold cursor-pointer ${
            showCustomInput ? "w-1/2" : "w-full"
          }`}
        >
          {COMMON_MATERIAL_UNITS.map((unit) => (
            <option 
              key={unit.value} 
              value={unit.value}
              className="bg-card text-main font-semibold"
            >
              {unit.name}
            </option>
          ))}
          <option value="LAINNYA" className="bg-card text-main font-semibold">
            📦 Lainnya (Ketik Manual)
          </option>
        </select>

        {/* Input Kustom Bebas dengan Token Semantik v4 */}
        {showCustomInput && (
          <input
            type="text"
            required
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value.toLowerCase().trim())}
            placeholder="cth: ikat, pack"
            className="w-1/2 px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-bold"
          />
        )}
      </div>
    </div>
  );
}