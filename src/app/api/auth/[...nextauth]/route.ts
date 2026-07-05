/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMainDB, connectTenantDB } from "@/lib/mongoosedb";
import { Schema } from "mongoose";
import GlobalUser from "@/lib/models/GlobalUser"; // Pastikan mengarah ke model User pusat yang sama

const TenantUserSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password wajib diisi");
        }

        try {
          // ========================================================
          // TAHAP 1: VALIDASI UTAMA DI MAIN DB (PUSAT)
          // ========================================================
          await connectMainDB();
          
          const globalUser = await GlobalUser.findOne({ username: credentials.username }).lean() as any;

          if (!globalUser) {
            throw new Error("User tidak terdaftar dalam sistem pusat");
          }

          // Validasi Password Utama
          if (globalUser.password !== credentials.password) {
            throw new Error("Password yang Anda masukkan salah");
          }

          // ========================================================
          // ⚡ JALUR KHUSUS: BYPASS JIKA ROLE ADALAH OWNER_SYSTEM
          // ========================================================
          if (globalUser.role === "OWNER_SYSTEM") {
            console.log(`🔑 [NextAuth Root Access]: Operator [${globalUser.username}] berhasil login ke System Center.`);
            return {
              id: globalUser._id.toString(),
              name: globalUser.name,
              username: globalUser.username,
              role: "OWNER_SYSTEM",
              databaseName: "master_system", // Dikunci tetap di database induk
            };
          }

          // ========================================================
          // TAHAP 2: VERIFIKASI DATA USER OPERASIONAL DI SUB-TENANT DB
          // (Hanya dieksekusi oleh OWNER cabang, ADMIN, SUPERVISOR, TUKANG)
          // ========================================================
          if (!globalUser.databaseName) {
            throw new Error("Akses database sub-tenant belum dikonfigurasi untuk akun ini");
          }

          const tenantDb = await connectTenantDB(globalUser.databaseName);
          const TenantUserModel = tenantDb.models.users || tenantDb.model("users", TenantUserSchema);
          const localTenantUser = await TenantUserModel.findOne({ username: credentials.username }).lean() as any;

          if (!localTenantUser) {
            // throw new Error(`Akun ${credentials.username} aktif di pusat, namun tidak ditemukan di database ${globalUser.databaseName} cabang ini`);
            throw new Error(`Akun ${credentials.username} aktif di pusat, namun tidak ditemukan di database cabang ini`);
          }

          // Kembalikan objek data gabungan untuk user operasional multi-tenant
          return {
            id: localTenantUser._id.toString(),
            name: localTenantUser.name,
            username: localTenantUser.username,
            role: localTenantUser.role,
            databaseName: globalUser.databaseName,
            businessName: globalUser.businessName,
          };

        } catch (error: any) {
          console.error("🚨 [NEXTAUTH AUTHORIZE MULTI-TENANT ERROR]:", error.message);
          throw new Error(error.message || "Terjadi kegagalan otentikasi server");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.databaseName = (user as any).databaseName;
        token.businessName = (user as any).businessName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).databaseName = token.databaseName;
        (session.user as any).businessName = token.businessName;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Hari kedaluwarsa sesi
  },
  pages: {
    signIn: "/auth/login", // Gerbang login default (operasional)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };