/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import InputName from "../global/form/InputName";
import InputQty from "../global/form/InputQty";
import InputDateToggle from "../global/form/InputDateToggle";
import InputNote from "../global/form/InputNote";
import InputStatus from "../global/form/InputStatus";
import InputPrice from "../global/form/InputPrice";
import InputUnitType from "../global/form/InputUnitType";
import InputSupplierSelect from "../global/form/InputSupplierSelect";
import InputReceivedDate from "../global/form/InputReceivedDate";
import { NoteUser } from "@/types/schema";
import InputNoteRole from "../global/form/InputNoteRole";
import { getRoleField } from "@/constants";

interface MasterFormProps {
  role: "TUKANG" | "ADMIN" | "OWNER" | "SUPERVISOR";
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function MasterBarangForm({ role, initialData, onSubmit, loading }: MasterFormProps) {
  // ==========================================
  // STATE MATCHING THE NEW ENGLISH RECONCILIATION ITEM SCHEMA
  // ==========================================
  const [name, setName] = useState("");
  const [unitType, setUnitType] = useState("pcs");
  
  // Supplier Relationships
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [manualSupplierName, setManualSupplierName] = useState("");

  // Logistics & Quantity
  const [initialUnit, setInitialUnit] = useState(0);
  const [receivedUnit, setReceivedUnit] = useState(0);
  const [finalUnit, setFinalUnit] = useState(0);
  const [receivedDate, setReceivedDate] = useState<any[]>([]);

  // Financial Aspects & Pricing
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  
  // Financial Dates & Deadlines (Format: YYYY-MM-DD for HTML input validation)
  const [dueDate, setDueDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const [itemStatus, setItemStatus] = useState<"MENUNGGU_PO" | "DIBELI" | "DALAM_PENGIRIMAN" | "DITERIMA_LAPANGAN" | "SUDAH_DIBAYAR"| "DIREFUND" | "DIBATALKAN" | "PAID" | "PENDING_VERIFIKASI" | "PENGECEKAN_BARANG" |"SELESAI">("MENUNGGU_PO");
  const [note, setNote] = useState("");
  const [noteUser, setNoteUser] = useState<NoteUser>({
  owner: "",
  admin: "",
  supervisor: "",
  tukang: "",
});

  const currentRoleField: keyof NoteUser = getRoleField(role);

  // Dual Date Logic
  const [isManualDate, setIsManualDate] = useState(false);
  const [manualDate, setManualDate] = useState("");

  // ==========================================
  // SYNC INITIAL DATA (Reading existing data during Edit mode)
  // ==========================================

    useEffect(() => {
    if (initialData) {
        setName(initialData.name || "");
        setUnitType(initialData.unit || "pcs");
        setSupplierId(initialData.supplierId ? initialData.supplierId.toString() : null);
        setManualSupplierName(initialData.supplier_id?._id || "");
        
        setInitialUnit(initialData.initialQty || 0);
        setReceivedUnit(initialData.receivedQty || 0);
        setFinalUnit(initialData.finalQty || 0);
        
        setPricePerUnit(initialData.pricePerUnit || 0);
        setDownPayment(initialData.downPayment || 0);
        setTotalPayment(initialData.totalPayment || 0);
        setReceivedDate(initialData.receivedDate || []);
        
        setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : "");
        setPaymentDate(initialData.paymentDate ? new Date(initialData.paymentDate).toISOString().split("T")[0] : "");
        
        setItemStatus(initialData.status || "");
        setNote(initialData.note || "");
        setNoteUser({
          owner: "",
          admin: "",
          supervisor: "",
          tukang: "",
          ...(initialData.noteUser || {}),
        });

        // SINKRONISASI DI MODE EDIT: Ambil tanggal + jam yang sudah ada di database
        if (initialData.manualDate) {
        setIsManualDate(true);
        setManualDate(new Date(initialData.manualDate).toISOString().slice(0, 16)); 
        } else {
        // Fallback aman jika data lama kebetulan tidak punya manualDate
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setManualDate(now.toISOString().slice(0, 16));
        }
    } else {
        // ===================================================================
        // 🔥 PERBAIKAN UNTUK DATA BARU: Otomatis set Tanggal & Jam Menit Sekarang
        // ===================================================================
        const now = new Date();
        // Offset ini wajib agar jamnya mengikuti zona waktu lokal komputer (WIB), bukan UTC murni
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        
        setManualDate(now.toISOString().slice(0, 16)); // Menghasilkan format "YYYY-MM-DDTHH:mm" yang valid
        setIsManualDate(false); // Default awal: Biarkan sistem yang menyematkan otomatis
    }
    }, [initialData]);
    
  // ==========================================
  // SUBMIT HANDLER & DEFAULT VALUE VALIDATION
  // ==========================================
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Automatic Financial Calculations
    const calculatedTotalPriceUnit = Number(initialUnit) * Number(pricePerUnit);
    
    // Default total invoice follows total price unit, or adjusted to customized arrangements
    const calculatedTotalInvoice = calculatedTotalPriceUnit; 
    
    // Remaining debt calculation to supplier
    const calculatedRemainingPayment = calculatedTotalInvoice - Number(totalPayment);

    // Send payload with clean structural property names (Anti-Undefined mapping)
    onSubmit({
      name: name.trim(),
      unit: unitType,
      
      supplier_id: manualSupplierName ? manualSupplierName : null,


      initialQty: Number(initialUnit) || 0,
      receivedQty: Number(receivedUnit) || 0,
      finalQty: Number(finalUnit) || 0,
      
      pricePerUnit: Number(pricePerUnit) || 0,
      totalPriceUnit: calculatedTotalPriceUnit,
      downPayment: Number(downPayment) || 0,
      totalInvoice: calculatedTotalInvoice,
      totalPayment: Number(totalPayment) || 0,
      remainingPayment: calculatedRemainingPayment,
      receivedDate: receivedDate,
      
      dueDate: dueDate ? new Date(dueDate) : null,
      paymentDate: paymentDate ? new Date(paymentDate) : null,

      status: itemStatus,
      note: note.trim() || "-",
      noteUser:noteUser,
      // Ensure date format object falls back cleanly if manual toggling is disabled
      manualDate: isManualDate ? new Date(manualDate) : new Date(),
    });
  };

return (
    <form onSubmit={handleFormSubmit} className="space-y-6 pt-2 text-main ">
      
      {/* ======================================================== */}
      {/* 1. TUKANG PRIMARY SECTOR (Fillable by Tukang & Owner)    */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <InputName 
          value={name} 
          onChange={setName} 
          disabled={role === "ADMIN" && initialData.status !== "MENUNGGU_PO"} 
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputQty 
            label="Initial Quantity (PO)" 
            value={initialUnit} 
            onChange={setInitialUnit} 
            disabled={role === "ADMIN" && initialData.status !== "MENUNGGU_PO"}
          />
          <InputUnitType 
            value={unitType} 
            onChange={setUnitType} 
            disabled={role === "ADMIN" && initialData.status !== "MENUNGGU_PO"} 
          />
        </div>
        
        <InputDateToggle
          isManual={isManualDate}
          onToggle={setIsManualDate}
          dateValue={manualDate}
          onDateChange={setManualDate}
          disabled={role === "ADMIN"}
        />
      </div>

      {/* ======================================================== */}
      {/* 2. LOGISTICS VERIFICATION SECTOR (Admin & Owner Scope)   */}
      {/* ======================================================== */}
      {(role === "ADMIN" || role === "OWNER" || role === "SUPERVISOR") && (
        <div className="border-t border-border-subtle pt-5 space-y-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
            Field Logistics Verification
          </p>
          
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                Supplier Vendor
              </label>
              <InputSupplierSelect 
                value={manualSupplierName} 
                onChange={(val) => setManualSupplierName(val)} 
              />
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputQty label={`Barang yang datang (${unitType || 'Unit'})`} value={receivedUnit} onChange={setReceivedUnit} />
            <InputStatus value={itemStatus} onChange={(val: any) => setItemStatus(val)} role={role} />
          </div>
        </div>
      )}

      {(role === "ADMIN" || role === "SUPERVISOR") && (

        <InputReceivedDate
          logs={receivedDate} 
          onChange={setReceivedDate} 
          disabled={false} // Sesuai hak akses peranan user Anda
        />

      )}
      {/* ======================================================== */}
      {/* 3. FINANCIAL / INVOICING SECTOR (Exclusive Owner Privilege) */}
      {/* ======================================================== */}
      {role === "OWNER" && (
        <div className="border-t border-border-subtle pt-5 space-y-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
            Invoicing & Vendor Finances
          </p>
          
          <InputPrice label={`Price per ${unitType || 'Unit'}`} value={pricePerUnit} onChange={setPricePerUnit} />
          
          {/* Live gross calculation info */}
          <div className="p-4 bg-ui-hover/40 border border-border-subtle rounded-xl text-xs flex justify-between items-center font-bold tracking-wide transition-colors duration-200">
            <span className="text-muted text-[10px] uppercase tracking-wider">Estimated Total Unit Price:</span>
            <span className="text-brand-success text-sm font-black">
              Rp {(initialUnit * pricePerUnit).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputPrice label="Down Payment (DP)" value={downPayment} onChange={setDownPayment} />
            <InputPrice label="Total Rolling Payments" value={totalPayment} onChange={setTotalPayment} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Last Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth transition-all font-bold"
              />
            </div>
          </div>
        </div>
      )}


        <InputNote 
          title={name}
          value={note} 
          onChange={setNote} 
        />

        <InputNoteRole
          title={role}
          value={noteUser[currentRoleField]}
          onChange={(value) =>
            setNoteUser((prev) => ({
              ...prev,
              [currentRoleField]: value,
            }))
          }
        />

      {/* BUTTON ACTION */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-main text-card hover:opacity-90 active:scale-98 disabled:opacity-50 font-bold rounded-xl transition-all shadow-sm text-xs uppercase tracking-wider"
        >
          {loading ? "Validating Processes..." : "Save Reconciliation Document"}
        </button>
      </div>
    </form>
  );
}