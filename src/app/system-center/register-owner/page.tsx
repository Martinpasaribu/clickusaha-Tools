


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ShieldAlert, Eye, EyeOff, X } from "lucide-react";

interface AllocateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterOwner({ isOpen, onClose, onSuccess }: AllocateNodeModalProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    username: "", password: "", name: "", role: "OWNER", businessName: "", databaseName: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/system-center/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Gagal mengalokasikan node.");

      setForm({ username: "", password: "", name: "", role: "OWNER", businessName: "", databaseName: "" });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Kegagalan konfigurasi alokasi data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4 select-none animate-fade-in">
      <div className="w-full max-w-sm bg-card border border-border-subtle rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h3 className="text-xs font-bold font-mono text-main uppercase tracking-widest">
            Allocate Node
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-disabled hover:text-main transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        
        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-[11px] font-mono">
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-brand-error/5 border border-brand-error/20 text-brand-error rounded-lg transition-all">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <span className="leading-normal">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* NAME */}
            <div className="space-y-1">
              <label className="text-disabled font-semibold uppercase tracking-wider">Operator_Name</label>
              <input required disabled={submitting} type="text" placeholder="Nama Operator / Cabang" className="w-full bg-background border border-border-subtle rounded-lg px-3 py-1.5 text-main font-sans text-xs placeholder:text-disabled/40 outline-none focus:border-main focus:ring-1 focus:ring-main" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>

            {/* USERNAME */}
            <div className="space-y-1">
              <label className="text-disabled font-semibold uppercase tracking-wider">Node_Username</label>
              <input required disabled={submitting} type="text" autoComplete="off" placeholder="sys_node_uid" className="w-full bg-background border border-border-subtle rounded-lg px-3 py-1.5 text-main placeholder:text-disabled/40 outline-none focus:border-main focus:ring-1 focus:ring-main" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            </div>

            {/* PASSWORD WITH COMPACT TOGGLE */}
            <div className="space-y-1">
              <label className="text-disabled font-semibold uppercase tracking-wider">Cluster_Passkey</label>
              <div className="relative flex items-center">
                <input required disabled={submitting} type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="w-full bg-background border border-border-subtle rounded-lg pl-3 pr-9 py-1.5 text-main placeholder:text-disabled/40 outline-none focus:border-main focus:ring-1 focus:ring-main" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 p-1 text-disabled hover:text-main transition-colors outline-none">
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* AUTHORITY LEVEL */}
            <div className="space-y-1">
              <label className="text-disabled font-semibold uppercase tracking-wider">Authority_Level</label>
              <select disabled={submitting} className="w-full bg-background border border-border-subtle rounded-lg px-2.5 py-1.5 text-main outline-none focus:border-main focus:ring-1 focus:ring-main" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="OWNER">OWNER (Tenant_Node)</option>
                <option value="ADMIN">ADMIN (Staff_Node)</option>
                <option value="OWNER_SYSTEM">OWNER_SYSTEM (Root_Total)</option>
              </select>
            </div>

            {/* BUSINESS NAME */}
            <div className="space-y-1">
              <label className="text-disabled font-semibold uppercase tracking-wider">Business_Identity</label>
              <input required disabled={submitting} type="text" placeholder="e.g., CIMAHI_PROJECT" className="w-full bg-background border border-border-subtle rounded-lg px-3 py-1.5 text-main placeholder:text-disabled/40 outline-none focus:border-main focus:ring-1 focus:ring-main" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} />
            </div>

            {/* DATABASE NAME */}
            <div className="space-y-1">
              <label className="text-disabled font-semibold uppercase tracking-wider">Target_Database_String</label>
              <input required disabled={submitting} type="text" placeholder="db_inventory_node" className="w-full bg-background border border-border-subtle rounded-lg px-3 py-1.5 text-main placeholder:text-disabled/40 outline-none focus:border-main focus:ring-1 focus:ring-main" value={form.databaseName} onChange={e => setForm({...form, databaseName: e.target.value})} />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle/50">
              <button type="button" disabled={submitting} onClick={onClose} className="px-3 py-1.5 hover:bg-ui-hover text-disabled rounded-lg transition-all">Cancel</button>
              <button type="submit" disabled={submitting} className="px-3 py-1.5 bg-main text-background font-bold rounded-lg hover:opacity-90 transition-all active:scale-[0.99]">
                {submitting ? "Deploying..." : "Execute Allocation"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}