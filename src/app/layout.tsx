import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/global/ThemeProvider";
import AuthProvider from "@/components/global/AuthProvider";

export const metadata: Metadata = {
  title: "Sistem Rekonsiliasi Logistik Proyek",
  description: "Sistem Pemantauan Barang PO vs Lapangan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-200">
        <AuthProvider>

          <ThemeProvider>
            {children}
          </ThemeProvider>

        </AuthProvider>
      </body>
    </html>
  );
}