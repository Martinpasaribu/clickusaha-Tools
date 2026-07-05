import mongoose, { Schema, Document } from 'mongoose';
import type { SupplierSchema } from '@/types/schema'; // Sesuaikan path ke file types Anda

export interface ISupplier extends Omit<SupplierSchema, '_id'>, Document {}

export const SupplierSchema02: Schema = new Schema<ISupplier>(
  {
    name: { type: String, required: true, trim: true },
    person: { type: String, default: "-" },
    phone: { type: String, default: "-" },
    address: { type: String, default: "-" },
    bankAccount: {
      bankName: { type: String, default: "-" },
      accountNumber: { type: String, default: "-" },
      accountHolder: { type: String, default: "-" },
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    // Mengaktifkan otomatisasi createdAt dan updatedAt khusus untuk data Supplier
    timestamps: true 
  }
);

// Parameter ketiga 'suppliers' memastikan Mongoose menembak collection yang sama dengan database lama Anda
// const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('supplier', SupplierSchema02, 'suppliers');

// export default Supplier;