import mongoose, { Schema, Document } from 'mongoose';
import type { GlobalUserSchema } from '@/types/schema'; // Sesuaikan path ke file types Anda

export interface IUser extends Document {
  username: string;
  password?: string; // Sesuai dengan auth lama Anda
  name: string;
  role: "OWNER_SYSTEM" | "OWNER" | "ADMIN" | "SUPERVISOR" | "TUKANG";
  businessName: string;
  databaseName: string; // Tambahan field untuk multi-tenant
}

const GlobalUserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ["OWNER_SYSTEM","OWNER", "ADMIN", "SUPERVISOR", "TUKANG"] },
  businessName: { type: String, required: true }, // Contoh nilai: "inventory_cabang_a"
  databaseName: { type: String, required: true }, // Contoh nilai: "inventory_cabang_a"
});

const GlobalUser = mongoose.models.GlobalUser || mongoose.model<IUser>("GlobalUser", GlobalUserSchema, 'GlobalUser');

export default GlobalUser