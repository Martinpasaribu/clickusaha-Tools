/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface DynamicDateCellsProps {
  generatedDates: string[];
  itemLogHistory: any[];
}

export default function DynamicDateCells({ generatedDates, itemLogHistory }: DynamicDateCellsProps) {
  
  // Fungsi pembantu untuk memberikan warna badge berdasarkan jenis aktivitas log
  const getBadgeStyle = (actionType: string) => {
    switch (actionType) {
      case "CPO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50";
      case "UIQ":
        return "bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50";
      case "URQ":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
      case "UST":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

return (
    <>
      {generatedDates.map((dateStr) => {
        // Cari log yang memiliki tanggal yang sama dengan kolom ini
        const logsOnThisDate = itemLogHistory?.filter((log: any) => {
          if (!log.manualLogDate) return false;
          return log.manualLogDate.split("T")[0] === dateStr;
        }) || [];

        return (
          <td
            key={dateStr}
            /* Menggunakan Token v4 untuk Background Tipis Kolom & Border Batas */
            className="p-1.5 text-center border-l border-border-subtle bg-ui-hover/10 min-w-[60px] vertical-align-middle transition-colors duration-150 hover:bg-ui-hover/30"
          >
            <div className="flex flex-col gap-1 items-center justify-center min-h-[24px]">
              {logsOnThisDate.length > 0 ? (
                logsOnThisDate.map((log: any, index: number) => {
                  const shortType = log.type?.substring(0, 3) || "LOG";
                  return (
                    <span
                      key={index}
                      /* Badge mikro dengan style dinamis dari helper function kamu */
                      className={`block px-1 py-0.5 text-[9px] font-black font-mono rounded select-none tracking-wider shadow-xs transition-transform active:scale-95 cursor-help ${getBadgeStyle(
                        log.type
                      )}`}
                      title={`${log.type} oleh ${log.role || "System"}, ${log.description}`}
                    >
                      {shortType.toUpperCase()}
                    </span>
                  );
                })
              ) : (
                /* Strip Pengisi Kosong Menggunakan Warna Muted/Disabled v4 */
                <span className="text-disabled text-xs font-bold select-none opacity-60">
                  -
                </span>
              )}
            </div>
          </td>
        );
      })}
    </>
  );
}