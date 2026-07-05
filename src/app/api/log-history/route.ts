/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectTenantDB } from '@/lib/mongoosedb'; // 👈 Menggunakan koneksi tenant dinamis
import { getTenantModels } from '@/lib/tenantModels'; // 👈 Menggunakan helper terpisah

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    // 1. Proteksi Sesi Tenant
    if (!dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sesi basis data tidak terdeteksi' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ success: false, error: 'Item ID wajib diisi' }, { status: 400 });
    }

    // 2. Hubungkan ke Sub-Database Tenant & Ambil Model Dinamis
    const tenantDb = await connectTenantDB(dbTarget);
    const { LogHistoryModel } = await getTenantModels(tenantDb);

    // 3. Cari riwayat log terisolasi di dalam database cabang tersebut
    const logs = await LogHistoryModel.find({ 
      itemId: new mongoose.Types.ObjectId(itemId) 
    })
    .populate('userId', 'name username role') // 🔥 Otomatis membaca dari tabel 'users' lokal milik cabang terkait
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    console.error("🚨 [API LOG HISTORY GET ERROR MULTI-TENANT]:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error', debugMessage: error.message }, { status: 500 });
  }
}