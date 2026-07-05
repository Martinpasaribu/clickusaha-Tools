"use client";

interface InputPriceProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export default function InputPrice({ label, value, onChange, disabled = false }: InputPriceProps) {
  return (
    <div>
      {/* Label Mikro Kapital Dinamis */}
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
        {label}
      </label>
      
      <div className="relative rounded-xl">
        {/* Dekorator Mata Uang (Murni Token V4) */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none select-none">
          <span className="text-muted text-xs font-bold tracking-wide">
            Rp
          </span>
        </div>
        
        <input
          type="number"
          // required
          min="0"
          disabled={disabled}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          /* pl-9 untuk memberikan ruang aman bagi teks dekorator Rp */
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-bold"
        />
      </div>
    </div>
  );
}