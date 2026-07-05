/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserRole } from "@/types/schema";
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const role = ((session?.user as any)?.role || "MEMBER") as UserRole;

  return {
    session,
    status,

    user: {
      name: session?.user?.name || "User",
      username: (session?.user as any)?.username || "",
      role,
      avatarUrl: session?.user?.image,
      businessName: session?.user?.businessName,
    },

    isOwner: role === "OWNER",
    isAdmin: role === "ADMIN",
    isSupervisor: role === "SUPERVISOR",
    isTukang: role === "TUKANG",

    isAuthenticated: !!session?.user,
  };
}