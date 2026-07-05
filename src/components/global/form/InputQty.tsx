"use client";

interface InputQtyProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export default function InputQty({ label, value, onChange, disabled = false }: InputQtyProps) {
  return (
    <div>
      {/* Label Mikro Kapital Dinamis Konsisten */}
      <label className="block text-green-600 text-[10px] font-bold  uppercase tracking-wider mb-2">
        {label}
      </label>
      
      <input
        type="number"
        // required
        min="0"
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder=""
        /* Menggunakan Token Variabel v4 Murni & Font Bold untuk Angka Kuantitas */
        className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-bold"
      />
    </div>
  );
}