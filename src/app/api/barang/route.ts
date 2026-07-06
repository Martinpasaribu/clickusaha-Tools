/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectTenantDB } from '@/lib/mongoosedb';
import { getTenantModels } from '@/lib/tenantModels'; // 👈 Impor komponen helper baru di sini
import { createDefaultReconciliationItem } from '@/types/schema';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GenerateCustomItemCode } from '@/lib/generate';

// ========================================================
// 1. GET: Mengambil Semua Data Barang Sesuai Tenant Active
// ========================================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    if (!dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sesi basis data tidak terdeteksi' }, { status: 401 });
    }

    const tenantDb = await connectTenantDB(dbTarget);
    const { BarangModel } = await getTenantModels(tenantDb); // 👈 Menggunakan helper eksternal

    const barang = await BarangModel.find({})
      .populate('supplier_id')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ success: true, data: barang }, { status: 200 });
  } catch (error: any) {
    console.error("🚨 [API BARANG GET ERROR MULTI-TENANT]:", error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data logistik', debugMessage: error.message }, { status: 500 });
  }
}

// ========================================================
// 2. POST: Input Barang Baru Berdasarkan Ruang Lingkup Tenant
// ========================================================
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    if (!session || !dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sesi kerja kadaluwarsa' }, { status: 401 });
    }

    const tenantDb = await connectTenantDB(dbTarget);
    const { BarangModel, LogHistoryModel } = await getTenantModels(tenantDb);

    const body = await request.json();
    
    let formattedManualDate = new Date();
    if (body.manualDate) {
      formattedManualDate = new Date(body.manualDate);
      if (isNaN(formattedManualDate.getTime())) {
        return NextResponse.json({ success: false, error: 'Format manualDate tidak valid' }, { status: 400 });
      }
    }

    const generatedCode = await GenerateCustomItemCode(
        tenantDb.db!,
        body.name,
        formattedManualDate
    );
    const finalDataBarang = createDefaultReconciliationItem({
      ...body,
      code: generatedCode,
      manualDate: formattedManualDate,
      createdById: new mongoose.Types.ObjectId((session.user as any).id),
      updatedById: null
    });

    const newBarang = await BarangModel.create(finalDataBarang);

    const logData = {
      type: "CPO",
      code: generatedCode,
      itemId: newBarang._id,
      userId: new mongoose.Types.ObjectId((session.user as any).id),
      userRole: (session.user as any).role,
      qty: Number(finalDataBarang.initialQty) || 0,
      changes: {
        before: null,
        after: {
          name: finalDataBarang.name,
          initialQty: finalDataBarang.initialQty,
          unit: finalDataBarang.unit,
          status: finalDataBarang.status
        }
      },
      description: `Tukang mendesain PO baru untuk material "${finalDataBarang.name}" sejumlah ${finalDataBarang.initialQty} ${finalDataBarang.unit}`,
      createdAt: new Date(),
      manualLogDate: formattedManualDate
    };

    await LogHistoryModel.create(logData);

    return NextResponse.json({ success: true, message: 'PO Berhasil diajukan', insertedId: newBarang._id }, { status: 201 });
  } catch (error: any) {
    console.error("POST_BARANG_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Gagal memproses data PO', debugMessage: error.message }, { status: 500 });
  }
}

// ========================================================
// 3. PUT: Update Barang di Level Basis Data Tenant Terisolasi
// ========================================================
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    if (!session || !dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tenantDb = await connectTenantDB(dbTarget);
    const { BarangModel, LogHistoryModel } = await getTenantModels(tenantDb);

    const body = await request.json();
    const { 
      id, name, unit, supplier_id, receivedDate, note, noteUser,
      initialQty, receivedQty, finalQty, pricePerUnit, 
      downPayment, totalPayment, status, dueDate, paymentDate, manualDate
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID Barang wajib disertakan' }, { status: 400 });
    }

    const currentItem = await BarangModel.findById(id).lean();
    if (!currentItem) {
      return NextResponse.json({ success: false, error: 'Data logistik tidak ditemukan di cabang ini' }, { status: 404 });
    }

    const calculatedTotalPriceUnit = Number(initialQty || 0) * Number(pricePerUnit || 0);
    const calculatedTotalInvoice = calculatedTotalPriceUnit; 
    const calculatedRemainingPayment = calculatedTotalInvoice - Number(totalPayment || 0);

    const updateData: any = {
      name: name?.trim(),
      unit: unit,
      supplier_id: supplier_id ? new mongoose.Types.ObjectId(supplier_id) : null,
      initialQty: Number(initialQty) || 0,
      receivedQty: Number(receivedQty) || 0,
      finalQty: Number(finalQty) || 0,
      pricePerUnit: Number(pricePerUnit) || 0,
      totalPriceUnit: calculatedTotalPriceUnit,
      downPayment: Number(downPayment) || 0,
      totalInvoice: calculatedTotalInvoice,
      totalPayment: Number(totalPayment) || 0,
      remainingPayment: calculatedRemainingPayment,
      status: status,
      receivedDate: receivedDate,
      note: note?.trim() || "-",
      noteUser: noteUser,
      dueDate: dueDate ? new Date(dueDate) : null,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      manualDate: manualDate ? new Date(manualDate) : new Date(),
      updatedAt: new Date(), 
      updatedById: new mongoose.Types.ObjectId((session.user as any).id)
    };

    await BarangModel.findByIdAndUpdate(id, { $set: updateData });

    const roleUser = (session.user as any).role;
    let logType = "UGL"; 
    let logDescription = `Perubahan data oleh ${roleUser}`;
    let logQty: number | null = null; 
    const trackingChanges: { before: any; after: any } = { before: {}, after: {} };

    if (currentItem.initialQty !== updateData.initialQty) {
      logType = "UIQ"; logQty = updateData.initialQty; 
      trackingChanges.before.initialQty = currentItem.initialQty;
      trackingChanges.after.initialQty = updateData.initialQty;
      logDescription = `Mengubah kuantitas awal dari ${currentItem.initialQty} menjadi ${updateData.initialQty}`;
    } else if (currentItem.receivedQty !== updateData.receivedQty) {
      logType = "URQ"; logQty = updateData.receivedQty; 
      trackingChanges.before.receivedQty = currentItem.receivedQty;
      trackingChanges.after.receivedQty = updateData.receivedQty;
      logDescription = `Verifikasi barang masuk: dari ${currentItem.receivedQty} menjadi ${updateData.receivedQty} ${updateData.unit}`;
    } else if (currentItem.pricePerUnit !== updateData.pricePerUnit) {
      logType = "UPR"; 
      trackingChanges.before.pricePerUnit = currentItem.pricePerUnit;
      trackingChanges.after.pricePerUnit = updateData.pricePerUnit;
      logDescription = `Mengubah harga satuan material dari Rp${currentItem.pricePerUnit} menjadi Rp${updateData.pricePerUnit}`;
    } else if (currentItem.status !== updateData.status) {
      logType = "UST"; 
      trackingChanges.before.status = currentItem.status;
      trackingChanges.after.status = updateData.status;
      logDescription = `Mengubah alur status logistik dari [${currentItem.status}] ke [${updateData.status}]`;
    } else {
      trackingChanges.before = { note: currentItem.note, name: currentItem.name };
      trackingChanges.after = { note: updateData.note, name: updateData.name };
    }

    const finalLogPayload: any = {
      type: logType,
      itemId: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId((session.user as any).id),
      userRole: roleUser,
      changes: trackingChanges,
      description: logDescription,
      createdAt: new Date(),
      manualLogDate: updateData.manualDate
    };

    if (logQty !== null) finalLogPayload.qty = Number(logQty);

    await LogHistoryModel.create(finalLogPayload);

    return NextResponse.json({ success: true, message: 'Data logistik berhasil diperbarui' });
  } catch (error: any) {
    console.error("PUT_BARANG_ERROR:", error);
    return NextResponse.json({ success: false, error: `Gagal memperbarui data logistik: ${error.message}` }, { status: 500 });
  }
}

// ========================================================
// 4. DELETE: Hapus Entry Barang Terbatas Tenant
// ========================================================
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const dbTarget = (session?.user as any)?.databaseName;

    if (!session || !dbTarget) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user?.role === 'TUKANG') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID wajib disertakan' }, { status: 400 });
    }

    const tenantDb = await connectTenantDB(dbTarget);
    const { BarangModel, LogHistoryModel } = await getTenantModels(tenantDb);

    const backupItem = await BarangModel.findById(id).lean();
    if (!backupItem) {
      return NextResponse.json({ success: false, error: 'Dokumen tidak ditemukan di cabang ini' }, { status: 404 });
    }

    await BarangModel.findByIdAndDelete(id);

    await LogHistoryModel.create({
      type: "DEL",
      itemId: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId((session.user as any).id),
      userRole: (session.user as any).role,
      changes: { before: backupItem, after: null },
      description: `Menghapus permanen material "${backupItem.name}" dari sistem logistik`,
      createdAt: new Date(),
      manualLogDate: new Date()
    });

    return NextResponse.json({ success: true, message: 'Material berhasil dihapus secara permanen' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}