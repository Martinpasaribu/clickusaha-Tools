/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection } from "mongoose";
// Ganti import model statis menjadi import SCHEMA murninya
import { BarangSchema } from "./models/Barang";
import { SupplierSchema02} from "./models/Supplier";
import { LogHistorySchema02 } from "./models/LogHistory";
import { UserSchema02 } from "./models/User";

/**
 * Helper untuk mengompilasi dan mengambil Model Mongoose secara dinamis
 * berdasarkan instance koneksi sub-database tenant yang aktif.
 */
export async function getTenantModels(tenantDb: Connection) {
  // ✅ BENAR: Masukkan BarangSchema sebagai parameter kedua, bukan Model Barang
  const BarangModel = tenantDb.models.Barang || tenantDb.model("barang", BarangSchema, "barang");

  // ✅ BENAR: Gunakan SupplierSchema
  const SupplierModel = tenantDb.models.Supplier || tenantDb.model("supplier", SupplierSchema02, "supplier");

  // ✅ BENAR: Gunakan LogHistorySchema
  const LogHistoryModel = tenantDb.models.LogHistory || tenantDb.model("loghistory", LogHistorySchema02, "loghistory");

  const UserModel = tenantDb.models.User || tenantDb.model("users", UserSchema02, "users");

  return { 
    BarangModel, 
    SupplierModel, 
    LogHistoryModel,
    UserModel 
  };
}