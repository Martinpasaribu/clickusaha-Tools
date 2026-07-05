export const CONVERSION_FACTORS: Record<string, number> = {
  // --- SATUAN BERAT ---
  "mg": 0.001,
  "gr": 1,
  "gram": 1,
  "ons": 100,
  "kg": 1000,
  "kilogram": 1000,

  // --- SATUAN VOLUME ---
  "ml": 1,
  "mililiter": 1,
  "cl": 10,
  "dl": 100,
  "liter": 1000,
  "l": 1000,

  // --- SATUAN UNIT/KUANTITAS ---
  "pcs": 1,
  "buah": 1,
  "biji": 1,
  "box": 1,
  "pack": 1,
  "set": 1,
  "lembar": 1,
  "pasang": 1,
  "sachet": 1,

// --- SATUAN ENERGI / DAYA ---
  "w": 0.001,      // 1 Watt = 0.001 kW (daya)
  "watt": 0.001,
  "kw": 1,         // Kilowatt
  "wh": 0.001,     // Watt-hour ke kWh
  "kwh": 1,        // kWh sebagai unit dasar energi
  "m3": 1,         // Meter kubik

  // --- SATUAN WAKTU (Untuk Tenaga Kerja / Sewa Mesin) ---
  "detik": 0.0166667,
  "menit": 1,
  "jam": 60,
  "hari": 1440, // 60 menit * 24 jam
  
  // --- SATUAN PANJANG / AREA (Opsional: untuk kain, kertas, dll) ---
  "cm": 1,
  "m": 100,
  "meter": 100,
  "m2": 1,      // Meter persegi

  // --- SATUAN KECIL / TEKNIS ---
  "sdt": 0.005,    // Sendok teh (~5ml)
  "sdm": 0.015,    // Sendok makan (~15ml)
  "tetes": 0.0001, // Untuk pewarna/perasa

  // --- SATUAN JASA / TENAGA KERJA ---
  "orang": 1,      // 1 orang pekerja
  "jasa": 1,       // Flat rate per layanan
  "shift": 8,      // 1 shift kerja (dikonversi ke jam)
  "hari-k": 8,       // 1 hari kerja (asumsi 8 jam)
};


export const UNIT_OPTIONS = [
  { label: "--- BERAT ---", value: "", disabled: true },
  { label: "Gram (gr)", value: "gr" },
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Ons", value: "ons" },
  
  { label: "--- VOLUME ---", value: "", disabled: true },
  { label: "Mililiter (ml)", value: "ml" },
  { label: "Liter", value: "liter" },
  
  { label: "--- UNIT / KUANTITAS ---", value: "", disabled: true },
  { label: "Pcs / Buah", value: "pcs" },
  { label: "Box", value: "box" },
  { label: "Pack", value: "pack" },
  { label: "Sachet", value: "sachet" },
  { label: "Set", value: "set" },
  
    { label: "--- UTILITAS & WAKTU ---", value: "sep_util", disabled: true },
  { label: "Watt (W)", value: "watt" },
  { label: "Kilowatt (kW)", value: "kw" },
  { label: "kWh (Listrik)", value: "kwh" },
  { label: "Menit", value: "menit" },
  { label: "Jam", value: "jam" },
  
  { label: "--- PANJANG / AREA ---", value: "", disabled: true },
  { label: "Centimeter (cm)", value: "cm" },
  { label: "Meter (m)", value: "m" },
  { label: "Meter Persegi (m2)", value: "m2" },

  { label: "--- KEMASAN / UNIT KECIL ---", value: "sep_pkg", disabled: true },
  { label: "Sendok Teh (sdt)", value: "sdt" },
  { label: "Sendok Makan (sdm)", value: "sdm" },
  { label: "Tetes", value: "tetes" },

  { label: "--- TENAGA KERJA / JASA ---", value: "sep_hr", disabled: true },
  { label: "Per Orang", value: "orang" },
  { label: "Per Jasa (Flat)", value: "jasa" },
  { label: "Shift Kerja", value: "shift" },
  { label: "Hari Kerja", value: "hari-k" },
];