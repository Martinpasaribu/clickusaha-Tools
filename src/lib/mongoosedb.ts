/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Connection } from 'mongoose';

// 1. KUNCI: Hanya impor User yang nempel di database utama (Main DB) untuk autentikasi global
// import '@/lib/models/User';

// CATATAN: Jangan impor Supplier, Barang, dan LogHistory di sini secara global.
// Model-model tersebut harus dipanggil/dibuat secara dinamis di dalam API Route 
// menggunakan instance `tenantDb.model()` agar datanya masuk ke DB sub-tenant yang tepat.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Silakan tentukan variabel lingkungan MONGODB_URI di dalam file .env.local');
}

// Gunakan global cache agar koneksi tidak berlipat ganda saat Next.js melakukan Hot Reload (Development)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * 1. MENGHUBUNGKAN KE DATABASE UTAMA (MAIN / DEFAULT DB)
 * Mengunci tujuan mutlak ke 'master_system' agar tidak membuat database 'test'
 */
export async function connectMainDB(): Promise<Connection> {
  if (cached.conn) {
    console.log('🔄 [Mongoose MainDB] Menggunakan koneksi database utama yang sudah ada (Cached).');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // 🔥 KUNCI UTAMA: Memaksa koneksi default masuk ke database master pusat
      dbName: 'master_system', 
    };

    console.log('⏳ [Mongoose MainDB] Membuka pool koneksi baru ke MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('✅ [Mongoose MainDB] Pool koneksi berhasil diinisialisasi pada [master_system].');
      return mongooseInstance.connection;
    }).catch((error) => {
      console.error('❌ [Mongoose MainDB] Gagal inisialisasi koneksi awal:', error.message);
      cached.promise = null;
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * 2. MENGHUBUNGKAN KE DATABASE SUB-TENANT SECARA DINAMIS
 * @param dbName Nama database inventory/cabang target (misal: 'tenant_cabang_a')
 */
export async function connectTenantDB(dbName: string): Promise<Connection> {
  if (!dbName) {
    throw new Error('Nama database sub-tenant tidak boleh kosong.');
  }

  // Pastikan koneksi utama (MainDB) sudah terbentuk
  const mainConnection = await connectMainDB();
  
  // useCache: true memastikan Mongoose menyimpan instance koneksi sub-db ini di memori pool
  console.log(`🔌 [Mongoose TenantDB] Beralih ke sub-database: [${dbName}]`);
  return mainConnection.useDb(dbName, { useCache: true });
}

// Export default mengarah ke fungsi main untuk menjaga backward compatibility
export default connectMainDB;