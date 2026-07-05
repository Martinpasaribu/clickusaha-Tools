/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Boxes, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/global/ThemeToggle";
import UserProfile from "@/components/global/UserProfile";
import { useAuth } from "@/lib/hooks/useAuth";

type RoleType = "OWNER" | "ADMIN" | "SUPERVISOR" | "TUKANG";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Konfigurasi Navigasi Komplit Berdasarkan Role
  const allLinks = useMemo(() => [
    { name: "Tukang", path: "/tukang", roles: ["OWNER", "ADMIN", "SUPERVISOR", "TUKANG"] },
    { name: "Supervisor", path: "/supervisor", roles: ["OWNER", "ADMIN", "SUPERVISOR"] },
    { name: "Admin", path: "/admin", roles: ["OWNER", "ADMIN"] },
    { name: "Owner", path: "/owner", roles: ["OWNER"] },
    { name: "Supplier", path: "/supplier", roles: ["OWNER", "ADMIN"] },
  ], []);

  // Filter Menu Aman
  const authorizedMenuItems = useMemo(() => {
    if (!user?.role) return [];
    return allLinks.filter((item) => item.roles.includes(user.role as RoleType));
  }, [allLinks, user?.role]);

  if (!user) {
    return <div className="h-14 w-full bg-navbar-bg border-b border-border-subtle" />;
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-navbar-bg backdrop-blur-md border-b border-border-subtle transition-colors">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* LEFT SECTION: BRAND LOGO & BUSINESS NAME */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-main font-mono tracking-wider font-semibold text-xs uppercase select-none">
              <Boxes size={18} strokeWidth={2.5} className="text-muted" />
            </Link>

            {user.businessName && (
              <div className="flex items-center gap-3 select-none">
                <div className="h-4 w-[1px] bg-border-subtle hidden sm:block" />
                <span className="text-[11px] font-sans font-semibold tracking-wide text-main bg-ui-hover/30 px-2.5 py-1 rounded-md border border-border-subtle/50 uppercase max-w-[140px] sm:max-w-[200px] truncate">
                  {user.businessName}
                </span>
              </div>
            )}

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center gap-1 ml-4">
              {authorizedMenuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative px-3 py-1.5 text-xs transition-colors rounded-lg font-medium ${
                      isActive ? "text-main bg-ui-hover" : "text-muted hover:text-main hover:bg-ui-hover/40"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT SECTION: DESKTOP CONTROLS */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <div className="h-3 w-[1px] bg-border-subtle" />
            <div className="flex items-center gap-2.5">
              <UserProfile />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[11px] font-medium text-main max-w-[80px] truncate">{user.name}</span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-disabled">{user.role}</span>
              </div>
            </div>
          </div>

          {/* 🔥 MOBILE TOGGLE CONTROL (Sangat bersih, hanya tombol Hamburger/X) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-ui-hover/50 outline-none transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div 
        className={`md:hidden transition-all duration-200 ${
          isOpen 
            ? "max-h-screen overflow-visible border-b border-border-subtle" 
            : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-5 space-y-1 bg-card">
          {/* Daftar Navigasi Utama */}
          {authorizedMenuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive ? "text-main bg-ui-hover" : "text-muted hover:text-main"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          {/* 🔥 SEPARATOR & THEME TOGGLE DI LALUAN LIST (Baru) */}
          <div className="pt-2 mt-2 border-t border-border-subtle/50 flex items-center justify-between px-3">
            
      
          </div>
          
          {/* Mobile User Profile Metadata */}
          <div className="pt-3 mt-2 border-t border-border-subtle px-3 flex items-center justify-between">
            <div className="flex items-center justify-between gap-2.5 text-left w-full">
              
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-main max-w-[120px] truncate">{user.name}</span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-disabled">{user.role}</span>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="h-3 w-[1px] bg-border-subtle" />
                <UserProfile />
              </div>

            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}