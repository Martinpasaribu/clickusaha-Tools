"use client";

interface InputNameProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function InputName({ value, onChange, disabled = false }: InputNameProps) {
  return (
    <div>
      {/* Label Mikro Kapital Konsisten */}
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
        Nama Barang Material
      </label>
      
      <input
        type="text"
        required
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Contoh: Semen Tiga Roda, Besi 12mm"
        /* Menggunakan Token Variabel v4 Murni */
        className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-medium"
      />
    </div>
  );
}