import { getAuthUser } from "@/lib/auth-check";
import { redirect } from "next/navigation";
import OwnerDashboardClient from "./Dashboard";

export default async function OwnerDashboard() {
  const user = await getAuthUser();
  
  // Proteksi halaman di tingkat server
  if (!user || user.role !== "OWNER") redirect("/auth/login");

  return (
    <div className="min-h-screen bg-background text-main transition-colors duration-200">
      {/* 🌌 INNER CONTAINER (Padding diperkecil agar minimalis sesuai rencana awal) */}
      <div className="max-w-full mx-auto p-4 sm:p-6 space-y-5">
        
        {/* 📦 CLIENT INTERACTIVE CONTENT CONTAINER */}
        {/* Kita pindahkan PageHeader ke dalam komponen ini */}
        <OwnerDashboardClient />

      </div>
    </div>
  );
}