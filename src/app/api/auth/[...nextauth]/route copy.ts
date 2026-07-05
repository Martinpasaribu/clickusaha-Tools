// /* eslint-disable @typescript-eslint/no-explicit-any */

// // [..nextauth]/routeModule.ts

// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.username || !credentials?.password) return null;

//         const client = await clientPromise;
//         const db = client.db("logistik_db");
        
//         const user = await db.collection("users").findOne({ username: credentials.username });
        
//         // Sesuaikan dengan enkripsi password Anda (misal: bcrypt)
//         if (user && user.password === credentials.password) {
//           return {
//             id: user._id.toString(), // 👈 Konversi ke string terlebih dahulu
//             name: user.name,
//             username: user.username,
//             role: user.role,
//           };
//         }
//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     // 1. Simpan data user dari authorize ke dalam JWT Token
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role;
//         token.username = (user as any).username;
//       }
//       return token;
//     },
//     // 2. Transfer data dari JWT Token ke dalam Session agar bisa diakses oleh getServerSession()
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role;
//         (session.user as any).username = token.username;
//       }
//       return session;
//     }
//   },
//   session: {
//     strategy: "jwt"
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };