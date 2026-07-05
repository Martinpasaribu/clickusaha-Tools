import { UserRole, NoteUser } from "@/types/schema";

export const TYPE_FLOW = [
  // General
  { label: 'Pesanan dibuat', value: 'CPO' }, // 
  { label: 'Update QTY PO ', value: 'UIQ' }, // BAHAN JADI
  { label: 'QTY Diterima ', value: 'URQ' }, // BAHAN MENTAH 
  { label: 'Update Harga', value: 'UPR' }, // sayuran tersebut dikemas, diikat, atau dibungkus dalam satu wadah
  { label: 'Update Status', value: 'UST' }, // sayuran tersebut dikemas, diikat, atau dibungkus dalam satu wadah
  { label: 'Update Logistik', value: 'UGL' }, // sayuran tersebut dikemas, diikat, atau dibungkus dalam satu wadah
  { label: 'Hapus Barang', value: 'DEL' }, // sayuran tersebut dikemas, diikat, atau dibungkus dalam satu wadah
  
]


export const getRoleField = (
  role: UserRole
): keyof NoteUser => {
  const roleFieldMap: Record<UserRole, keyof NoteUser> = {
    OWNER: "owner",
    ADMIN: "admin",
    SUPERVISOR: "supervisor",
    TUKANG: "tukang",
  };

  return roleFieldMap[role];
};