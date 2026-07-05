/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Sesuaikan path authOptions kamu

export async function getAuthUser() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return null;
  }

  // Mengembalikan data user beserta role-nya dari session NextAuth
  return {
    id: (session.user as any).id,
    name: session.user.name,
    role: (session.user as any).role, // Menghasilkan "OWNER", "ADMIN", dll.
  };
}