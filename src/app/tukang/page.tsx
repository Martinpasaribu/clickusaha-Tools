/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/global/Modal"; 
import Toast, { ToastType } from "@/components/global/Toast";
import MasterBarangForm from "@/components/shared/MasterBarangForm";
// ➕ Import komponen tabel global terpadu kita
import MasterReconciliationTable from "@/components/shared/MasterReconciliationTable";
import GlobalLoadingModal from "@/components/global/GlobalLoadingProvider";
import InputSupplierModal from "@/components/global/modal/SupplierModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/lib/hooks/useAuth";
import { MiniMetrics } from "@/components/shared/MiniMetrics";

// Definisikan interface baru dengan properti Full Bahasa Inggris sesuai Skema MongoDB
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

export default function TukangDashboard() {
  const [barangList, setBarangList] = useState<ReconciliationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<ReconciliationItem | null>(null);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false, message: "", type: "info"
  });

  const {
    user,
    isAdmin,
    isOwner,
    isAuthenticated,
  } = useAuth();

  const syncDataRealtime = async () => {
    try {
      const res = await fetch("/api/barang");
      const resData = await res.json();
      if (resData.success) setBarangList(resData.data);
    } catch (err) {
      console.error("Gagal sinkronisasi data real-time", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Panggil fungsi secara aman
    const fetchData = async () => {
      await syncDataRealtime();
    };
    
    fetchData();

    const interval = setInterval(syncDataRealtime, 4000); 
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (data: any) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/barang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setToast({ show: true, message: "Sukses Menambah PO Baru!", type: "success" });
        setIsAddOpen(false);
        syncDataRealtime();
      }
    } catch (e) {
      setToast({ show: true, message: "Gagal memproses pengajuan", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

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
        setToast({ show: true, message: "Sukses memperbarui PO!", type: "success" });
        setIsEditOpen(false);
        setSelectedBarang(null);
        syncDataRealtime();
      }
    } catch (e) {
      setToast({ show: true, message: "Gagal menyimpan perubahan", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const totalCost = barangList.reduce((acc, item) => acc + (item.totalInvoice || 0), 0);
  const totalDebt = barangList.reduce((acc, item) => acc + (item.remainingPayment || 0), 0);


return (
<div className="min-h-screen bg-background text-main transition-colors duration-200">
      
      {/* 🌌 INNER CONTAINER (Padding vertikal dikurangi dari p-6/sm:p-10 menjadi p-4/sm:p-6, gap antar elemen dipersempit) */}
      <div className="max-w-full mx-auto p-4 sm:p-6 space-y-5">
        
        {/* HEADER SECTION (Lebih compact, inline, tanpa deskripsi panjang) */}
        <PageHeader role="TUKANG" onAddClick={() => setIsAddOpen(true)}/>

        {/* 📊 MINI METRICS BANNER (Sangat Minimalis: Berupa baris horizontal tipis, bukan kotak besar) */}
        {/* <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2 px-4 bg-card/50 border border-border-subtle rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted font-medium">Total PO:</span>
            <span className="font-black text-main">{barangList.length} <span className="text-[10px] font-normal text-muted">Item</span></span>
          </div>
          <div className="w-px h-3 bg-border-subtle hidden sm:block" /> 
          
          <div className="flex items-center gap-2">
            <span className="text-muted font-medium">Pending:</span>
            <span className="font-black text-brand-tukang">
              {barangList.filter(i => i.status === "MENUNGGU_PO").length} <span className="text-[10px] font-normal text-muted">Item</span>
            </span>
          </div>
          <div className="w-px h-3 bg-border-subtle hidden sm:block" /> 

          <div className="flex items-center gap-2">
            <span className="text-muted font-medium">Dibatalkan/Dibeli:</span>
            <span className="font-black text-brand-auth">
              {barangList.filter(i => i.status === "DIBELI").length} <span className="text-[10px] font-normal text-muted">Item</span>
            </span>
          </div>
          <div className="w-px h-3 bg-border-subtle hidden sm:block" /> 

          <div className="flex items-center gap-2">
            <span className="text-muted font-medium">Di Lapangan:</span>
            <span className="font-black text-brand-success">
              {barangList.filter(i => i.status === "DITERIMA_LAPANGAN").length} <span className="text-[10px] font-normal text-muted">Item</span>
            </span>
          </div>
        </div> */}

        <MiniMetrics 
          role="TUKANG" 
          data={barangList} 
          totalCost={totalCost} 
          totalDebt={totalDebt} 
        />


        {/* 📦 DATA SECTION (TABEL UTAMA) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-muted uppercase tracking-wider">Daftar Rekonsiliasi Material</h2>
            <span className="text-[10px] text-disabled italic">Auto-refresh 4s</span>
          </div>

          {loading ? (
            <div className="bg-card border border-border-subtle rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-5 h-5 border-2 border-brand-auth/20 border-t-brand-auth rounded-full animate-spin mb-2"></div>
              <p className="text-[11px] font-medium text-muted tracking-wide animate-pulse">Menghubungkan ke database real-time...</p>
            </div>
          ) : (
            <div className="shadow-sm rounded-xl border border-border-subtle overflow-hidden">
              <MasterReconciliationTable 
                role={user.role}
                data={barangList} 
                onEditClick={(item) => {
                  setSelectedBarang(item);
                  setIsEditOpen(true);
                }}
              />
            </div>
          )}
        </div>

      </div>

      {/* 1. Modal Tambah PO */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Ajukan PO Baru">
        <MasterBarangForm role={user.role} onSubmit={handleCreate} loading={actionLoading} />
      </Modal>

      {/* 2. Modal Edit PO */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedBarang(null); }} title="Ubah Dokumen PO">
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

      <GlobalLoadingModal 
        isOpen={loading}
        type="tukang"
        title={'Memuat Tabel Data..'}
        description={'Sedang memuat data log history untuk kalender, mohon tunggu sebentar..'}
      />
      
    </div>
  );
}