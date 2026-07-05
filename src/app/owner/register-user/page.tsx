/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast, { ToastType } from "@/components/global/Toast";

export default function RegisterUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TUKANG");
  const [loading, setLoading] = useState(false);

  // State untuk Custom Toast kita
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, role }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mendaftarkan user");
      }

      showToast(result.message, "success");
      
      // Reset Form jika sukses
      setName("");
      setUsername("");
      setPassword("");
      setRole("TUKANG");

    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-main transition-colors duration-200">
      
      {/* 🌌 INNER CONTAINER (Membatasi lebar agar proporsional dan tidak melar) */}
      <div className="max-w-2xl mx-auto p-6 sm:p-10 space-y-6 flex flex-col justify-center min-h-screen">
        
        {/* TOMBOL NAVIGASI KEMBALI (Minimalis, Menggunakan Tombol Aksi Kapsul Tanpa Underline AI Kaku) */}
        <div className="flex justify-start">
          <Link 
            href="/owner" 
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-muted bg-ui-hover border border-border-subtle rounded-xl hover:text-main transition-all active:scale-98"
          >
            ← Kembali ke Dashboard Executive
          </Link>
        </div>

        {/* CONTAINER UTAMA KARTU REGISTRASI */}
        <div className="bg-card border border-border-subtle rounded-2xl p-8 shadow-xl space-y-8">
          
          {/* HEADER DOKUMEN */}
          <div className="pb-4 border-b border-border-subtle">
            <h1 className="text-xl font-black tracking-tight text-main sm:text-2xl">
              Registrasi Kredensial Anggota
            </h1>
            <p className="text-xs text-muted mt-1 font-medium">
              Otoritas Pemilik: Daftarkan akun personel baru untuk mengelola node logistik lapangan.
            </p>
          </div>

          {/* FORM ISIAN */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* GRIDS 1: Nama Lengkap & Username Berdampingan agar Hemat Ruang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                  Nama Lengkap Anggota
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Subarjo"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-transparent text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:opacity-50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                  User ID (Login Username)
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: tukang_ahmad"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-transparent text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:opacity-50 transition-all font-medium"
                />
              </div>
            </div>

            {/* GRIDS 2: Password & Pilihan Tingkat Hak Akses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                  Kata Sandi Akses
                </label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-transparent text-main placeholder:text-disabled outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:opacity-50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                  Tingkat Hak Akses (Role)
                </label>
                <select
                  disabled={loading}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:opacity-50 transition-all font-bold"
                >
                  <option value="TUKANG">Lapangan / Tukang (Input PO)</option>
                  <option value="SUPERVISOR">Penanggung Jawab Lapangan (Verifikasi Item)</option>
                  <option value="ADMIN">Audit / Admin Manager (Verifikasi)</option>
                  <option value="OWNER">Executive / Owner (Akses Penuh)</option>
                </select>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-4 border-t border-border-subtle flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-main text-card hover:opacity-90 active:scale-98 disabled:opacity-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? "Mendaftarkan Anggota..." : "Sahkah & Daftarkan Akun"}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Render Toast Kustom */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}