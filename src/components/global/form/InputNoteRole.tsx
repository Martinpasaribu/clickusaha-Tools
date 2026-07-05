"use client";

interface InputNoteProps {
  title?: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function InputNoteRole({ title, value, onChange, disabled = false }: InputNoteProps) {
  return (
    <div>
      {/* Label Mikro Kapital Konsisten */}
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
        Catatan ({title})
      </label>
      
      <textarea
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Contoh: Titip taruh di dekat galian fondasi barat atau supplier toko A"
        rows={3}
        /* Menggunakan Token Variabel v4 Murni & Font Size XS */
        className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-medium resize-none"
      />
    </div>
  );
}