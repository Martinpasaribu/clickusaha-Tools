/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMainDB, connectTenantDB } from "@/lib/mongoosedb";
import { getTenantModels } from "@/lib/tenantModels";
import GlobalUser from "@/lib/models/GlobalUser"; // Model pusat Anda

export async function POST(request: Request) {
  try {
    // 1. Ambil sesi Owner cabang yang sedang login
    const session = await getServerSession(authOptions);
    const userSession = session?.user as any;
    const currentTenantDb = userSession?.databaseName;

    // PROTEKSI API: Hanya akun dengan role OWNER cabang yang boleh mendaftarkan karyawan internal
    if (!session || userSession?.role !== "OWNER" || !currentTenantDb) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak! Hanya Owner cabang yang dapat mendaftarkan user baru." },
        { status: 403 }
      );
    }

    const { username, password, name, role } = await request.json();

    // 2. Validasi input kosong
    if (!username || !password || !name || !role) {
      return NextResponse.json({ success: false, error: "Semua field harus diisi!" }, { status: 400 });
    }

    // Proteksi: Owner cabang tidak boleh mendongkrak role karyawan menjadi OWNER_SYSTEM atau sesama OWNER
    const targetRole = role.toUpperCase();
    if (targetRole === "OWNER_SYSTEM" || targetRole === "OWNER") {
      return NextResponse.json({ success: false, error: "Eskalasi hak akses ilegal!" }, { status: 403 });
    }

    const sanitizedUsername = username.toLowerCase().trim();

    // 3. Hubungkan ke MAIN DB (Pusat) & Cek duplikasi username secara global
    await connectMainDB();
    const globalUserExists = await GlobalUser.findOne({ username: sanitizedUsername });
    if (globalUserExists) {
      return NextResponse.json({ success: false, error: "Username sudah terdaftar di sistem pusat!" }, { status: 400 });
    }

    // 4. SIMPAN TAHAP 1: Daftarkan ke Database Utama (Pusat) agar bisa lolos Auth Tahap 1
    const newGlobalUser = await GlobalUser.create({
      username: sanitizedUsername,
      password, // Pastikan di-hash menggunakan bcrypt jika sistem produksi Anda sudah siap
      name: name.trim(),
      role: targetRole,
      businessName: userSession.businessName || "Cabang Internal", // Mewarisi nama bisnis si Owner
      databaseName: currentTenantDb // Dikunci ke database milik Owner ini
    });

    // 5. SIMPAN TAHAP 2: Replikasi ke Database Tenant lokal menggunakan helper dinamis
    const tenantDb = await connectTenantDB(currentTenantDb);
    const { UserModel } = await getTenantModels(tenantDb) as any; 
    
    // Catatan: Pastikan di dalam `tenantModels.ts` Anda sudah meregistrasikan `UserModel` lokal
    await UserModel.create({
      username: sanitizedUsername,
      name: name.trim(),
      role: targetRole,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Karyawan ${name} dengan role ${targetRole} berhasil diaktifkan di cabang ini!`,
      data: {
        id: newGlobalUser._id,
        username: newGlobalUser.username
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("🚨 [API REGISTER KARYAWAN TENANT ERROR]:", error);
    return NextResponse.json({ success: false, error: `Gagal memproses registrasi: ${error.message}` }, { status: 500 });
  }
}