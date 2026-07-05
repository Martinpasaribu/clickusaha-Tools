"use client";

import Link from "next/link";
import ThemeToggle from "@/components/global/ThemeToggle";

export default function HomePage() {
  const roles = [
    {
      title: "Tukang Bangunan",
      description: "Input Purchase Order (PO) barang baru yang dibutuhkan di lapangan.",
      path: "/tukang",
      icon: "🏗️",
      // 🎨 Menggunakan Token Aksen Tukang (Orange)
      color: "border-brand-tukang/30 hover:bg-brand-tukang/10 text-brand-tukang",
    },
    {
      title: "Supervisor ",
      description: "Memastikan barng di lapangan.",
      path: "/supervisior",
      icon: "🏗️",
      // 🎨 Menggunakan Token Aksen Tukang (Orange)
      color: "border-brand-tukang/30 hover:bg-brand-tukang/10 text-brand-tukang",
    },
    {
      title: "Admin Manager",
      description: "Verifikasi & kecocokan barang yang dibeli dengan fisik di lapangan.",
      path: "/admin",
      icon: "📋",
      // 🎨 Menggunakan Token Aksen Admin (Indigo)
      color: "border-brand-admin/30 hover:bg-brand-admin/10 text-brand-admin",
    },
    {
      title: "Owner (Pemilik)",
      description: "Pantau real-time, edit seluruh data, dan finalisasi pembayaran.",
      path: "/owner",
      icon: "👑",
      // 🎨 Menggunakan Token Aksen Success/Owner (Emerald)
      color: "border-brand-success/30 hover:bg-brand-success/10 text-brand-success",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-main transition-colors duration-200">
      

      {/* Header */}
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-main sm:text-5xl mb-4">
          Data Reconciliation System
        </h1>
        <p className="text-lg text-muted">
          Sistem pembukuan dan pemantauan logistik proyek fisik vs dana pembelian.
          Silakan pilih peran Anda untuk masuk ke sistem.
        </p>
      </div>

      {/* Grid Pilihan Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {roles.map((role) => (
          <Link
            key={role.path}
            href={role.path}
            className={`p-6 bg-card rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex flex-col justify-between ${role.color}`}
          >
            <div>
              <div className="text-4xl mb-4">{role.icon}</div>
              <h2 className="text-xl font-bold mb-2 text-main">
                {role.title}
              </h2>
              <p className="text-sm text-muted">
                {role.description}
              </p>
            </div>
            
            <div className="mt-6 flex items-center justify-end font-semibold text-sm">
              Masuk Dashboard &rarr;
            </div>
          </Link>
        ))}
      </div>

      {/* Footer info tanggal */}
      <footer className="mt-16 text-xs text-disabled">
        Logistik Reconciliation App • Menggunakan Next.js & MongoDB
      </footer>
    </div>
  );
}