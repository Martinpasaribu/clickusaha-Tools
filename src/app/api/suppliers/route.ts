/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { createDefaultSupplier } from "@/types/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectTenantDB } from "@/lib/mongoosedb"; // 👈 Menggunakan koneksi dinamis
import { getTenantModels } from "@/lib/tenantModels"; // 👈 Menggunakan helper terpisah

// ========================================================
// 1. GET: Mengambil Daftar Supplier Sesuai Tenant Active
// ========================================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    if (!dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sesi basis data tidak terdeteksi' }, { status: 401 });
    }

    const tenantDb = await connectTenantDB(dbTarget);
    const { SupplierModel } = await getTenantModels(tenantDb);

    // Mengambil semua data supplier diurutkan dari yang terbaru di DB cabang tersebut
    const suppliers = await SupplierModel.find({}).sort({ createdAt: -1 }).lean();
  
    return NextResponse.json({
      success: true,
      data: suppliers
    }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 [API SUPPLIER GET ERROR MULTI-TENANT]:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ========================================================
// 2. POST: Membuat Supplier Baru di Lingkup Tenant
// ========================================================
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    if (!session || !dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Silakan login terlebih dahulu' }, { status: 401 });
    }

    const tenantDb = await connectTenantDB(dbTarget);
    const { SupplierModel, LogHistoryModel } = await getTenantModels(tenantDb);

    const body = await request.json();
    const { name } = body;

    // Validasi input awal wajib
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: "Supplier name is required" }, { status: 400 });
    }

    // Gunakan default generator dari schema file Anda agar data anti-blank
    const finalSupplierData = createDefaultSupplier(body);

    // Simpan ke database menggunakan Mongoose Model dinamis
    const newSupplier = await SupplierModel.create(finalSupplierData);

    // Catat riwayat log dengan type "CSP" (Create Supplier) pada database cabang terkait
    const logData = {
      itemId: newSupplier._id, 
      userId: new mongoose.Types.ObjectId((session.user as any).id),
      userRole: (session.user as any).role,
      type: "CSP",
      changes: {
        before: null,
        after: finalSupplierData
      },
      description: `Data supplier ditambahkan "${finalSupplierData.name}"`,
      createdAt: new Date(),
      manualLogDate: new Date(),
    };
    
    await LogHistoryModel.create(logData);

    return NextResponse.json({ 
      success: true, 
      message: "Supplier created successfully",
      data: newSupplier 
    }, { status: 201 });

  } catch (error: any) {
    console.error("🚨 [API SUPPLIER POST ERROR MULTI-TENANT]:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ========================================================
// 3. PUT: Memperbarui Data Supplier Terisolasi per Tenant
// ========================================================
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    if (!session || !dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tenantDb = await connectTenantDB(dbTarget);
    const { SupplierModel, LogHistoryModel } = await getTenantModels(tenantDb);

    const body = await request.json();
    const { id, name, person, phone, address, bankAccount, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing required field: id" }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: "Supplier name cannot be empty" }, { status: 400 });
    }

    // Ambil data lama supplier di cabang ini untuk perbandingan log
    const currentSupplier = await SupplierModel.findById(id).lean();
    if (!currentSupplier) {
      return NextResponse.json({ success: false, message: "Supplier tidak ditemukan di cabang ini" }, { status: 404 });
    }

    const updatedData = {
      name: name.trim(),
      person: person || "-",
      phone: phone || "-",
      address: address || "-",
      bankAccount: {
        bankName: bankAccount?.bankName || "-",
        accountNumber: bankAccount?.accountNumber || "-",
        accountHolder: bankAccount?.accountHolder || "-",
      },
      isActive: isActive ?? true,
    };

    // Eksekusi update langsung pada database sub-tenant
    const updatedSupplier = await SupplierModel.findByIdAndUpdate(
      id, 
      { $set: updatedData },
      { new: true } 
    );

    // Catat log riwayat perubahan supplier ke dalam database sub-tenant yang sama
    await LogHistoryModel.create({
      itemId: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId((session.user as any).id),
      userRole: (session.user as any).role,
      type: "UGL",
      changes: {
        before: currentSupplier,
        after: updatedData
      },
      description: `Mengubah rincian profil data supplier "${updatedData.name}"`,
      createdAt: new Date(),
      manualLogDate: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: "Supplier updated successfully",
      data: updatedSupplier
    }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 [API SUPPLIER PUT ERROR MULTI-TENANT]:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}