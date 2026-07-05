import { Info } from "lucide-react";
import { TOOLTIP_TEXT } from "@/constants/tooltips"; // Import konstanta

interface InfoTooltipProps {
  textKey: keyof typeof TOOLTIP_TEXT; // Hanya menerima key yang ada di konstanta
}

export const InfoTooltip = ({ textKey }: InfoTooltipProps) => {
  return (
    <div className="group relative inline-flex items-center ml-1 cursor-help">
      <Info className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
      <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-slate-800 text-white text-[9px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-xl">
        {TOOLTIP_TEXT[textKey]}
      </div>
    </div>
  );
};