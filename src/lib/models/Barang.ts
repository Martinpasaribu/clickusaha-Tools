import { ReconciliationItemSchema } from '@/types/schema';
import mongoose, { Schema, Document } from 'mongoose';

// Interface ini menggabungkan schema TypeScript Anda dengan Document bawaan Mongoose
export interface IBarang extends Omit<ReconciliationItemSchema, '_id'>, Document {}

export const BarangSchema: Schema = new Schema<IBarang>(
  {
    name: { type: String, required: true, trim: true, default: "Unnamed Material" },
    unit: { type: String, required: true, trim: true, default: "pcs" },
    code: { type: String, required: true, unique: true, trim: true },
    
    // Relasi ke collection suppliers
    supplier_id: { type: Schema.Types.ObjectId, ref: 'supplier', default: null },

    initialQty: { type: Number, required: true, default: 0 },
    receivedQty: { type: Number, required: true, default: 0 },
    finalQty: { type: Number, required: true, default: 0 },

    pricePerUnit: { type: Number, required: true, default: 0 },
    totalPriceUnit: { type: Number, required: true, default: 0 },
    downPayment: { type: Number, required: true, default: 0 },
    totalInvoice: { type: Number, required: true, default: 0 },
    totalPayment: { type: Number, required: true, default: 0 },
    remainingPayment: { type: Number, required: true, default: 0 },

    dueDate: { type: Date, default: null },
    paymentDate: { type: Date, default: null },
    manualDate: { type: Date, required: true, default: Date.now },

    status: { 
      type: String, 
      required: true, 
      enum: [
        'MENUNGGU_PO',
        'DIBELI',
        'DALAM_PENGIRIMAN',
        'DITERIMA_LAPANGAN',
        'SUDAH_DIBAYAR',
        'DIREFUND',
        'DIBATALKAN', 
        'PENDING_VERIFIKASI',
        'PENGECEKAN_BARANG',
        'SELESAI'
      ],
      default: 'MENUNGGU_PO' 
    },

    // "MENUNGGU_PO" | "DIBELI" | "DALAM_PENGIRIMAN" | "DITERIMA_LAPANGAN" | "SUDAH_DIBAYAR"| "DIREFUND" | "DIBATALKAN" | "PAID" | "PENDING_VERIFIKASI" | "PENGECEKAN_BARANG" | "SELESAI"

    condition: { 
      type: String, 
      required: true, 
      enum : [
        'BAGUS',
        'HILANG_SEBAGIAN',
        'HILANG_TOTAL',
        'RUSAK_SEBAGIAN',
        'RUSAK',
        'TIDAK_SESUAI_SPEC',
        'SALAH_BARANG',
        'KURANG_JUMLAH',
        'LEBIH_JUMLAH'
      ],
      default: 'BAGUS' 
    },


    note: { type: String, default: "-" },
    noteUser: {
      owner: { type: String, default: "-" },
      admin: { type: String, default: "-" },
      supervisor: { type: String, default: "-" },
      tukang: { type: String, default: "-" },
    },
    receivedDate: [
      {
        date: { type: Date, default: Date.now },
        qty: { type: Number, required: true }
      }
    ],

    createdById: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    updatedById: { type: Schema.Types.ObjectId, ref: 'users', default: null }
  },
  {
    // Otomatis mengurusi createdAt dan updatedAt di level MongoDB
    timestamps: true 
  }
);

// Mencegah Next.js membuat ulang model saat hot-reload di development mode
// const Barang = mongoose.models.Barang || mongoose.model<IBarang>('barang', BarangSchema, 'barang');

// export default Barang;