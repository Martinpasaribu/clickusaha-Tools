"use client";

interface ProductNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "OWNER" | "ADMIN" | "SUPERVISOR" | "TUKANG";
  note?: string;
  noteUser?: {
    owner?: string;
    admin?: string;
    supervisor?: string;
    tukang?: string;
  } | null;
}

export default function ProductNoteModal({
  isOpen,
  onClose,
  role,
  note,
  noteUser,
}: ProductNoteModalProps) {
  if (!isOpen) return null;

  const permissions = {
    OWNER: ["owner", "admin", "supervisor", "tukang"],
    ADMIN: ["admin", "supervisor", "tukang"],
    SUPERVISOR: ["admin", "supervisor", "tukang"],
    TUKANG: ["tukang"],
  };

  const allNotes = [
    {
      key: "owner",
      label: "Owner",
      value: noteUser?.owner,
    },
    {
      key: "admin",
      label: "Admin",
      value: noteUser?.admin,
    },
    {
      key: "supervisor",
      label: "Supervisor",
      value: noteUser?.supervisor,
    },
    {
      key: "tukang",
      label: "Tukang",
      value: noteUser?.tukang,
    },
  ];

  const noteItems = allNotes.filter(
    (item) =>
      permissions[role].includes(item.key) &&
      item.value &&
      item.value.trim() !== ""
  );

  const hasGeneralNote = note && note.trim() !== "";
  const hasUserNotes = noteItems.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-[var(--color-component-bg)] border border-[var(--color-border-subtle)] shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-lg font-semibold">
            Product Notes
          </h2>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md hover:bg-[var(--color-component-hover)] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* General Note - tampil untuk semua role */}
          {hasGeneralNote && (
            <div>
              <h3 className="font-medium mb-2">
                General Note
              </h3>

              <div className="p-3 rounded-lg bg-[var(--color-page-bg)] whitespace-pre-wrap text-sm">
                {note}
              </div>
            </div>
          )}

          {/* User Notes sesuai permission */}
          {hasUserNotes && (
            <div>
              <h3 className="font-medium mb-2">
                User Notes
              </h3>

              <div className="space-y-3">
                {noteItems.map((item) => (
                  <div
                    key={item.key}
                    className="p-3 rounded-lg bg-[var(--color-page-bg)]"
                  >
                    <div className="font-semibold text-sm mb-1">
                      {item.label}
                    </div>

                    <div className="text-sm whitespace-pre-wrap">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasGeneralNote && !hasUserNotes && (
            <div className="text-center text-sm text-[var(--color-text-disabled)] py-8">
              No notes available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}