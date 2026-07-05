// src/types/index.ts (atau sesuaikan dengan path file Anda)

import { Types } from 'mongoose'; // 1. Ubah import dari 'mongodb' ke 'mongoose'

// ==========================================
// 1. USER SCHEMA
// ==========================================
export type UserRole = 'TUKANG' | 'ADMIN' | 'OWNER' | 'SUPERVISOR';
export type GlobalUserRole = 'OWNER_SYSTEM' | 'TUKANG' | 'ADMIN' | 'OWNER' | 'SUPERVISOR';

interface ReceivedLog {
  date: Date;
  qty: number;
}
export interface NoteUser {
  owner: string;
  admin: string;
  supervisor: string;
  tukang: string;
}

export interface UserSchema {
  _id?: Types.ObjectId; // Gunakan Types.ObjectId
  username: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}
export interface GlobalUserSchema {
  _id?: Types.ObjectId; // Gunakan Types.ObjectId
  username: string;
  name: string;
  role: GlobalUserRole;
  createdAt: Date;
  databaseName: string;
}

// ==========================================
// 2. SUPPLIER SCHEMA
// ==========================================
export interface SupplierSchema {
  _id?: Types.ObjectId;
  name: string;       
  person?: string;     
  phone?: string;      
  address?: string;          
  bankAccount?: {            
    bankName: string;         
    accountNumber: string;    
    accountHolder: string;    
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper Function for Default New Supplier
export const createDefaultSupplier = (data: Partial<SupplierSchema>): SupplierSchema => ({
  name: data.name || "",
  person: data.person || "-",
  phone: data.phone || "-",
  address: data.address || "-",
  bankAccount: data.bankAccount || { bankName: "-", accountNumber: "-", accountHolder: "-" },
  isActive: data.isActive ?? true,
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt || new Date(),
});

// ==========================================
// 3. RECONCILIATION ITEM SCHEMA (Product / Materials)
// ==========================================
export type status = "MENUNGGU_PO" | "DIBELI" | "DALAM_PENGIRIMAN" | "DITERIMA_LAPANGAN" | "SUDAH_DIBAYAR"| "DIREFUND" | "DIBATALKAN" | "PAID" | "PENDING_VERIFIKASI" | "PENGECEKAN_BARANG" | "SELESAI";

export type condition = 'HILANG_SEBAGIAN' | 'BAGUS' | 'RUSAK_SEBAGIAN' | 'RUSAK' | 'TIDAK_SESUAI_SPEC';

export interface ReconciliationItemSchema {
  _id?: Types.ObjectId;
  name: string;            
  unit: string;            
  code: string;
  // SUPPLIER RELATION:
  supplier_id?: Types.ObjectId | null; 

  // Logistics & Quantity
  initialQty: number;         
  receivedQty: number;        
  finalQty: number;           
  
  // Financial Aspects & Pricing
  pricePerUnit: number;        
  totalPriceUnit: number;      
  downPayment: number;         
  totalInvoice: number;        
  totalPayment: number;        
  remainingPayment: number;    
  
  // Financial Dates & Deadlines
  dueDate?: Date | null;       
  paymentDate?: Date | null;   

  status: status; 
  condition: condition; 

  note?: string;
  noteUser?: NoteUser | null;

  receivedDate?: ReceivedLog[];
  
  // Related User Data
  createdById: Types.ObjectId;        
  updatedById?: Types.ObjectId | null;      
  
  // DUAL DATE LOGIC
  createdAt: Date;             
  updatedAt: Date;             
  manualDate: Date;            
}

// 🔥 DEFAULT GENERATOR FOR RECONCILIATION ITEM (ANTI-BLANK/ZERO VALUE)
export const createDefaultReconciliationItem = (
  data: Partial<ReconciliationItemSchema> & { createdById: Types.ObjectId }
): ReconciliationItemSchema => {
  const initialQty = data.initialQty || 0;
  const pricePerUnit = data.pricePerUnit || 0;
  const totalPriceUnit = initialQty * pricePerUnit;
  const totalPayment = data.totalPayment || 0;

  return {
    name: data.name || "Unnamed Material",
    unit: data.unit || "pcs",
    code : data.code || "SEM-15118226",
    supplier_id: data.supplier_id || null,

    initialQty: initialQty,
    receivedQty: data.receivedQty || 0,
    finalQty: data.finalQty || 0,
    
    pricePerUnit: pricePerUnit,
    totalPriceUnit: totalPriceUnit,
    downPayment: data.downPayment || 0,
    totalInvoice: data.totalInvoice || totalPriceUnit,
    totalPayment: totalPayment,
    remainingPayment: data.remainingPayment || (totalPriceUnit - totalPayment),
    
    dueDate: data.dueDate || null,
    paymentDate: data.paymentDate || null,
    
    status: data.status || 'MENUNGGU_PO',
    condition: data.condition || 'BAGUS',

    note: data.note || "-",
    noteUser: data.noteUser || null,


    receivedDate: data.receivedDate || [],
    
    createdById: data.createdById,
    updatedById: data.updatedById || null,
    
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    manualDate: data.manualDate || new Date(),
  };
};

// ==========================================
// 4. LOG HISTORY SCHEMA
// ==========================================
// Tipe diperbarui agar sinkron dengan kode singkatan (CPO, UIQ, URQ, dsb) di API Route Anda
export type LogHistoryType = "CPO" | "UIQ" | "URQ" | "UPR" | "UST" | "UGL" | "DEL" | "CSP";

export interface LogHistorySchema {
  _id?: Types.ObjectId;
  itemId: Types.ObjectId;            
  userId: Types.ObjectId;            
  code?: string; // Dibuat opsional jika tidak semua log merekam kode
  type: LogHistoryType; 
  userRole: UserRole;
  qty?: number;          
  changes: {                   
    before: Partial<ReconciliationItemSchema> | null; 
    after: Partial<ReconciliationItemSchema> | null;  
  };
  description: string;         
  createdAt: Date;             
  manualLogDate: Date;         
}



// CREATE_PO -> CPO   🔍 

// UPDATE_INITIAL_QTY -> UIQ 🔍
 
// UIQUPDATE_RECEIVED_QTY -> URQ 🔍

// UPDATE_PRICE -> UPR

// UPDATE_STATUS -> UST

// UPDATE_LOGISTIK -> UGL

// DELETE_BARANG -> DEL

// CREATE_SUPPLIER -> CSP   🔍 