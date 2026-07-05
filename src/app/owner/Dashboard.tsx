/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ➕ Ditambahkan untuk navigasi PageHeader
import Modal from "@/components/global/Modal"; 
import Toast, { ToastType } from "@/components/global/Toast";
import MasterBarangForm from "@/components/shared/MasterBarangForm";
import MasterReconciliationTable from "@/components/shared/MasterReconciliationTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { MiniMetrics } from "@/components/shared/MiniMetrics";
import { useAuth } from "@/lib/hooks/useAuth";


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

export default function OwnerDashboardClient() {
  const router = useRouter(); // ➕ Inisialisasi router
  const [barangList, setBarangList] = useState<ReconciliationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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
      console.error("Gagal sinkronisasi data finansial owner", err);
    } finally {
      setLoading(false);
    }
  };

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
        setToast({ show: true, message: "Aksi otorisasi finalisasi data sukses!", type: "success" });
        setIsEditOpen(false);
        setSelectedBarang(null);
        syncDataRealtime();
      }
    } catch (e) {
      setToast({ show: true, message: "Gagal memproses otorisasi perubahan", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/barang", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setToast({ show: true, message: "Manifes terhapus permanen dari sistem!", type: "success" });
        syncDataRealtime();
      }
    } catch (e) {
      setToast({ show: true, message: "Gagal menghapus data", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // 🧮 KONTROL AGREGASI KEUANGAN REAL-TIME UNTUK OWNER
  const totalCost = barangList.reduce((acc, item) => acc + (item.totalInvoice || 0), 0);
  const totalDebt = barangList.reduce((acc, item) => acc + (item.remainingPayment || 0), 0);

  return (
    <div className="space-y-5"> {/* 🪄 Diubah dari space-y-8 menjadi space-y-5 agar lebih minimalis */}
      
      {/* ➕ COMPONENT HEADER (Sekarang dirender dengan benar) */}
      <PageHeader 
        role="OWNER" 
        onAddClick={() => router.push("/owner/register-user")} 
      />

      {/* 📊 COMPONENT METRICS */}
      <MiniMetrics 
        role="OWNER" 
        data={barangList} 
        totalCost={totalCost} 
        totalDebt={totalDebt} 
      />

      {/* 📦 MAIN DATA TABLE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-bold text-muted uppercase tracking-wider">Rekonsiliasi & Finalisasi Pembayaran</h2>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-success/10 text-[10px] font-bold text-brand-success">
            <span className="w-1 h-1 rounded-full bg-brand-success animate-pulse"></span>
            Live Ledger Sync
          </div>
        </div>

        {loading ? (
          <div className="bg-card border border-border-subtle rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-5 h-5 border-2 border-brand-success/20 border-t-brand-success rounded-full animate-spin mb-2"></div>
            <p className="text-[11px] font-medium text-muted tracking-wide animate-pulse">Sinkronisasi buku kas besar proyek...</p>
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
              onDeleteClick={handleDelete}
            />
          </div>
        )}
      </div>

      {/* MODAL EDIT / FINALISASI PEMBAYARAN */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={() => { setIsEditOpen(false); setSelectedBarang(null); }} 
        title="Otorisasi & Manajemen Rekonsiliasi Final"
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