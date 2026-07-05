// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Pastikan role diseragamkan ke huruf besar (UPPERCASE) menghindari typo data di DB
    const userRole = (token?.role as string)?.toUpperCase();

    // 1. Proteksi Rute Owner
    if (path.startsWith("/owner")) {
      // Hanya OWNER yang boleh masuk
      if (userRole !== "OWNER") {
        // return NextResponse.redirect(new URL("/auth/login", req.url));
        return NextResponse.redirect(new URL("/main", req.url));
      }
    }

    // 2. Proteksi Rute Admin
    if (path.startsWith("/admin")) {
      // OWNER dan ADMIN boleh masuk
      if (userRole !== "OWNER" && userRole !== "ADMIN") {
        // return NextResponse.redirect(new URL("/auth/login", req.url));
        return NextResponse.redirect(new URL("/main", req.url));
      }
    }

    // 3. Proteksi Rute Tukang
    if (path.startsWith("/tukang")) {
      // Semua role (OWNER, ADMIN, TUKANG) boleh masuk
      if (userRole !== "OWNER" && userRole !== "ADMIN" && userRole !== "TUKANG" && userRole !== "SUPERVISOR") {
        // return NextResponse.redirect(new URL("/auth/login", req.url));
        return NextResponse.redirect(new URL("/main", req.url));
      }
    }
    if (path.startsWith("/supervisor")) {
      // Semua role (OWNER, ADMIN, TUKANG) boleh masuk
      if (userRole !== "OWNER" && userRole !== "ADMIN" && userRole !== "SUPERVISOR" ) {
        // return NextResponse.redirect(new URL("/auth/login", req.url));
        return NextResponse.redirect(new URL("/main", req.url));
      }
    }
  },
  {
    callbacks: {
      // Jika token ada (sudah login), jalankan fungsi fungsi middleware di atas
      authorized: ({ token }) => !!token,
    },
    pages: {
      // signIn: "/auth/login",
      signIn: "/main",
    },
  }
);

// ⚠️ CRITICAL: Daftarkan semua folder rute yang ingin diproteksi di sini
export const config = {
  matcher: [
    "/owner/:path*", 
    "/admin/:path*", 
    "/tukang/:path*", 
    "/supervisor/:path*",
    "/settings/:path*"
  ],
};