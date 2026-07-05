/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Printer } from "lucide-react";
import InputSupplierModal from "@/components/global/modal/SupplierModal";

export default function SupplierPage() {
  // State untuk kontrol visibilitas Modal dan penampung data edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  
  // State baru untuk menampung data supplier asli dari DB
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi Fetching Data Supplier
  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/suppliers");
      const result = await res.json();
      if (result.success) {
        setSuppliers(result.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat data supplier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Action handler setelah data supplier berhasil disimpan
  const handleSaveSuccess = () => {
    console.log("Data berhasil disimpan! Refresh data...");
    fetchSuppliers(); // Otomatis refresh list tabel
  };

  // Trigger mode "Tambah Baru"
  const handleOpenAddModal = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  // Trigger mode "Edit"
  const handleOpenEditModal = (supplierData: any) => {
    setSelectedSupplier(supplierData);
    setIsModalOpen(true);
  };

  // 🔥 FUNGSI UTAMA UNTUK MENCETAK DATA
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-4 bg-background min-h-screen text-main">
      
      {/* HEADER SECTION - Ditambahkan class 'print:hidden' agar header tidak ikut tercetak */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4 print:hidden">
        <div className="space-y-0.5">
          <h1 className="text-lg font-semibold text-main tracking-tight">Supplier Management</h1>
          <p className="text-xs text-muted">Manage your third-party vendors and bank credentials.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* BUTTON PRINT DATA */}
          <button
            onClick={handlePrint}
            disabled={suppliers.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border-subtle bg-card text-main rounded-lg hover:bg-border-subtle/20 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={14} />
            <span>Print Data</span>
          </button>

          {/* BUTTON ACTION ADD SUPPLIER */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-main text-card rounded-lg hover:opacity-90 shadow-xs transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* JUDUL KHUSUS SAAT DI-PRINT (Hanya muncul di kertas print) */}
      <div className="hidden print:block text-center border-b-2 border-main pb-4 mb-6">
        <h1 className="text-xl font-bold text-black">LAPORAN DATA SUPPLIER</h1>
        <p className="text-sm text-gray-600">Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
      </div>

      {/* RE-RENDER / CONTAINER LIST TABEL SUPPLIER */}
      <div className="overflow-x-auto border border-border-subtle rounded-xl bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted">Memuat data supplier...</div>
        ) : suppliers.length === 0 ? (
          <div className="p-12 text-center text-xs text-disabled">[ Data Supplier Kosong ]</div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-border-subtle/20 border-b border-border-subtle text-muted print:bg-gray-100 print:text-black">
                <th className="p-3 font-medium w-12 text-center">No</th>
                <th className="p-3 font-medium">Nama Supplier</th>
                <th className="p-3 font-medium">Kontak Person</th>
                <th className="p-3 font-medium">No. Telepon</th>
                <th className="p-3 font-medium">Alamat</th>
                <th className="p-3 font-medium">Informasi Bank</th>
                <th className="p-3 font-medium text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {suppliers.map((item, index) => (
                <tr key={item._id} className="hover:bg-border-subtle/5 print:hover:bg-transparent print:text-black">
                  <td className="p-3 text-center text-muted print:text-black">{index + 1}</td>
                  <td className="p-3 font-medium text-main print:text-black">{item.name}</td>
                  <td className="p-3">{item.person || "-"}</td>
                  <td className="p-3">{item.phone || "-"}</td>
                  <td className="p-3 max-w-[200px] truncate print:whitespace-normal">{item.address || "-"}</td>
                  <td className="p-3">
                    {item.bankAccount ? (
                      <div className="space-y-0.5">
                        <p className="font-medium text-main print:text-black">{item.bankAccount.bankName}</p>
                        <p className="text-[11px] text-muted print:text-black">{item.bankAccount.accountNumber} a/n {item.bankAccount.accountHolder}</p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  {/* Kolom Aksi disembunyikan saat di-print */}
                  <td className="p-3 text-center print:hidden">
                    <button 
                      onClick={() => handleOpenEditModal(item)}
                      className="text-blue-500 hover:underline cursor-pointer font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SUB-KOMPONEN MODAL INTEGRATION */}
      <InputSupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={handleSaveSuccess}
        initialData={selectedSupplier}
      />

    </div>
  );
} 