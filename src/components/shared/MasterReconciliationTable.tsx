/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Pin, Lock } from "lucide-react";
import ProductHistoryModal from "../global/modal/ProductHistoryModal";
import DynamicDateHeader from "./DynamicDateHeader"; 
import DynamicDateCells from "./DynamicDateCells";  
import MasterReconciliationFilter, { FilterState } from "./MasterReconciliationFilter"; 
import ProductNoteModal from "../global/modal/ProductNoteModal";
import RotationMobile from "../global/element/rotaeMobile";

interface MasterReconciliationTableProps {
  role: "TUKANG" | "ADMIN" | "OWNER" | "SUPERVISOR";
  data: any[];
  onEditClick: (item: any) => void;
  onDeleteClick?: (id: string) => void;
  onFullScreen?: (id: string) => void;
}

export default function MasterReconciliationTable({ role, data, onEditClick, onDeleteClick }: MasterReconciliationTableProps) {
  const [tableDataWithLogs, setTableDataWithLogs] = useState<any[]>([]);
  const [loadingTableLogs, setLoadingTableLogs] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [selectedNoteUser, setSelectedNoteUser] = useState<any>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    searchSupp: "",
    periodMonth: "",
    status: "",
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [fullScreen, setIsFullscreen] = useState(false);
  const [pinnedColumns, setPinnedColumns] = useState<string[]>(["material", "actions"]); 

  // MODAL STATES
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loadingHistory, setIsLogLoading] = useState(false);

  // 1. Deteksi Ukuran & Orientasi Layar (Disederhanakan untuk efisiensi)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // 2. Fungsi Toggle Fullscreen (Hanya fokus pada request/exit element)
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (tableContainerRef.current) {
          await tableContainerRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen Error:", error);
    }
  };

  // 3. Handle Perubahan Fullscreen & Otomatisasi Rotasi Landscape Mobile
  useEffect(() => {
    const handleFullscreenChange = async () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      // SINKRONISASI ROTASI DI SINI (Saat element benar-benar sudah siap masuk/keluar fullscreen)
      try {
        if (isCurrentlyFullscreen) {
          if (screen.orientation && typeof (screen.orientation as any).lock === "function") {
            await (screen.orientation as any).lock("landscape");
          }
        } else {
          if (screen.orientation && typeof (screen.orientation as any).unlock === "function") {
            (screen.orientation as any).unlock();
          }
        }
      } catch (orientationError) {
        console.log("Orientation lock/unlock tidak didukung browser ini atau membutuhkan gesture user tambahan.");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 4. Sinkronisasi Data Utama dari Parent (Aman dari penimpaan data logHistory)
  useEffect(() => {
    if (!data) return;

    setTableDataWithLogs((prevLogsData) => {
      const existingLogsMap = new Map();
      prevLogsData.forEach(item => {
        if (item.logHistory && item.logHistory.length > 0) {
          existingLogsMap.set(item._id, item.logHistory);
        }
      });

      return data.map((newItem) => ({
        ...newItem,
        logHistory: newItem.logHistory || existingLogsMap.get(newItem._id) || []
      }));
    });
  }, [data]);

  // 5. Fetch Semua Log Ketika Fitur Kalender Aktif
  useEffect(() => {
    if (!showChart || !data || data.length === 0) return;
    
    const insideAlreadyFetched = tableDataWithLogs.some(item => item.logHistory && item.logHistory.length > 0);
    if (insideAlreadyFetched) return;

    const fetchAllLogs = async () => {
      setLoadingTableLogs(true);
      try {
        const updatedData = await Promise.all(
          tableDataWithLogs.map(async (item) => {
            if (item.logHistory && item.logHistory.length > 0) return item;
            try {
              const res = await fetch(`/api/log-history?itemId=${item._id}`);
              const resData = await res.json();
              return { ...item, logHistory: resData.success ? resData.data : [] };
            } catch (err) {
              console.error(err);
              return { ...item, logHistory: [] };
            }
          })
        );
        setTableDataWithLogs(updatedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTableLogs(false);
      }
    };
    fetchAllLogs();
  }, [showChart, data, tableDataWithLogs]);

  // 6. Helper formatters
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const SelisihQTY = (value: any) => value.initialQty - value.receivedQty;

  // 7. Handlers untuk Modals
  const handleOpenHistory = async (item: any) => {
    setSelectedItemName(item.name || "Material");
    setHistoryModalOpen(true);
    setIsLogLoading(true);
    setHistoryLogs([]);

    try {
      const res = await fetch(`/api/log-history?itemId=${item._id}`);
      const resData = await res.json();
      setHistoryLogs(resData.success ? resData.data : []);
    } catch (error) {
      console.error("Gagal memuat log history:", error);
    } finally {
      setIsLogLoading(false);
    }
  };

  const handleOpenNote = (item: any) => {
    setSelectedNote(item.note || "");
    setSelectedNoteUser(item.noteUser || null);
    setNoteModalOpen(true);
  };

  // 8. Logika Filter Data Table
  const filteredData = useMemo(() => {
    return tableDataWithLogs.filter((item) => {
      if (filters.searchQuery && !item.name?.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      if (filters.searchSupp && !item.supplier_id?.name?.toLowerCase().includes(filters.searchSupp.toLowerCase())) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.periodMonth) {
        const itemDate = new Date(item.manualDate);
        if (`${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}` !== filters.periodMonth) return false;
      }
      return true;
    });
  }, [tableDataWithLogs, filters]);

  // 9. Generate daftar tanggal header kalender
  const generatedDates = useMemo(() => {
    let targetYear: number, targetMonth: number;
    if (filters.periodMonth) {
      const [yearStr, monthStr] = filters.periodMonth.split("-");
      targetYear = parseInt(yearStr, 10);
      targetMonth = parseInt(monthStr, 10);
    } else {
      const today = new Date();
      targetYear = today.getFullYear();
      targetMonth = today.getMonth() + 1;
    }
    const totalDays = new Date(targetYear, targetMonth, 0).getDate();
    const datesArray: string[] = [];
    for (let day = 1; day <= totalDays; day++) {
      datesArray.push(`${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    }
    return datesArray;
  }, [filters.periodMonth]);

  // 10. Konfigurasi Kolom Kiri
  const leftColumns = useMemo(() => [
    { id: "material", label: "Material Name", width: 130, render: (item: any) => (
      <div className="flex flex-col max-w-18">
        <span className="font-medium text-[var(--color-text-main)] truncate" title={item.name}>{item.name}</span>
        <span className="text-[10px] text-[var(--color-text-disabled)] font-mono tracking-tight truncate">{item.code}</span>
      </div>
    )},
    { id: "supplier", label: "Supplier", width: 100, render: (item: any) => <span className="text-[var(--color-text-muted)] truncate block">{item.supplier_id?.name || "-"}</span> },
    { id: "date", label: "Order Date", width: 100, render: (item: any) => <span className="text-[var(--color-text-muted)] font-mono">{formatDate(item.manualDate)}</span> },
  ], []);

  // 11. Konfigurasi Kolom Kanan (Aman dari Warning Hooks)
  const rightColumns = useMemo(() => {
    const isAdminOrOwner = role === "ADMIN" || role === "OWNER";
    const isOwner = role === "OWNER";

    return [

      { id: "qty_po", label: "QTY PO", width: 100, show: true, render: (item: any) => <div className="text-left font-mono text-[var(--color-text-main)]">{item.initialQty} <span className="text-[10px] text-[var(--color-text-disabled)] uppercase font-sans ml-0.5">{item.unit}</span></div> },
      { id: "qty_received", label: "QTY Recv", width: 100, show: isAdminOrOwner, render: (item: any) => <div className="text-left font-mono text-[var(--color-text-muted)]">{item.receivedQty} <span className="text-[10px] text-[var(--color-text-disabled)] uppercase font-sans ml-0.5">{item.unit}</span></div> },
      { id: "qty_diff", label: "QTY Diff", width: 110, show: isAdminOrOwner, render: (item: any) => {
        const diff = SelisihQTY(item);
        if (diff > 0) return <div className="text-left font-mono text-[var(--color-role-error)] font-medium">{diff} <span className="text-[10px] uppercase font-sans">-{item.unit}</span></div>;
        if (diff < 0) return <div className="text-left font-mono text-[var(--color-role-tukang)] font-medium">+{Math.abs(diff)} <span className="text-[10px] uppercase font-sans">{item.unit}</span></div>;
        return <div className="text-left text-xs text-[var(--color-role-success)] font-medium">In Sync</div>;
      }},
      { id: "qty_final", label: "Qty Final", width: 100, show: isAdminOrOwner, render: (item: any) => <div className="text-left font-mono text-[var(--color-text-main)] font-semibold">{item.finalQty} <span className="text-[10px] text-[var(--color-text-disabled)] uppercase font-sans ml-0.5">{item.unit}</span></div> },
      { id: "price", label: "Price/Unit", width: 110, show: isOwner, render: (item: any) => <div className="text-left font-mono text-[var(--color-text-muted)]">{formatRupiah(item.pricePerUnit || 0)}</div> },
      { id: "invoice", label: "Total Invoice", width: 120, show: isOwner, render: (item: any) => <div className="text-left font-mono font-medium text-[var(--color-text-main)]">{formatRupiah(item.totalInvoice || 0)}</div> },
      { id: "remaining", label: "Remaining", width: 120, show: isOwner, render: (item: any) => <div className="text-left font-mono font-medium text-[var(--color-role-error)]">{formatRupiah(item.remainingPayment || 0)}</div> },
      { id: "status", label: "Status", width: 180, show: true, render: (item: any) => {
        let customStatusTheme = "bg-[var(--color-role-auth)]/10 text-[var(--color-role-auth)] border-[var(--color-role-auth)]/20";
        if (item.status === "MENUNGGU_PO") {
          customStatusTheme = "bg-[var(--color-role-tukang)]/10 text-[var(--color-role-tukang)] border-[var(--color-role-tukang)]/20";
        } else if (item.status === "PAID") {
          customStatusTheme = "bg-[var(--color-role-success)]/10 text-[var(--color-role-success)] border-[var(--color-role-success)]/20";
        }
        return (
          <span className={`px-2 py-0.5 text-[11px] rounded-md font-medium border tracking-wide inline-block ${customStatusTheme}`}>
            {item.status}
          </span>
        );
      }},
            
      {
        id: "note",
        label: "Note",
        width: 85,
        show: true,
        render: (item: any) => { 
          const hasNote = item.note || item.noteUser?.owner || item.noteUser?.admin || item.noteUser?.supervisor || item.noteUser?.tukang;
            return hasNote ? (
              <div className="flex justify-center items-center">
              <button
                onClick={() => handleOpenNote(item)}
                className="px-2 py-1 text-xs font-medium rounded-md border border-[var(--color-border-subtle)] hover:bg-[var(--color-component-hover)] transition-all cursor-pointer"
              >
                View Note
              </button>
          </div>
            ) : (
              <span className="text-[var(--color-text-disabled)]">-</span>
            );
        },
      },
      { id: "actions", label: "Actions", width: 170, show: true, render: (item: any) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => handleOpenHistory(item)}
            className="px-2 py-1 text-xs font-medium border border-[var(--color-border-subtle)] rounded-md text-[var(--color-text-muted)] bg-[var(--color-component-bg)] hover:bg-[var(--color-component-hover)] transition-all cursor-pointer"
          >
            Logs
          </button>

          {role === "TUKANG" && item.status !== "MENUNGGU_PO" ? (
            <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-disabled)] italic px-2 py-1 select-none">
              <Lock size={12} className="text-[var(--color-text-disabled)]" />
              Locked
            </div>
          ) : (
            <button
              onClick={() => onEditClick(item)}
              className="px-2.5 py-1 text-xs font-medium bg-[var(--color-text-main)] text-[var(--color-component-bg)] rounded-md hover:opacity-90 transition-all cursor-pointer"
            >
              {role === "TUKANG" ? "Edit PO" : role === "ADMIN" ? "Verify" : role === "SUPERVISOR" ? "Verifikasi" : "Review"}
            </button>
          )}

          {(role === "ADMIN" || role === "OWNER") && onDeleteClick && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to permanently delete "${item.name}"?`)) {
                  onDeleteClick(item._id);
                }
              }}
              className="px-2 py-1 text-xs font-medium text-[var(--color-role-error)] hover:bg-[var(--color-role-error)]/10 rounded-md transition-all cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      )}
    ].filter(col => col.show);
  }, [role, onEditClick, onDeleteClick]);

  // 12. Sticky Column Styles Generator
  const columnStylesMap = useMemo(() => {
    const map: Record<string, { thClass: string; tdClass: string; style: React.CSSProperties }> = {};
    let leftAccumulator = 0;
    
    leftColumns.forEach((col) => {
      if (pinnedColumns.includes(col.id)) {
        map[col.id] = {
          thClass: "sticky evils-sticky-left z-30 bg-[var(--color-page-bg)] border-r border-[var(--color-border-subtle)]",
          tdClass: "sticky evils-sticky-left z-10 bg-[var(--color-component-bg)] group-hover:bg-[var(--color-component-hover)] border-r border-[var(--color-border-subtle)] transition-colors",
          style: { left: `${leftAccumulator}px`, minWidth: `${col.width}px`, maxWidth: `${col.width}px` }
        };
        leftAccumulator += col.width;
      } else {
        map[col.id] = { thClass: "", tdClass: "bg-[var(--color-component-bg)] group-hover:bg-[var(--color-component-hover)]/40", style: { minWidth: `${col.width}px`, maxWidth: `${col.width}px` } };
      }
    });

    let rightAccumulator = 0; 
    for (let i = rightColumns.length - 1; i >= 0; i--) {
      const col = rightColumns[i];
      if (pinnedColumns.includes(col.id)) {
        map[col.id] = {
          thClass: "sticky evils-sticky-right z-30 bg-[var(--color-page-bg)] border-l border-[var(--color-border-subtle)] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]",
          tdClass: "sticky evils-sticky-right z-10 bg-[var(--color-component-bg)] group-hover:bg-[var(--color-component-hover)] border-l border-[var(--color-border-subtle)] transition-colors shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]",
          style: { right: `${rightAccumulator}px`, minWidth: `${col.width}px`, maxWidth: `${col.width}px` }
        };
        rightAccumulator += col.width;
      } else {
        map[col.id] = { thClass: "", tdClass: "bg-[var(--color-component-bg)] group-hover:bg-[var(--color-component-hover)]/40", style: { minWidth: `${col.width}px`, maxWidth: `${col.width}px` } };
      }
    }

    return map;
  }, [leftColumns, rightColumns, pinnedColumns]);

  const handleTogglePin = (id: string) => {
    setPinnedColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    <div className="relative space-y-4">
      <div
        ref={tableContainerRef}
        className={`bg-background ${fullScreen ? "fixed inset-0 z-[9999] w-full h-screen p-2 overflow-y-auto" : "rounded-xl border border-border-subtle shadow-sm"}`}
      >
        {fullScreen && isMobile && !isLandscape && (
          <RotationMobile />
        )}  

        <MasterReconciliationFilter
          role={role}
          filters={filters}
          onFilterChange={setFilters}
          showChart={showChart}
          setShowChart={setShowChart}
          setIsFullscreen={toggleFullscreen} 
          fullScreen={fullScreen}      
        />

        <div className={fullScreen ? "h-full flex flex-col" : ""}>
          <div className="border border-[var(--color-border-subtle)] rounded-xl overflow-hidden bg-[var(--color-component-bg)] shadow-sm relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-auto border-separate border-spacing-0">
                <thead className="bg-[var(--color-page-bg)] text-[var(--color-text-muted)] tracking-medium whitespace-nowrap sticky top-0 z-20 select-none border-b border-[var(--color-border-subtle)]">
                  <tr>
                    {leftColumns.map((col) => {
                      const meta = columnStylesMap[col.id];
                      const isPinned = pinnedColumns.includes(col.id);
                      return (
                        <th
                          key={col.id}
                          onClick={() => handleTogglePin(col.id)}
                          style={meta?.style}
                          className={`p-3 text-[11px] font-medium border-b border-[var(--color-border-subtle)] cursor-pointer hover:bg-[var(--color-component-hover)] transition-colors group/th ${meta?.thClass || ""}`}
                        >
                          <div className="flex items-center gap-1.5 justify-between">
                            <span>{col.label}</span>
                            <Pin size={11} className={`transition-all ${isPinned ? "text-[var(--color-role-auth)] rotate-45" : "text-[var(--color-text-disabled)] opacity-0 group-hover/th:opacity-100"}`} />
                          </div>
                        </th>
                      );
                    })}
                    
                    {showChart && <DynamicDateHeader generatedDates={generatedDates} />}

                    {rightColumns.map((col) => {
                      const meta = columnStylesMap[col.id];
                      const isPinned = pinnedColumns.includes(col.id);
                      return (
                        <th
                          key={col.id}
                          onClick={() => handleTogglePin(col.id)}
                          style={meta?.style}
                          className={`p-3 text-[11px] font-medium border-b border-[var(--color-border-subtle)] cursor-pointer hover:bg-[var(--color-component-hover)] transition-colors group/th ${meta?.thClass || ""}`}
                        >
                          <div className="flex items-center gap-1.5 justify-between">
                            <span>{col.label}</span>
                            <Pin size={11} className={`transition-all ${isPinned ? "text-[var(--color-role-auth)] rotate-45" : "text-[var(--color-text-disabled)] opacity-0 group-hover/th:opacity-100"}`} />
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-[var(--color-border-subtle)] text-[var(--color-text-main)]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={60} className="p-10 text-center text-xs text-[var(--color-text-disabled)] font-normal italic">
                        No data entries matched the active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item._id} className="hover:bg-[var(--color-component-hover)]/30 transition-colors whitespace-nowrap group">
                        {leftColumns.map((col) => {
                          const meta = columnStylesMap[col.id];
                          return (
                            <td key={col.id} style={meta?.style} className={`p-3 text-xs border-b border-[var(--color-border-subtle)] ${meta?.tdClass || ""}`}>
                              {col.render(item)}
                            </td>
                          );
                        })}

                        {showChart && <DynamicDateCells generatedDates={generatedDates} itemLogHistory={item.logHistory} />}

                        {rightColumns.map((col) => {
                          const meta = columnStylesMap[col.id];
                          return (
                            <td key={col.id} style={meta?.style} className={`p-3 text-xs border-b border-[var(--color-border-subtle)] ${meta?.tdClass || ""}`}>
                              {col.render(item)}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ProductHistoryModal isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} name={selectedItemName} logs={historyLogs} isLoading={loadingHistory} />
        <ProductNoteModal isOpen={noteModalOpen} onClose={() => setNoteModalOpen(false)} role={role} note={selectedNote} noteUser={selectedNoteUser}/>
      </div>
    </div>
  );
}