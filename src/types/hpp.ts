export interface BiayaVariabelItem {
  id: string;
  namaBahan: string;
  takaranPakai: number;
  satuanPakai: string;
  pembelianJumlah: number;
  pembelianSatuan: string;
  pembelianHarga: number;
}
export interface ProjectionState {
  targetLabaBersih: number;
  hargaJualPilihan: number;
}

export interface HppEngineResult {
  rincianBahanBaku: (BiayaVariabelItem & {
    biayaTerhitung: number;
  })[];

  biayaBahanPerPcs: number;
  totalVariableCostPerPcs: number;

  totalBiayaTetapTeralokasi: number;
  alokasiBiayaTetapPerPcs: number;

  totalHppPerProduk: number;

  hppSekarang: number;
  hppBaruDampak: number;

  hargaJualMinimum: number;
  marginDenganHargaSaatIni: number;
  saranHargaJual: number;

  marginKontribusiPerUnit: number;

  targetUnitBulan: number;
  targetUnitHari: number;

  potensiOmzetBulan: number;

  totalBiayaProduksiBulan: number;
  totalBiayaTotalBulan: number;

  bepUnit: number;
  bepValue: number;

  dataSimulasiGraph: ChartSimulationRow[];

  rekomendasiUnitUntukSamaDenganRataRata: number;

  benchmarkPendapatan: {
    harian: number;
    mingguan: number;
    bulanan: number;
    qtyHarian: number;
    qtyMingguan: number;
    qtyBulanan: number;
  };

  ringkasanBenchmark: {
    omzetTarget: number;
    omzetAktual: number;
    totalBiaya: number;
    labaBersihTarget: number;
  };

  rekomendasi: {
    unitHarian: number;
    isTerlampaui: boolean;
    selisih: number;
  };
}

export interface ChartSimulationRow {
  volume: number;
  Pendapatan: number;
  "Total Biaya": number;
  "Laba Bersih": number;
}
