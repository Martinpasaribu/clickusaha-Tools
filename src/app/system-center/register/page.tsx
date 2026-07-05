/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, ShieldAlert, CheckCircle2, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SystemCenterRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 State view password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/system-center/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Gagal melakukan registrasi node baru.");
      }

      setSuccess(true);
      setName("");
      setUsername("");
      setPassword("");
      
      setTimeout(() => {
        router.push("/system-center/login");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Kegagalan komunikasi kluster sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 select-none">
      
      {/* Container Padat Konsol Flat */}
      <div className="w-full max-w-[360px] flex flex-col space-y-6">
        
        {/* Header / Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-2.5 bg-ui-hover rounded-lg border border-border-subtle text-main">
            <Cpu size={18} strokeWidth={2} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xs font-bold tracking-widest font-mono text-main uppercase">
              Register Root Node
            </h1>
            <p className="text-[10px] text-disabled font-mono uppercase tracking-wider">
              Deploy new OWNER_SYSTEM operator
            </p>
          </div>
        </div>

        {/* Notifikasi Status Ringkas */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-brand-error/5 border border-brand-error/20 text-brand-error text-[11px] font-mono rounded-lg transition-all">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 p-3 bg-ui-hover border border-border-subtle text-main text-[11px] font-mono rounded-lg transition-all">
            <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-main" />
            <span className="leading-normal">Inisialisasi sukses. Mengalihkan...</span>
          </div>
        )}

        {/* Form Register Terminal Style */}
        <form onSubmit={handleRegister} className="space-y-4 text-[11px] font-mono">
          
          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label className="text-disabled font-semibold tracking-wider uppercase">
              Operator_Full_Name
            </label>
            <input
              required
              disabled={loading || success}
              type="text"
              placeholder="NAMA LENGKAP"
              className="w-full bg-card border border-border-subtle rounded-lg px-3 py-2 text-main font-sans text-xs placeholder:text-disabled/40 outline-none transition-all focus:border-main focus:ring-1 focus:ring-main"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* USERNAME */}
          <div className="space-y-1.5">
            <label className="text-disabled font-semibold tracking-wider uppercase">
              System_Username
            </label>
            <input
              required
              disabled={loading || success}
              type="text"
              autoComplete="off"
              placeholder="NEW_OPERATOR_UID"
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
                disabled={loading || success}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full bg-card border border-border-subtle rounded-lg pl-3 pr-9 py-2 text-main font-mono placeholder:text-disabled/40 outline-none transition-all focus:border-main focus:ring-1 focus:ring-main"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                disabled={loading || success}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 p-1 rounded text-disabled hover:text-main transition-colors outline-none"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 py-2 bg-main text-background hover:opacity-90 disabled:opacity-50 font-mono text-[11px] font-bold rounded-lg transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>DEPLOYING...</span>
                </>
              ) : (
                <span>REGISTER OPERATOR</span>
              )}
            </button>
          </div>
        </form>

        {/* Back Link Nav - Clean Minimal */}
        <div className="text-center pt-3 border-t border-border-subtle/50">
          <Link 
            href="/system-center/login" 
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-disabled hover:text-main transition-colors"
          >
            <ArrowLeft size={11} />
            <span>Kembali ke login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}