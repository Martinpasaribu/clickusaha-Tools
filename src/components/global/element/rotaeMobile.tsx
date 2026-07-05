import React from 'react'

const RotationMobile = () => {

  return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center backdrop-blur-md animate-fade-in">
            <div className="max-w-xs space-y-6">
              {/* Container Ikon dengan Animasi Rotasi Profesional */}
              <div className="relative flex justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-xl shadow-emerald-500/5">
                  {/* Ikon Smartphone dari Lucide */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[spin_4s_linear_infinite]"
                  >
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                  
                  {/* Efek Indikator Panah Rotasi Kecil */}
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 animate-bounce">
                    ↻
                  </div>
                </div>
              </div>

              {/* Bagian Teks & Informasi */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-slate-100">
                  Rekomendasi Orientasi
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Silakan putar perangkat Anda ke posisi <span className="text-emerald-400 font-medium">Landscape</span> untuk visualisasi data tabel rekonsiliasi yang lebih optimal.
                </p>
              </div>

              {/* Indikator Tambahan Subtle */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Menunggu rotasi layar...
                </span>
              </div>
            </div>
          </div>
  )
}
export default RotationMobile