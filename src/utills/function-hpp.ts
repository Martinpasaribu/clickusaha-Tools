import { CONVERSION_FACTORS } from "@/constants/unit";

export interface BiayaVariabelItem {
  id: string;
  namaBahan: string;
  takaranPakai: number;
  satuanPakai: string;
  pembelianJumlah: number;
  pembelianSatuan: string;
  pembelianHarga: number;
}

const normalizeToUnitDasar = (nilai: number, satuan: string): number => {
  const factor = CONVERSION_FACTORS[satuan.toLowerCase()] || 1;
  return nilai * factor;
};

export interface ProductState {
  nama: string;
  tipeOutput: "jadi" | "setengah_jadi";
  image: string | null;
  modePerhitungan: "pcs" | "batch";
  batchSize: number;
  modeAlokasiBiayaTetap: "bagi_rata" | "produk_ini_saja";
  totalBiayaTetapGlobal: number;
  jumlahVariasiProduk: number;
  tambahanBiaya: number; // Ini biaya operasional lain
  hargaJualSaatIni: number;
  estimasiVolumeBulanan: number;
  pendapatanRataHarian: number;
  pendapatanQtyRataHarian: number;
  pendapatanRataMingguan: number;
  pendapatanQtyRataMingguan: number;
}

export function hitungSistemHPP(
  product: ProductState,
  biayaVariabel: BiayaVariabelItem[],
  projection: ProjectionState,
  persentaseSensitivitas: number
): HppEngineResult {
  
  // 1. Hitung biaya bahan baku murni (Variable Cost per Pcs)
  const rincianBahanBaku = biayaVariabel.map((item) => {
    const takaranPakaiDasar = normalizeToUnitDasar(item.takaranPakai, item.satuanPakai);
    const pembelianJumlahDasar = normalizeToUnitDasar(item.pembelianJumlah, item.pembelianSatuan);
    const hargaPerUnitDasar = pembelianJumlahDasar > 0 ? (item.pembelianHarga / pembelianJumlahDasar) : 0;
    return { ...item, biayaTerhitung: takaranPakaiDasar * hargaPerUnitDasar };
  });

  const subtotalBiayaBahan = rincianBahanBaku.reduce((sum, item) => sum + item.biayaTerhitung, 0);
  const divisor = product.modePerhitungan === "batch" ? (product.batchSize || 1) : 1;
  const biayaBahanPerPcs = subtotalBiayaBahan / divisor;
  
  // HPP Murni (Hanya Variable Cost)
  const totalVariableCostPerPcs = biayaBahanPerPcs;

  // 2. Alokasi Biaya Tetap (Sewa/Gaji/dll - dibagi rata/per produk)
  let alokasiBiayaTetapBulanan = product.totalBiayaTetapGlobal;
  if (product.modeAlokasiBiayaTetap === "bagi_rata") {
    alokasiBiayaTetapBulanan = alokasiBiayaTetapBulanan / (product.jumlahVariasiProduk || 1);
  }

  const alokasiBiayaTetapPerPcs = product.estimasiVolumeBulanan > 0 
    ? alokasiBiayaTetapBulanan / product.estimasiVolumeBulanan 
    : alokasiBiayaTetapBulanan;

  // 3. HPP Dasar per Produk (Bahan + Biaya Tetap) -> TAMBAHAN BIAYA TIDAK MASUK SINI
  const totalHppPerProduk = totalVariableCostPerPcs + alokasiBiayaTetapPerPcs;

  // 4. Analisis Dampak Sensitivitas
  const hppSekarang = totalHppPerProduk;
  const hppBaruDampak = hppSekarang * (1 + persentaseSensitivitas / 100);
  const hargaJualMinimum = hppSekarang * 1.35;
  const marginDenganHargaSaatIni = product.hargaJualSaatIni - hppSekarang;
  const saranHargaJual = hppSekarang * 1.5;

  // 5. Target Penjualan & Margin Kontribusi
  const hargaJualSkenario = projection.hargaJualPilihan || product.hargaJualSaatIni;
  const marginKontribusiPerUnit = hargaJualSkenario - totalVariableCostPerPcs;

  // Total beban yang harus ditutupi oleh margin: (Biaya Tetap + Tambahan Biaya Operasional)
  const totalBebanBulanan = alokasiBiayaTetapBulanan + product.tambahanBiaya;

  const targetUnitBulan = marginKontribusiPerUnit > 0
    ? (projection.targetLabaBersih + totalBebanBulanan) / marginKontribusiPerUnit
    : 0;

  const targetUnitHari = targetUnitBulan / 30;
  const potensiOmzetBulan = targetUnitBulan * hargaJualSkenario;
  
  // Total Biaya Produksi Bulanan (Include Biaya Tambahan)
  const totalBiayaTotalBulan = totalBebanBulanan + (targetUnitBulan * totalVariableCostPerPcs);

  // 6. Break-Even Point (BEP)
  const bepUnit = marginKontribusiPerUnit > 0 ? totalBebanBulanan / marginKontribusiPerUnit : 0;
  const bepValue = bepUnit * hargaJualSkenario;

  // 7. Generasi dataset simulasi
  const maxVolumeSimulasi = Math.max(Math.ceil(targetUnitBulan * 1.3), 100);
  const steps = 6;
  const dataSimulasiGraph: ChartSimulationRow[] = Array.from({ length: steps + 1 }).map((_, i) => {
    const volume = Math.round((maxVolumeSimulasi / steps) * i);
    const omzet = volume * hargaJualSkenario;
    const totalCost = totalBebanBulanan + (volume * totalVariableCostPerPcs);
    const labaRugi = omzet - totalCost;
    return {
      volume,
      "Pendapatan": Math.round(omzet),
      "Total Biaya": Math.round(totalCost),
      "Laba Bersih": Math.round(labaRugi)
    };
  });

  // Benchmark
  const benchmarkPendapatan = {
    harian: product.pendapatanRataHarian || (product.pendapatanRataMingguan / 7),
    mingguan: product.pendapatanRataMingguan || (product.pendapatanRataHarian * 7),
    bulanan: (product.pendapatanRataHarian * 30) || (product.pendapatanRataMingguan * 4),
    qtyHarian: product.pendapatanQtyRataHarian || (product.pendapatanQtyRataMingguan / 7),
    qtyMingguan: product.pendapatanQtyRataMingguan || (product.pendapatanQtyRataHarian * 7),
    qtyBulanan: (product.pendapatanQtyRataHarian * 30) || (product.pendapatanQtyRataMingguan * 4)
  };

  const rekomendasi = {
    unitHarian: Math.round(benchmarkPendapatan.harian / (hargaJualSkenario || 1)),
    isTerlampaui: benchmarkPendapatan.qtyHarian >= (potensiOmzetBulan / 30 / (hargaJualSkenario || 1)),
    selisih: Math.round((potensiOmzetBulan / 30 / (hargaJualSkenario || 1)) - benchmarkPendapatan.qtyHarian)
  };

  return {
    rincianBahanBaku,
    biayaBahanPerPcs,
    totalVariableCostPerPcs,
    totalBiayaTetapTeralokasi: alokasiBiayaTetapBulanan,
    alokasiBiayaTetapPerPcs,
    totalHppPerProduk,
    hppSekarang,
    hppBaruDampak,
    hargaJualMinimum,
    marginDenganHargaSaatIni,
    saranHargaJual,
    marginKontribusiPerUnit,
    targetUnitBulan,
    targetUnitHari,
    potensiOmzetBulan,
    totalBiayaProduksiBulan: (targetUnitBulan * totalVariableCostPerPcs),
    totalBiayaTotalBulan,
    bepUnit,
    bepValue,
    dataSimulasiGraph,
    rekomendasiUnitUntukSamaDenganRataRata: Math.round(benchmarkPendapatan.harian / (hargaJualSkenario || 1)),
    benchmarkPendapatan,
    ringkasanBenchmark: {
      omzetTarget: benchmarkPendapatan.bulanan,
      omzetAktual: potensiOmzetBulan,
      totalBiaya: totalBiayaTotalBulan,
      labaBersihTarget: benchmarkPendapatan.bulanan - totalBiayaTotalBulan
    },
    rekomendasi
  };
}