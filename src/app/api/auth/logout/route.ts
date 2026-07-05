import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("user_role");
  cookieStore.delete("user_id");
  cookieStore.delete("user_name");
  
  return NextResponse.json({ success: true, message: "Berhasil keluar" });
}