/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

import '@/lib/models/User';
import '@/lib/models/Supplier';
import '@/lib/models/Barang';
import '@/lib/models/LogHistory';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/logistik_db';


if (!MONGODB_URI) {
  throw new Error('Silakan tentukan variabel lingkungan MONGODB_URI di dalam file .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 1. Log jika menggunakan koneksi yang sudah tersimpan di cache (Hot Reload / Fast Refresh)
  if (cached.conn) {
    console.log('🔄 [MongoDB Mongoose] Menggunakan koneksi database yang sudah ada (Cached).');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
        bufferCommands: false,
        dbName: 'logistik_db',
    };

    console.log('⏳ [MongoDB Mongoose] Membuka koneksi database baru...');

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ [MongoDB Mongoose] Berhasil terhubung ke database MongoDB.');
      return mongooseInstance;
    }).catch((error) => {
      console.error('❌ [MongoDB Mongoose] Gagal inisialisasi koneksi awal:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    // 3. Log detail jika terjadi error saat proses await koneksi dilakukan
    console.error('🚨 [MongoDB Mongoose] Error saat menghubungkan ke database:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;