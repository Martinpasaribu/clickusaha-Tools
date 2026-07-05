/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "@/components/global/Modal"; 
import Toast, { ToastType } from "@/components/global/Toast";
import MasterBarangForm from "@/components/shared/MasterBarangForm";
import MasterReconciliationTable from "@/components/shared/MasterReconciliationTable";
import { useAuth } from "@/lib/hooks/useAuth";
import { Maximize2, Minimize2 } from "lucide-react";
import { MiniMetrics } from "@/components/shared/MiniMetrics";

// Definisikan interface dengan properti Bahasa Inggris yang sinkron dengan tabel global
interface ReconciliationItem {
  _id: string;
  name: string;
  unit: string;
  initialQty: number;
  receivedQty: number;
  finalQty: number;
  status: string;
  manualDate: string;
  note?: string;
  supplier_id?: string;
  pricePerUnit?: number;
  totalInvoice?: number;
  remainingPayment?: number;
}

export default function AdminDashboard() {
  


  const [barangList, setBarangList] = useState<ReconciliationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modal State Triggers (Hanya perlu Edit/Verify untuk Admin)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<ReconciliationItem | null>(null);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false, message: "", type: "info"
  });


  const syncDataRealtime = async () => {
    try {
      const res = await fetch("/api/barang");
      const resData = await res.json();
      if (resData.success) setBarangList(resData.data);
    } catch (err) {
      console.error("Gagal sinkronisasi data logistik real-time", err);
    } finally {
      setLoading(false);
    }
  };

  // Mekanisme Short-Polling data real-time berkala setiap 4 detik
  useEffect(() => {
    syncDataRealtime();
    const interval = setInterval(syncDataRealtime, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async (data: any) => {
    if (!selectedBarang) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/barang", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedBarang._id, ...data }),
      });
      if (res.ok) {
        setToast({ show: true, message: "Sukses memverifikasi data logistik!", type: "success" });
        setIsEditOpen(false);
        setSelectedBarang(null);
        syncDataRealtime();
      } else {
        throw new Error("Gagal memperbarui data");
      }
    } catch (e) {
      setToast({ show: true, message: "Gagal menyimpan perubahan verifikasi", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };


  const {
    user,
    isAdmin,
    isOwner,
    isAuthenticated,
  } = useAuth();

  if (!isAuthenticated) return null;

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
        const res = await fetch("/api/barang", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        });

        const result = await res.json();

        if (res.ok && result.success) {
        setToast({ show: true, message: "Data rekonsiliasi berhasil dihapus!", type: "success" });
        syncDataRealtime(); // Muat ulang tabel secara realtime
        } else {
        throw new Error(result.error || "Gagal menghapus");
        }
    } catch (error: any) {
        setToast({ show: true, message: error.message || "Gagal memproses penghapusan", type: "error" });
    } finally {
        setActionLoading(false);
    }
  };

  // 🧮 KONTROL AGREGASI KEUANGAN REAL-TIME UNTUK OWNER
  const totalCost = barangList.reduce((acc, item) => acc + (item.totalInvoice || 0), 0);
  const totalDebt = barangList.reduce((acc, item) => acc + (item.remainingPayment || 0), 0);

  
  return (
    <div className="min-h-screen bg-background text-main transition-colors duration-200">
      
      {/* 🌌 INNER CONTAINER (Padding vertikal dikurangi agar langsung fokus ke tabel) */}
      <div className="max-w-full mx-auto p-4 sm:p-6 space-y-5">
        
        {/* HEADER SECTION (Lebih compact, judul inline dengan badge status) */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight text-main sm:text-2xl">
              Verifikasi & Manifest
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-admin/10 border border-brand-admin/20 text-[10px] font-bold text-brand-admin select-none/80">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-admin animate-pulse"></span>
              Audit Active
            </div>
          </div>

        </div> */}

        {/* 📊 AUDIT METRICS BANNER (Sangat Minimalis: Flex row horizontal, menghemat ratusan pixel ruang vertikal) */}
        <MiniMetrics 
          role="ADMIN" 
          data={barangList} 
          totalCost={totalCost} 
          totalDebt={totalDebt} 
        />

        {/* 📦 TABEL DATA UTAMA */}
        <div className="space-y-2">


          {loading ? (
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Lembar Kendali Rekonsiliasi
              </h2>

                <span className="text-[10px] text-disabled italic">
                  Sync Active
                </span>

            </div>

            ) : (

            <div
              ref={tableContainerRef}
              className={`
                shadow-sm border border-border-subtle overflow-hidden bg-background
                ${isFullscreen ? "w-screen h-screen p-4" : "rounded-xl"}
              `}
            >
              <div className={isFullscreen ? "h-full flex flex-col" : ""}>
                <MasterReconciliationTable
                  role={user.role}
                  data={barangList}
                  onEditClick={(item) => {
                    setSelectedBarang(item);
                    setIsEditOpen(true);
                  }}
                  onDeleteClick={handleDelete}
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal Verifikasi Dokumen Masuk */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={() => { setIsEditOpen(false); setSelectedBarang(null); }} 
        title="Verifikasi Material & Supplier Lapangan"
      >
        {selectedBarang && (
          <MasterBarangForm
            role={user.role}
            initialData={selectedBarang}
            onSubmit={handleUpdate}
            loading={actionLoading}
          />
        )}
      </Modal>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>
  );
}