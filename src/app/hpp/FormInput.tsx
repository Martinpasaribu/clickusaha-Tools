/* eslint-disable @typescript-eslint/no-explicit-any */
// FormInput.tsx

import { UNIT_OPTIONS } from "@/constants/unit";

interface SelectOption {
  label: string;
  value: string ;
}

interface InputFieldProps {
  label: string;
  type?: "text" | "number";
  value: string | number;
  onChange: (val: string | number) => void;
  placeholder?: string;
  className?: string;
}

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  options: SelectOption[];
}

export const InputField = ({ 
  label, 
  type = "number", 
  value, 
  onChange, 
  placeholder = "", 
  className = "" 
}: InputFieldProps) => (
  <div className={`w-full ${className}`}>
    <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 ml-0.5">
      {label}
    </label>
    <input
      type={type}
      className="w-full bg-page-bg border border-border-strong rounded-xl px-4 py-2.5 text-sm font-medium text-main outline-none transition-all duration-200 focus:border-brand-auth focus:ring-2 focus:ring-brand-auth/10 hover:border-border-strong/80"
      placeholder={placeholder}
      value={value === 0 ? "" : value}
      onChange={(e) => {
        const val = type === "number" ? Number(e.target.value) : e.target.value;
        onChange(val);
      }}
    />
  </div>
);

export const SelectField = ({ label, value, onChange, options }: SelectFieldProps) => (
  <div className="w-full">
    <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 ml-0.5">
      {label}
    </label>
    <select 
      className="w-full bg-page-bg border border-border-strong rounded-xl px-4 py-2.5 text-sm font-medium text-main outline-none transition-all duration-200 focus:border-brand-auth focus:ring-2 focus:ring-brand-auth/10 cursor-pointer hover:border-border-strong/80 appearance-none"
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);


interface UnitSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const UnitSelect = ({
  label,
  value,
  onChange,
}: UnitSelectProps) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-muted uppercase mb-1">
      {label}
    </label>

    <select
      className="w-full bg-page-bg border border-border-strong rounded-lg px-2 py-2.5 text-sm outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {UNIT_OPTIONS.map((opt) => (
        <option
          key={opt.label}
          value={opt.value}
          disabled={opt.disabled}
        >
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);