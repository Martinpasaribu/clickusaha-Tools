"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import GlobalLoadingModal from "../GlobalLoadingProvider";

interface LogoutButtonProps {
  onBeforeLogout?: () => void;
}

export default function LogoutButton({ onBeforeLogout }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleLogout = async () => {
    setLoading(true);
    setIsLoggingOut(true);
    
    // ❌ JANGAN panggil onBeforeLogout() di sini karena akan menghancurkan komponen ini.
    // Biarkan dropdown tetap terbuka di background tertutup overlay loading hitam.
    
    try {
      const data = await signOut({ redirect: false, callbackUrl: "/auth/login" });
      
      // Detik-detik sebelum page reload, baru aman jika ingin menyembunyikan dropdown
      if (onBeforeLogout) onBeforeLogout();
      
      window.location.href = data.url;
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-error hover:bg-brand-error/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
      >
        <LogOut size={14} />
        <span>{isLoggingOut ? "Mengeluarkan..." : "Keluar Aplikasi"}</span>
      </button>
  
      {/* Tidak perlu dipungkus `createPortal` atau `{loading && ...}` lagi di sini, 
        karena komponen GlobalLoadingModal terbaru Anda sudah mengisolasi portal 
        dan render `document.body` di dalam dirinya sendiri secara otomatis.
      */}
      <GlobalLoadingModal 
        isOpen={loading}
        type="logout"
        title="Keluar"
        description="Sedang membersihkan assets..."
      />
    </>
  );
}