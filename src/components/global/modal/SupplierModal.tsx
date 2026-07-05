/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { X, Building2, User, Phone, MapPin, CreditCard } from "lucide-react";

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface SupplierFormState {
  name: string;
  person: string;
  phone: string;
  address: string;
  bankAccount: BankAccount;
  isActive: boolean;
}

interface InputSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  initialData?: any;
}

const initialFormState: SupplierFormState = {
  name: "",
  person: "",
  phone: "",
  address: "",
  bankAccount: {
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  },
  isActive: true,
};

export default function InputSupplierModal({ isOpen, onClose, onSaveSuccess, initialData }: InputSupplierModalProps) {
  const [formData, setFormData] = useState<SupplierFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        person: initialData.person || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        bankAccount: {
          bankName: initialData.bankAccount?.bankName || "",
          accountNumber: initialData.bankAccount?.accountNumber || "",
          accountHolder: initialData.bankAccount?.accountHolder || "",
        },
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData(initialFormState);
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankAccount: { ...prev.bankAccount, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Supplier Name wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const url = "/api/suppliers";
      const method = initialData?._id ? "PUT" : "POST";
      const payload = initialData?._id ? { id: initialData._id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!resData.success) {
        throw new Error(resData.message || "Terjadi kesalahan saat menyimpan data.");
      }

      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyambungkan ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-card border border-border-subtle rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-brand-auth" />
            <h3 className="text-sm font-semibold text-main">
              {initialData ? "Edit Supplier Data" : "Add New Supplier"}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-md hover:bg-ui-hover text-disabled transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-2.5 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-md font-medium">
              {error}
            </div>
          )}

          {/* Supplier Name */}
          <div className="space-y-1">
            <label className="font-medium text-muted">Supplier Name <span className="text-brand-error">*</span></label>
            <div className="relative">
              <Building2 size={14} className="absolute left-3 top-2.5 text-disabled" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., PT. Sukses Mandiri"
                className="w-full pl-9 pr-3 py-2 border border-border-strong rounded-md bg-background text-main focus:outline-hidden focus:border-brand-auth transition-all"
                required
              />
            </div>
          </div>

          {/* Grid: Contact & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-muted">Contact Person</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-2.5 text-disabled" />
                <input
                  type="text"
                  name="person"
                  value={formData.person}
                  onChange={handleChange}
                  placeholder="e.g., Pak Budi"
                  className="w-full pl-9 pr-3 py-2 border border-border-strong rounded-md bg-background text-main focus:outline-hidden focus:border-brand-auth transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-muted">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-2.5 text-disabled" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 08123456789"
                  className="w-full pl-9 pr-3 py-2 border border-border-strong rounded-md bg-background text-main focus:outline-hidden focus:border-brand-auth transition-all"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="font-medium text-muted">Address</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-2.5 text-disabled" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address details..."
                rows={2}
                className="w-full pl-9 pr-3 py-2 border border-border-strong rounded-md bg-background text-main focus:outline-hidden focus:border-brand-auth transition-all resize-none"
              />
            </div>
          </div>

          {/* BANK ACCOUNT SECTION */}
          <div className="p-3 border border-border-subtle rounded-lg bg-background/40 space-y-3">
            <div className="flex items-center gap-1.5 font-medium text-main border-b border-border-subtle pb-1.5">
              <CreditCard size={14} className="text-muted" />
              <span>Bank Account Information (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankAccount.bankName}
                  onChange={handleBankChange}
                  placeholder="BCA / Mandiri"
                  className="w-full px-2.5 py-1.5 border border-border-strong rounded-md bg-background text-main focus:outline-hidden focus:border-brand-auth transition-all"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-[11px] text-muted">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.bankAccount.accountNumber}
                  onChange={handleBankChange}
                  placeholder="Account Number"
                  className="w-full px-2.5 py-1.5 border border-border-strong rounded-md bg-background text-main focus:outline-hidden focus:border-brand-auth transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted">Account Holder Name (Atas Nama)</label>
              <input
                type="text"
                name="accountHolder"
                value={formData.bankAccount.accountHolder}
                onChange={handleBankChange}
                placeholder="e.g., PT. Sukses Mandiri"
                className="w-full px-2.5 py-1.5 border border-border-strong rounded-md bg-background text-main focus:outline-hidden focus:border-brand-auth transition-all"
                />
            </div>
          </div>

          {/* IsActive Status Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-medium text-muted">Supplier Status</span>
              <span className="text-[11px] text-disabled">Active suppliers can be selected for order processes.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-border-strong rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-success"></div>
            </label>
          </div>
        </form>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-3 border-t border-border-subtle bg-background/30">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 font-medium border border-border-subtle rounded-md text-muted hover:bg-ui-hover transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-1.5 font-medium bg-main text-card rounded-md hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Supplier"}
          </button>
        </div>

      </div>
    </div>
  );
}