// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { connectMainDB, connectTenantDB } from "@/lib/mongoosedb";
// import User from "@/lib/models/User"; // Model dari Main DB
// import { Schema } from "mongoose";

// // Definisikan skema user lokal untuk Database Sub-Tenant secara dinamis
// const TenantUserSchema = new Schema({
//   username: { type: String, required: true },
//   name: { type: String, required: true },
//   role: { type: String, required: true },
// }, { timestamps: true });

// export async function POST(request: Request) {
//   try {
//     const { username, password } = await request.json();

//     if (!username || !password) {
//       return NextResponse.json(
//         { success: false, error: "Username dan password wajib diisi" }, 
//         { status: 400 }
//       );
//     }

//     // ==========================================
//     // TAHAP 1: VALIDASI & PENCARIAN TENANT DI MAIN DB
//     // ==========================================
//     await connectMainDB();
//     const globalUser = await User.findOne({ username }).lean() as any;

//     if (!globalUser) {
//       return NextResponse.json(
//         { success: false, error: "User tidak terdaftar di sistem pusat" }, 
//         { status: 404 }
//       );
//     }

//     // Validasi Password Utama
//     if (globalUser.password !== password) {
//       return NextResponse.json(
//         { success: false, error: "Password salah!" }, 
//         { status: 401 }
//       );
//     }

//     // Pastikan user memiliki mapping nama database sub-tenant
//     if (!globalUser.databaseName) {
//       return NextResponse.json(
//         { success: false, error: "Akses database sub-tenant tidak dikonfigurasi" }, 
//         { status: 422 }
//       );
//     }

//     // ==========================================
//     // TAHAP 2: VERIFIKASI DATA USER DI SUB-TENANT DB
//     // ==========================================
//     const tenantDb = await connectTenantDB(globalUser.databaseName);
    
//     // Kompilasi model User secara dinamis khusus untuk Database Sub-Tenant ini
//     const TenantUserModel = tenantDb.models.User || tenantDb.model("users", TenantUserSchema);
//     const localTenantUser = await TenantUserModel.findOne({ username }).lean() as any;

//     // Jika akun dihapus atau tidak terdaftar di database cabang tersebut, blokir akses
//     if (!localTenantUser) {
//       return NextResponse.json(
//         { success: false, error: "Akun aktif di pusat, namun tidak ditemukan di database cabang ini" }, 
//         { status: 403 }
//       );
//     }

//     // ==========================================
//     // TAHAP 3: PEMBUATAN COOKIE SESI (HTTP-ONLY)
//     // ==========================================
//     const cookieStore = await cookies();
//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24, // 1 Hari
//       path: "/",
//     };

//     // Gunakan data dari localTenantUser agar role & metadata sesuai dengan konfigurasi cabang/tenant
//     cookieStore.set("user_role", localTenantUser.role, cookieOptions);
//     cookieStore.set("user_id", localTenantUser._id.toString(), cookieOptions);
//     cookieStore.set("user_name", localTenantUser.name, cookieOptions);
//     cookieStore.set("user_db_target", globalUser.databaseName, cookieOptions); // Kunci routing untuk API selanjutnya

//     return NextResponse.json({
//       success: true,
//       user: {
//         id: localTenantUser._id.toString(),
//         username: localTenantUser.username,
//         name: localTenantUser.name,
//         role: localTenantUser.role,
//         databaseName: globalUser.databaseName, // Dikembalikan ke client jika dibutuhkan untuk state global
//       },
//     });

//   } catch (error: any) {
//     console.error("🚨 [API AUTH LOGIN MULTI-TENANT ERROR]:", error);
//     return NextResponse.json(
//       { success: false, error: "Terjadi kesalahan server internal" }, 
//       { status: 500 }
//     );
//   }
// }