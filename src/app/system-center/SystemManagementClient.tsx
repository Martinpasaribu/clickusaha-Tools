/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Database, Cpu } from "lucide-react";
import RegisterOwner from "./register-owner/page";

export default function SystemManagementClient() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("/api/system-center/users");
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (err) {
      console.error("Cluster query failure", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAllUsers(); 
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Konfirmasi terminasi: Memutus relasi sub-database node terpilih secara permanen. Lanjutkan?")) return;
    try {
      const res = await fetch(`/api/system-center/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) fetchAllUsers();
    } catch (err) {
      alert("Gagal menghapus entitas log.");
    }
  };

  if (loading) {
    return <div className="text-[10px] font-mono tracking-widest text-disabled animate-pulse p-4 uppercase">Syncing Cluster Nodes...</div>;
  }

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Bar Trigger */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-main text-background text-[11px] font-mono font-bold rounded-lg hover:opacity-90 transition-all active:scale-[0.99]"
        >
          <Plus size={13} />
          <span>ALLOCATE NEW NODE</span>
        </button>
      </div>

      {/* CLUSTER DATA WORKSPACE */}
      <div className="w-full bg-card border border-border-subtle rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-ui-hover/40 text-[10px] uppercase tracking-widest text-disabled font-mono">
              <th className="px-5 py-3.5 font-semibold">Node_Identity</th>
              <th className="px-5 py-3.5 font-semibold">Operator_ID</th>
              <th className="px-5 py-3.5 font-semibold">Authority</th>
              <th className="px-5 py-3.5 font-semibold">Cluster_Mapping</th>
              <th className="px-5 py-3.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/60 text-xs text-main">
            {users.map((u: any) => (
              <tr key={u._id} className="hover:bg-ui-hover/20 transition-colors">
                <td className="px-5 py-3.5 font-medium flex items-center gap-2">
                  {u.role === "OWNER_SYSTEM" ? (
                    <Cpu size={13} className="text-main" />
                  ) : (
                    <Database size={13} className="text-disabled" />
                  )}
                  <span className="font-sans text-xs font-medium">{u.name}</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-disabled text-[11px]">{u.username}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono border uppercase tracking-wider ${
                    u.role === "OWNER_SYSTEM" 
                      ? "bg-main/5 border-main/20 text-main font-semibold" 
                      : "bg-ui-hover border-border-subtle text-disabled"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-main/80 text-[11px]">{u.databaseName}</td>
                <td className="px-5 py-3.5 text-right">
                  <button 
                    disabled={u.role === "OWNER_SYSTEM"} 
                    onClick={() => handleDelete(u._id)} 
                    className="p-1.5 rounded-md border border-transparent hover:border-border-subtle hover:bg-card text-disabled hover:text-brand-error disabled:opacity-20 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL COMPONENT (Dipanggil secara terpisah dan ringkas) */}
      <RegisterOwner 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAllUsers}
      />
    </div>
  );
}