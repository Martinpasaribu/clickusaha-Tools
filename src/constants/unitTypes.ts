export interface MaterialUnitOption {
  name: string;   // Label yang tampil di UI pengguna
  value: string;  // Kode singkatan yang disimpan ke MongoDB
}

export const COMMON_MATERIAL_UNITS: MaterialUnitOption[] = [
  // Satuan Volume & Berat (Sering untuk semen, pasir, cairan)
  { name: "Kilogram (kg)", value: "kg" },
  { name: "Sak / Kantong (sak)", value: "sak" },
  { name: "Kubik (m³)", value: "kubik" },
  { name: "Liter (ltr)", value: "ltr" },
  { name: "Ton (ton)", value: "ton" },

  // Satuan Hitungan Fisik / Batangan / Lembaran
  { name: "Pieces / Buah (pcs)", value: "pcs" },
  { name: "Batang (btg)", value: "btg" },
  { name: "Lembar (lbr)", value: "lbr" },
  { name: "Roll / Gulung (roll)", value: "roll" },
  { name: "Set (set)", value: "set" },
  { name: "Pasang (psg)", value: "psg" },

  // Satuan Panjang & Luas
  { name: "Meter (m)", value: "m" },
  { name: "Meter Lari (m¹)", value: "m1" },
  { name: "Meter Persegi (m²)", value: "m2" },
  { name: "Ikat (ikat)", value: "ikat" },

  // Satuan Armada / Pengiriman Logistik Besar
  { name: "Truk / Rit (rit)", value: "rit" },
  { name: "Colt Diesel (colt)", value: "colt" },
  { name: "Pick Up (box)", value: "box" },

  // Satuan Kemasan / Grosir Agen
  { name: "Dus / Karton (dus)", value: "dus" },
  { name: "Koli / Bal (koli)", value: "koli" },
  { name: "Palet (palet)", value: "palet" },
  { name: "Kaleng (klg)", value: "klg" },
  { name: "Drum (drum)", value: "drum" },
  { name: "Pail (pail)", value: "pail" },
  { name: "Unit (unit)", value: "unit" },
  { name: "Pack (pack)", value: "pack" },
  { name: "Bungkus (bks)", value: "bks" },

];