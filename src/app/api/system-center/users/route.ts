/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMainDB, connectTenantDB } from "@/lib/mongoosedb";
import { Schema } from "mongoose";
import GlobalUser from "@/lib/models/GlobalUser";

// Skema lokal untuk menduplikasi user OWNER ke database sub-tenant barunya
const TenantUserSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });


    // Skema lokal untuk menduplikasi user OWNER ke database sub-tenant barunya
// const TenantUserSchema = new Schema({
//   username: { type: String, required: true },
//   name: { type: String, required: true },
//   role: { type: String, required: true },
// }, { 
//   timestamps: true,
//   collection: "User" // 👈 Mengunci nama collection secara mutlak agar tidak diubah otomatis menjadi "users"
// });


// =========================================================================
// POST: Daftarkan OWNER Baru & Inisialisasi Sub-Database Tenant Baru
// =========================================================================
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as any;

    // Keamanan: Hanya ROOT OWNER_SYSTEM yang boleh membuat database tenant baru
    if (userSession?.role !== "OWNER_SYSTEM") {
      return NextResponse.json({ success: false, error: "Akses ditolak. Otoritas Root System diperlukan." }, { status: 403 });
    }

    // 🔥 PERBAIKAN 1: Ambil businessName & databaseName dari INPUT FORM (Bukan dari session Anda)
    const { username, password, name, role, businessName, databaseName } = await request.json();

    if (!username || !password || !name || !role || !businessName || !databaseName) {
      return NextResponse.json({ success: false, error: "Semua data termasuk Parameter Tenant wajib diisi" }, { status: 400 });
    }

    // Validasi format nama database agar tidak merusak MongoDB (huruf kecil, tanpa spasi/karakter aneh)
    const sanitizedDbName = databaseName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

    await connectMainDB();

    // Cek apakah username global sudah terpakai
    const existingUser = await GlobalUser.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Username sudah terdaftar di sistem pusat" }, { status: 400 });
    }

    // 1. Simpan OWNER baru ke Database Utama (master_system) dengan target DB miliknya sendiri
    const newUser = await GlobalUser.create({ 
      username, 
      password, 
      name, 
      role, 
      businessName: businessName.trim(),
      databaseName: sanitizedDbName 
    });



    // 2. 🔥 PERBAIKAN 2: Buat & Inisialisasi database sub-tenant baru secara dinamis
    console.log(`🚀 [System Center] Menginisialisasi basis data baru: [${sanitizedDbName}]`);
    const tenantDb = await connectTenantDB(sanitizedDbName);
    
    // Daftarkan model User lokal di dalam database baru tersebut
    const TenantUserModel = tenantDb.models.users || tenantDb.model("users", TenantUserSchema);
    
    // Masukkan data owner tersebut sebagai user pertama di database cabangnya sendiri
    await TenantUserModel.create({ username, name, role });

    return NextResponse.json({ 
      success: true, 
      message: `Tenant [${sanitizedDbName}] berhasil dibangun bersama akun OWNER.`,
      data: newUser 
    });
  } catch (error: any) {
    console.error("🚨 [SYSTEM CENTER CREATE TENANT ERROR]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// =========================================================================
// GET: Melihat seluruh user/tenant yang terdaftar di sistem pusat
// =========================================================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as any;
    
    if (userSession?.role !== "OWNER_SYSTEM") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    await connectMainDB();
    // OWNER_SYSTEM berhak melihat semua akun dan database tenant terdaftar di pusat
    const users = await GlobalUser.find({}).select("-password").sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// =========================================================================
// PUT: Update Data Karyawan Internal Cabang
// =========================================================================
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as any;

    if (userSession?.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { id, name, role, password } = await request.json();
    const currentTenantDb = userSession.databaseName;

    await connectMainDB();
    
    // Pastikan user yang diedit memang bagian dari database Owner ini (mencegah cross-tenant injection)
    const userToUpdate = await GlobalUser.findOne({ _id: id, databaseName: currentTenantDb });
    if (!userToUpdate) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan atau di luar otoritas Anda" }, { status: 404 });
    }

    if (role && (role === "OWNER_SYSTEM" || role === "OWNER")) {
      return NextResponse.json({ success: false, error: "Eskalasi role ilegal" }, { status: 403 });
    }

    // Update Main DB pusat
    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.role = role || userToUpdate.role;
    if (password) userToUpdate.password = password;
    await userToUpdate.save();

    // Update Tenant DB Lokal secara sinkron
    const tenantDb = await connectTenantDB(currentTenantDb);
    const TenantUserModel = tenantDb.models.User || tenantDb.model("User", TenantUserSchema);
    await TenantUserModel.findOneAndUpdate(
      { username: userToUpdate.username },
      { name: userToUpdate.name, role: userToUpdate.role }
    );

    return NextResponse.json({ success: true, message: "Data karyawan berhasil diperbarui" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}