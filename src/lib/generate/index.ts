
// lib/generate/index.ts



import { Db } from 'mongodb';

/**
 * Fungsi generate kode berdasarkan format: 3 Huruf Barang - MenitJamBulanTanggal
 * Jika terjadi duplikasi di menit yang sama, akan otomatis ditambahkan nomor urut di belakangnya.
 * Contoh normal: SEM-20151106
 * Contoh duplikat: SEM-20151106-01, SEM-20151106-02
 */export async function GenerateCustomItemCode(db: Db, name: string, date: Date): Promise<string> {
  // 1. Ambil 3 karakter pertama & jadikan uppercase
  const cleanName = (name || 'BRG').replace(/[^a-zA-Z0-9]/g, ''); 
  const prefixName = cleanName.substring(0, 3).toUpperCase().padEnd(3, 'X');

  // 2. Ambil komponen waktu
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');        // Tanggal 6 -> 06
  const month = String(date.getMonth() + 1).padStart(2, '0'); // November -> 11

  // 🔥 Format baru: Menit (20) + Jam (15) + Tanggal (06) + Bulan (11) -> 20150611
  const baseCode = `${prefixName}-${minutes}${hours}${day}${month}`;

  // 3. Cari di database apakah sudah ada kode yang mirip di menit yang sama
  const existingItems = await db.collection('barang')
    .find({ itemCode: { $regex: `^${baseCode}` } })
    .toArray();

  // Jika tidak ada duplikat, gunakan baseCode murni
  if (existingItems.length === 0) {
    return baseCode;
  }

  // Jika ada duplikat, cari nomor urut tertinggi yang sudah dipakai
  let maxSuffix = 0;
  
  existingItems.forEach(item => {
    const code = item.itemCode;
    if (code === baseCode) {
      maxSuffix = Math.max(maxSuffix, 0);
    } else {
      const parts = code.split('-');
      const suffix = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(suffix)) {
        maxSuffix = Math.max(maxSuffix, suffix);
      }
    }
  });

  // Tambahkan +1 untuk nomor urut baru jika duplikat (Contoh: SEM-20150611-01)
  const nextSuffix = String(maxSuffix + 1).padStart(2, '0');
  
  return `${baseCode}-${nextSuffix}`;
}