// app/page.tsx

import Link from "next/link";
import {
  Calculator,
  ImageIcon,
  FileImage,
  FileText,
  ScanText,
  FileArchive,
  QrCode,
  FileSpreadsheet,
} from "lucide-react";

const tools = [
  {
    title: "Perhitungan HPP",
    description: "Hitung Harga Pokok Produksi dengan cepat dan akurat.",
    href: "/hpp",
    icon: Calculator,
  },
  {
    title: "Convert Image",
    description: "Ubah format JPG, PNG, WEBP, SVG dan lainnya.",
    href: "/tools/convert-image",
    icon: ImageIcon,
  },
  {
    title: "Remove Background",
    description: "Hapus background gambar secara otomatis.",
    href: "/tools/remove-background",
    icon: FileImage,
  },
  {
    title: "PDF to Word",
    description: "Konversi file PDF menjadi dokumen Word.",
    href: "/tools/pdf-to-word",
    icon: FileText,
  },
  {
    title: "OCR Image",
    description: "Ekstrak teks dari gambar menjadi tulisan.",
    href: "/tools/ocr",
    icon: ScanText,
  },
  {
    title: "Compress PDF",
    description: "Perkecil ukuran file PDF tanpa mengurangi kualitas.",
    href: "/tools/compress-pdf",
    icon: FileArchive,
  },
  {
    title: "QR Generator",
    description: "Buat QR Code untuk URL, Text maupun WhatsApp.",
    href: "/tools/qr-generator",
    icon: QrCode,
  },
  {
    title: "Excel Tools",
    description: "Berbagai tools untuk file Excel dan Spreadsheet.",
    href: "/tools/excel",
    icon: FileSpreadsheet,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-border-subtle bg-card p-10">
          <span className="rounded-full bg-brand-admin/10 px-4 py-1 text-sm font-medium text-brand-admin">
            ClickUsaha Tools
          </span>

          <h1 className="mt-5 text-4xl font-bold text-main md:text-5xl">
            Semua Tools Bisnis Dalam Satu Tempat
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-muted">
            ClickUsaha menyediakan berbagai tools yang membantu pekerjaan
            bisnis Anda, mulai dari Perhitungan HPP, Convert Image, Remove
            Background, PDF Converter, OCR, QR Generator hingga berbagai tools
            produktivitas lainnya.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#tools"
              className="rounded-xl bg-brand-admin px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Mulai Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section
        id="tools"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-main">
            Tools Populer
          </h2>

          <p className="mt-2 text-muted">
            Pilih tools yang ingin Anda gunakan.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group rounded-2xl border border-border-subtle bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-admin hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-admin/10 transition group-hover:bg-brand-admin group-hover:text-white">
                  <Icon
                    size={28}
                    className="text-brand-admin group-hover:text-white"
                  />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-main">
                  {tool.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {tool.description}
                </p>

                <div className="mt-6 flex items-center font-medium text-brand-admin">
                  Buka Tools
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}