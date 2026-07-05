/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Boxes, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/components/global/ThemeToggle";
import Toast, { ToastType } from "@/components/global/Toast";
import GlobalLoadingModal from "@/components/global/GlobalLoadingProvider";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 State untuk show/hide password
  const [loading, setLoading] = useState(false);
  
  const [loadingConfig, setLoadingConfig] = useState({
    title: "Autentikasi",
    description: "Memverifikasi hak akses sistem..."
  });
  
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("User ID dan Password wajib diisi", "error");
      return;
    }

    setLoadingConfig({
      title: "Autentikasi",
      description: "Memverifikasi akun..."
    });
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
      });

      if (result?.error) {
        throw new Error(`Kredensial tidak valid : ${result?.error}`);
      }

      setLoadingConfig({
        title: "Sinkronisasi",
        description: "Membuka enkripsi dashboard..."
      });
      
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role?.toLowerCase();

      if (role) {
        setTimeout(() => {
          router.push(`/${role}`);
        }, 800); 
      } else {
        throw new Error("Hak akses gagal diidentifikasi");
      }

    } catch (error: any) {
      showToast(error.message || "Gagal masuk ke sistem", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-main transition-colors duration-200">
      
      {/* Top Header Control */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-[380px] flex flex-col space-y-7">
        
        {/* BRANDING LOGO & CORE TITLE */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center h-10 w-10 bg-ui-hover rounded-xl border border-border-subtle mb-3 select-none">
            <Boxes size={18} strokeWidth={2.2} className="text-muted" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-main font-sans">
            Rekap Barang
          </h1>
          <p className="text-xs text-disabled mt-1 font-medium">
            Sistem Logistik & Inventori Multi-Tenant
          </p>
        </div>

        {/* INTERACTION FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* USERNAME FIELD */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-disabled uppercase tracking-wider">
              User ID
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-border-subtle bg-card text-main placeholder:text-disabled/60 outline-none focus:border-main focus:ring-1 focus:ring-main disabled:opacity-50 transition-all"
            />
          </div>

          {/* PASSWORD FIELD WITH TOGGLE VIEW */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-disabled uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2 text-xs rounded-lg border border-border-subtle bg-card text-main placeholder:text-disabled/60 outline-none focus:border-main focus:ring-1 focus:ring-main disabled:opacity-50 transition-all"
              />
              <button
                type="button"
                tabIndex={-1}
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 rounded text-disabled hover:text-main transition-colors outline-none"
              >
                {showPassword ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {/* SUBMIT TRIGGER */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-main text-background hover:opacity-90 active:scale-[0.99] disabled:opacity-50 font-semibold text-xs rounded-lg transition-all flex items-center justify-center"
            >
              {loading ? "Memproses..." : "Masuk Aplikasi"}
            </button>
          </div>
        </form>
        
      </div>

      {/* COMPACT CLEAN FOOTER */}
      <footer className="absolute bottom-6 text-[10px] font-mono text-disabled select-none tracking-normal">
        v4.0.0 • enterprise secure
      </footer>

      <GlobalLoadingModal 
        isOpen={loading}
        type="auth"
        title={loadingConfig.title}
        description={loadingConfig.description}
      />

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