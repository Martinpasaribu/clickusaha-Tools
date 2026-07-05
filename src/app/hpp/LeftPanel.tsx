/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { InputField, SelectField, UnitSelect } from './FormInput';

interface LeftPanelProps {
  product: any;
  setProduct: (data: any) => void;
  biayaVariabel: any[];
  projection: any;
  setProjection: (data: any) => void;
  financialResult: any;
  handleImageUpload: (e: any) => void;
  handleAddField: () => void;
  handleRemoveField: (id: string) => void;
  handleUpdateField: (id: string, field: string, value: any) => void;
  formatIDR: (val: number) => string;
}

export const LeftPanel = (props: LeftPanelProps) => {
const { product, setProduct, biayaVariabel, projection, setProjection, financialResult, handleImageUpload, handleAddField, handleRemoveField, handleUpdateField, formatIDR } = props;
  // State untuk biaya tambahan dinamis
  const [biayaTambahan, setBiayaTambahan] = useState<Array<{id: number, nama: string, nominal: number}>>([]);

useEffect(() => {
  const totalBiayaTambahan = biayaTambahan.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);
  
  // Cek apakah nilainya BENAR-BENAR berubah sebelum memanggil setProduct
  // Ini mencegah re-render jika nilainya sama
  if (product.tambahanBiaya !== totalBiayaTambahan) {
    setProduct((prev: any) => ({ ...prev, tambahanBiaya: totalBiayaTambahan }));
  }
}, [biayaTambahan, product.tambahanBiaya, setProduct]); // Tambahkan dependencies yang lengkap

const getTotalBiayaLain = () => {
  return biayaTambahan.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);
};

  const tambahBiaya = () => {
    setBiayaTambahan([...biayaTambahan, { id: Date.now(), nama: "", nominal: 0 }]);
  };

  const updateBiaya = (id: number, field: string, value: any) => {
    setBiayaTambahan(biayaTambahan.map(b => b.id === id ? {...b, [field]: value} : b));
  };

  return (
    <section className="xl:col-span-5 space-y-6">
      {/* 1. IDENTITAS & VISUAL */}
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Identitas & Klasifikasi</h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Nama SKU" type="text" value={product.nama} onChange={(v) => setProduct({...product, nama: v})} className="col-span-2" />
          <SelectField label="Tipe Output" value={product.tipeOutput} onChange={(v) => setProduct({...product, tipeOutput: v})} 
            options={[{label: "Produk Akhir (Siap Jual)", value: "jadi"}, {label: "WIP (Setengah Jadi)", value: "setengah_jadi"}]} />
          <SelectField label="Mode Perhitungan" value={product.modePerhitungan} onChange={(v) => setProduct({...product, modePerhitungan: v})} 
            options={[{label: "Per Unit (Pcs)", value: "pcs"}, {label: "Per Batch", value: "batch"}]} />
          {product.modePerhitungan === "batch" && (
            <InputField label="Output per Batch" value={product.batchSize} onChange={(v) => setProduct({...product, batchSize: v})} />
          )}
          <InputField label="Harga Jual Saat Ini (Rp)" value={product.hargaJualSaatIni} onChange={(v) => setProduct({...product, hargaJualSaatIni: v})} />
        </div>

        {/* Visualisasi Gambar */}
        <div className="mt-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Visualisasi Representatif</label>
          <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {product.image ? (
              <div className="flex items-center gap-3"><img src={product.image} className="h-10 w-10 object-cover rounded" alt="SKU" /> <span className="text-xs font-semibold text-emerald-600">Mockup Terunggah</span></div>
            ) : <span className="text-xs text-slate-400">Klik/Seret gambar produk di sini</span>}
          </div>
        </div>
      </div>

        {/* 2. BIAYA VARIABEL */}
        <div className="bg-card border border-border-subtle p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-main uppercase tracking-wider">Komponen Biaya Variabel</h3>
            <button 
            onClick={handleAddField} 
            className="text-xs bg-main text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all"
            >
            + Tambah Bahan
            </button>
        </div>

        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
        {biayaVariabel.map((item) => {
            // Cari hasil perhitungan spesifik untuk bahan ini
            const result = financialResult.rincianBahanBaku.find((r: any) => r.id === item.id);
            const biayaItem = result ? result.biayaTerhitung : 0;

            return (
            <div key={item.id} className="p-5 bg-page-bg border border-border-subtle rounded-xl relative group transition-all hover:border-brand-auth/30">
                <button 
                onClick={() => handleRemoveField(item.id)} 
                className="absolute top-3 right-3 text-disabled hover:text-brand-error transition-colors"
                >
                ✕
                </button>
                
                {/* Header Bahan dengan Biaya */}
                <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <InputField 
                    label="Nama Bahan" 
                    type="text" 
                    value={item.namaBahan} 
                    onChange={(v) => handleUpdateField(item.id, "namaBahan", v)} 
                    />
                </div>

                </div>

                {/* Takaran Pakai */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                <InputField 
                    label="Takaran Pakai" 
                    value={item.takaranPakai} 
                    onChange={(v) => handleUpdateField(item.id, "takaranPakai", v)} 
                />
                <UnitSelect 
                    label="Satuan Pakai" 
                    value={item.satuanPakai} 
                    onChange={(v) => handleUpdateField(item.id, "satuanPakai", v)} 
                />
                </div>

                {/* Divider Info Pembelian */}
                <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-subtle"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-page-bg px-2 text-[9px] font-bold text-disabled uppercase tracking-widest">
                    Info Pembelian Bahan
                    </span>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                <InputField 
                    label="Harga Beli (Rp)" 
                    value={item.pembelianHarga} 
                    onChange={(v) => handleUpdateField(item.id, "pembelianHarga", v)} 
                />
                <div className="grid grid-cols-2 gap-2">
                    <InputField 
                    label="Jumlah" 
                    value={item.pembelianJumlah} 
                    onChange={(v) => handleUpdateField(item.id, "pembelianJumlah", v)} 
                    />
                    <UnitSelect 
                    label="Satuan" 
                    value={item.pembelianSatuan} 
                    onChange={(v) => handleUpdateField(item.id, "pembelianSatuan", v)} 
                    />
                </div>
                </div>
                                
                <div className="ml-2 text-left mt-2">
                    <span className="block text-[9px] font-bold text-disabled uppercase">Biaya Item</span>
                    <span className="text-sm font-black text-brand-auth">{formatIDR(biayaItem)}</span>
                </div>
            </div>
            );
        })}
        </div>

        {/* Summary Total */}
        <div className="mt-6 pt-4 border-t border-border-subtle flex justify-between items-center bg-main p-4 rounded-xl shadow-inner">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subtotal Biaya Bahan /Pcs</span>
            <span className="text-lg font-black text-white">{formatIDR(financialResult.biayaBahanPerPcs)}</span>
        </div>
        </div>



      {/* 4. ALOKASI & TARGET */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KOLOM ALOKASI */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Alokasi Biaya</h3>
          <p className="text-[10px] text-slate-400 italic">Alokasi sebagian dari total biaya bulanan ke setiap produk yang terjual</p>
          
          <SelectField 
            label="Metode Alokasi" 
            value={product.modeAlokasiBiayaTetap} 
            onChange={(v) => setProduct({...product, modeAlokasiBiayaTetap: v})} 
            options={[{label: "Bagi Rata (Seluruh SKU)", value: "bagi_rata"}, {label: "Bebankan Sepenuhnya", value: "produk_ini_saja"}]} 
          />
          
          <InputField 
            label="Biaya Tetap Bulanan (Global/Perusahaan)" 
            value={product.totalBiayaTetapGlobal} 
            onChange={(v) => setProduct({...product, totalBiayaTetapGlobal: v})} 
          />

          <InputField 
            label="Target Penjualan Produk ini (Unit/Bulan)" 
            value={product.estimasiVolumeBulanan} 
            onChange={(v) => setProduct({...product, estimasiVolumeBulanan: v})} 
          />
        </div>

        {/* KOLOM BIAYA LAIN & TARGET PROFIT */}
        <div className="space-y-6">

          {/* Biaya Lain */}
<div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Biaya Operasional Lain</h3>
    <button onClick={tambahBiaya} className="text-[10px] font-bold text-brand-admin">+ TAMBAH</button>
  </div>
  <div className="space-y-2">
    {biayaTambahan.map((item) => (
      <div key={item.id} className="flex gap-2">
        <input 
          className="w-1/2 text-xs p-2 border rounded" 
          placeholder="Nama Biaya" 
          value={item.nama} 
          onChange={(e) => updateBiaya(item.id, 'nama', e.target.value)} 
        />
        <input 
          type="number" 
          className="w-1/2 text-xs p-2 border rounded" 
          placeholder="Total (Rp)" 
          value={item.nominal || ""} // Gunakan "" agar placeholder muncul jika kosong
          onChange={(e) => updateBiaya(item.id, 'nominal', e.target.value)} 
        />
      </div>
    ))}
  </div>
  </div>
  {/* Opsional: Tampilkan total di bawah */}
  <div className="mt-4 pt-2 border-t text-right text-xs font-bold text-slate-700">
    Total Biaya Lain: {formatIDR(getTotalBiayaLain())}
  </div>
          {/* Target Profit */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Target Profit</h3>
            <div className="space-y-4">
              <InputField label="Target Laba Bersih/Bulan (Rp)" value={projection.targetLabaBersih} onChange={(v) => setProjection({...projection, targetLabaBersih: v})} />
              <InputField label="Harga Jual Skenario (Rp)" value={projection.hargaJualPilihan} onChange={(v) => setProjection({...projection, hargaJualPilihan: v})} />
            </div>
          </div>
        </div>

      </div>

        {/* 5. Benchmark Pendapatan (Rp) */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Benchmark Pendapatan (Rp)</h3>
            <InputField 
                label="Rata-rata Harian (Rp)" 
                value={product.pendapatanRataHarian} 
                onChange={(v) => setProduct({...product, pendapatanRataHarian: Number(v)})} 
            />
            <InputField 
                label="Rata-rata Mingguan (Rp)" 
                value={product.pendapatanRataMingguan} 
                onChange={(v) => setProduct({...product, pendapatanRataMingguan: Number(v)})} 
            />
        </div>

        {/* 6. Benchmark Volume Penjualan (Qty) */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Benchmark Volume (Qty)</h3>
            <InputField 
                label="Rata-rata Qty Harian" 
                value={product.pendapatanQtyRataHarian} 
                onChange={(v) => setProduct({...product, pendapatanQtyRataHarian: Number(v)})} 
            />
            <InputField 
                label="Rata-rata Qty Mingguan" 
                value={product.pendapatanQtyRataMingguan} 
                onChange={(v) => setProduct({...product, pendapatanQtyRataMingguan: Number(v)})} 
            />
        </div>

      
    </section>
  );
};