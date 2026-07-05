/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "./button/LogoutButton";


export default function UserProfile() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-ui-hover border border-border-subtle animate-pulse" />
    );
  }

  if (!session || !session.user) return null;

  const currentUser = {
    name: session.user.name || "User",
    username: (session.user as any).username || "No ID", 
    role: (session.user as any).role || "MEMBER",
    avatarUrl: (session.user as any).image || undefined,
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex z-50 items-center gap-2 p-1 rounded-full hover:bg-ui-hover border border-transparent hover:border-border-subtle transition-all outline-hidden focus:ring-2 focus:ring-brand-auth/20 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentUser.avatarUrl ? (
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-auth text-white flex items-center justify-center font-semibold text-xs select-none shadow-xs">
            {getInitial(currentUser.name)}
          </div>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border-subtle rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User Detail Header */}
          <div className="px-4 py-2.5 border-b border-border-subtle mb-1">
            <p className="text-xs font-semibold text-main truncate">{currentUser.name}</p>
            <p className="text-[11px] text-muted truncate mt-0.5">ID: {currentUser.username}</p>
            <span className="inline-flex mt-1.5 px-2 py-0.5 bg-brand-auth/10 text-brand-auth text-[10px] font-bold rounded-md uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>

          {/* Menu Links */}
          <Link
            href="/settings/profile"
            onClick={() => setIsOpen(false)}
            className="flex px-4 py-2 text-xs font-medium text-muted hover:text-main hover:bg-ui-hover transition-colors"
          >
            Pengaturan Akun
          </Link>
          <Link
            href="/help"
            onClick={() => setIsOpen(false)}
            className="flex px-4 py-2 text-xs font-medium text-muted hover:text-main hover:bg-ui-hover transition-colors"
          >
            Bantuan & Dukungan
          </Link>

          <hr className="border-border-subtle my-1" />

          {/* PANGGIL LOGOUT BUTTON COMPONENT */}
          <div className="px-1">
            <LogoutButton onBeforeLogout={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}