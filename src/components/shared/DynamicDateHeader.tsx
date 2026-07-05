/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface DynamicDateHeaderProps {
  generatedDates: string[];
}

export default function DynamicDateHeader({ generatedDates }: DynamicDateHeaderProps) {
return (
    <>
      {generatedDates.map((dateStr) => {
        // Mengambil angka hari saja (Contoh: "2026-03-05" -> "05")
        const dayNumber = dateStr.split("-")[2];
        return (
          <th
            key={dateStr}
            /* Menggunakan Token v4 Pembatas Subtil & Lebar Simetris 60px */
            className="p-3 text-center border-l border-border-subtle bg-ui-hover/5 min-w-[60px] vertical-align-middle select-none"
            title={dateStr}
          >
            {/* Teks Angka Kalender Memakai Token Muted v4 */}
            <span className="block text-[10px] font-mono font-black text-muted tracking-wider">
              {dayNumber}
            </span>
          </th>
        );
      })}
    </>
  );
}