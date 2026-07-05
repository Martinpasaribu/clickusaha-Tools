/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Terminal, ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";

export default function SystemCenterLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 State view password
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error("Kredensial sistem tidak valid");
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role !== "OWNER_SYSTEM") {
        setError("Akses Ditolak: Hak akses Root tidak terdeteksi.");
        setLoading(false);
        return;
      }

      router.push("/system-center");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Kegagalan otentikasi gerbang utama.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 select-none">
      
      {/* Container Padat ala Konsol Industrial */}
      <div className="w-full max-w-[360px] flex flex-col space-y-6">
        
        {/* Header / Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-2.5 bg-ui-hover rounded-lg border border-border-subtle text-main">
            <Terminal size={18} strokeWidth={2} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xs font-bold tracking-widest font-mono text-main uppercase">
              System Core Access
            </h1>
            <p className="text-[10px] text-disabled font-mono uppercase tracking-wider">
              Root Authentication Gateway
            </p>
          </div>
        </div>

        {/* Notifikasi Error Ringkas */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-brand-error/5 border border-brand-error/20 text-brand-error text-[11px] font-mono rounded-lg transition-all">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        {/* Form Login Terminal Style */}
        <form onSubmit={handleLogin} className="space-y-4 text-[11px] font-mono">
          
          {/* USERNAME */}
          <div className="space-y-1.5">
            <label className="text-disabled font-semibold tracking-wider uppercase">
              Operator_ID
            </label>
            <input
              required
              disabled={loading}
              type="text"
              autoComplete="off"
              placeholder="SYS_ADMIN_UID"
              className="w-full bg-card border border-border-subtle rounded-lg px-3 py-2 text-main font-mono placeholder:text-disabled/40 outline-none transition-all focus:border-main focus:ring-1 focus:ring-main"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* PASSWORD WITH COMPACT TOGGLE */}
          <div className="space-y-1.5">
            <label className="text-disabled font-semibold tracking-wider uppercase">
              Root_Passkey
            </label>
            <div className="relative flex items-center">
              <input
                required
                disabled={loading}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full bg-card border border-border-subtle rounded-lg pl-3 pr-9 py-2 text-main font-mono placeholder:text-disabled/40 outline-none transition-all focus:border-main focus:ring-1 focus:ring-main"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 p-1 rounded text-disabled hover:text-main transition-colors outline-none"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {/* BUTTON ACTIONS */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 bg-main text-background hover:opacity-90 disabled:opacity-50 font-mono text-[11px] font-bold rounded-lg transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>INITIALIZING...</span>
                </>
              ) : (
                <span>INITIALIZE ACCESS</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-[9px] text-disabled font-mono uppercase tracking-wider">
            Cluster node v4.0.26 • secure link
          </p>
        </div>

      </div>
    </div>
  );
}