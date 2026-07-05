// register/route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectMainDB } from "@/lib/mongoosedb";
import GlobalUser from "@/lib/models/GlobalUser";


export async function POST(request: Request) {
  try {
    await connectMainDB();

    const { username, password, name } = await request.json();

    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Semua field data wajib diisi" }, 
        { status: 400 }
      );
    }

    // 1. Validasi apakah username sudah terpakai global
    const existingUser = await GlobalUser.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Username operator sudah digunakan" }, 
        { status: 400 }
      );
    }

    // 2. Buat user root baru di Main DB
    const newSystemOwner = await GlobalUser.create({
      username,
      password, // Gunakan hashing bcrypt di sini jika sudah siap produksi
      name,
      role: "OWNER_SYSTEM", // Dikunci mutlak di level API demi keamanan
      databaseName: "master_system", // Identifikasi database pusat
    });

    return NextResponse.json({
      success: true,
      message: "Node OWNER_SYSTEM berhasil diinisialisasi",
      data: {
        id: newSystemOwner._id.toString(),
        username: newSystemOwner.username,
        name: newSystemOwner.name,
      }
    });

  } catch (error: any) {
    console.error("🚨 [SYSTEM REGISTER ERROR]:", error);
    return NextResponse.json(
      { success: false, error: `Gagal menginisialisasi operator baru ${error}` }, 
      { status: 500 }
    );
  }
}
