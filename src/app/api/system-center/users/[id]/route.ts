/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMainDB, connectTenantDB } from "@/lib/mongoosedb";
import { Schema } from "mongoose";
import { getTenantModels } from "@/lib/tenantModels";

const TenantUserSchema = new Schema({ username: String });

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  
  const session = await getServerSession(authOptions);
  const dbTarget = (session?.user as any)?.databaseName;
  const tenantDb = await connectTenantDB(dbTarget);
  const { UserModel } = await getTenantModels(tenantDb);
  

  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "OWNER_SYSTEM") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { id } = params;
    await connectMainDB();

    const user = await UserModel.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });
    }

    // 1. Hapus entitas dari sub-database jika bukan root system
    if (user.role !== "OWNER_SYSTEM") {
      const tenantDb = await connectTenantDB(user.databaseName);
      const TenantUserModel = tenantDb.models.users || tenantDb.model("users", TenantUserSchema);
      await TenantUserModel.deleteOne({ username: user.username });
    }

    // 2. Hapus data master di pusat
    await UserModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "User dicabut total dari seluruh kluster database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}