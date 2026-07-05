"use client";

interface InputStatusProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  role?: string;
}

export default function InputStatus({
  value,
  onChange,
  disabled = false,
  role = "",
}: InputStatusProps) {
  const statuses = [
    { value: "MENUNGGU_PO", label: "( PENDING PO ) Diajukan Tukang" },
    { value: "DIBELI", label: "( DIBELI ) Dana Keluar Admin" },
    { value: "DALAM_PENGIRIMAN", label: "( DI KIRIM ) Barang sedang dikirim" },
    { value: "PENGECEKAN_BARANG", label: "( PENGECEKAN ) Dilakukan Pengecekan Barang" },
    { value: "PENDING_VERIFIKASI", label: "( PENDING ) Pengecekan Barang di-pending" },
    { value: "DITERIMA_LAPANGAN", label: "( DI LAPANGAN ) Barang diterima Lengkap" },
    { value: "SUDAH_DIBAYAR", label: "( PAID ) Final Pembayaran Owner" },
    { value: "REFUND", label: "( REFUND ) Pengembalian Produk" },
    { value: "DIBATALKAN", label: "( DIBATALKAN ) Pembatalan Pembelian Produk" },
    { value: "SELESAI", label: "( SELESAI ) Proses Barang selesai" },
  ];

  const finalStatuses = [
    "SUDAH_DIBAYAR",
    "REFUND",
    "DIBATALKAN",
  ];

  const currentStatus = statuses.find(
    (status) => status.value === value
  );

  let availableStatuses = statuses;

  switch (role) {
    case "SPV":
    case "SUPERVISOR":
      availableStatuses = statuses.filter((status) =>
        [
          "PENGECEKAN_BARANG",
          "PENDING_VERIFIKASI",
          "DITERIMA_LAPANGAN",
        ].includes(status.value)
      );
      break;

    case "TUKANG":
      availableStatuses = currentStatus ? [currentStatus] : [];
      break;

    case "ADMIN":
    case "OWNER":
    default:
      availableStatuses = statuses;
      break;
  }

  // Pastikan status yang sedang aktif tetap muncul
  if (
    currentStatus &&
    !availableStatuses.some((s) => s.value === currentStatus.value)
  ) {
    availableStatuses = [currentStatus, ...availableStatuses];
  }

  // Lock jika status final dan bukan owner
  const isLocked =
    finalStatuses.includes(value) &&
    role !== "OWNER";

  return (
    <div>
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
        Status Alur Rekonsiliasi
      </label>

      <select
        disabled={disabled || isLocked || role === "TUKANG"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-xs rounded-xl border border-border-strong bg-card text-main outline-none focus:ring-2 focus:ring-brand-auth/50 focus:border-brand-auth disabled:bg-ui-hover/40 disabled:text-disabled transition-all font-bold cursor-pointer"
      >
        {availableStatuses.map((status) => (
          <option
            key={status.value}
            value={status.value}
            className="bg-card text-main font-semibold"
          >
            {status.label}
          </option>
        ))}
      </select>

      {isLocked && (
        <p className="mt-2 text-[11px] text-orange-500">
          Status sudah final. Hanya Owner yang dapat mengubah status ini.
        </p>
      )}
    </div>
  );
}