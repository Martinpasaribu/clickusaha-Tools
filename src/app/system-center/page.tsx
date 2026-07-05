/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SystemManagementClient from "./SystemManagementClient";

export default async function SystemCenterPage() {
  const session = await getServerSession(authOptions);

  // Kunci Berlapis: Jika belum login atau role bukan OWNER_SYSTEM, lempar ke login center khusus
  if (!session || (session.user as any).role !== "OWNER_SYSTEM") {
    redirect("/system-center/login?callbackUrl=/system-center");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-1 mb-8 border-l-4 border-brand-owner pl-4">
        <h1 className="text-xl font-bold text-main tracking-tight font-mono uppercase">System Center Configuration</h1>
        <p className="text-xs text-muted">Akses Root System Operator: Pengaturan cluster database, isolasi tenant, dan pendaftaran master-owner.</p>
      </div>
      
      <SystemManagementClient />
    </div>
  );
}