"use client";

import { X } from "lucide-react";

export function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scalar-ink/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[88vh] w-full max-w-lg overflow-auto rounded-lg border border-scalar-line bg-white shadow-[var(--surface-raised)]">
        <div className="flex items-center justify-between border-b border-scalar-line px-5 py-4">
          <h2 className="text-base font-semibold text-scalar-ink">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="topbar-icon-button h-9 w-9 p-0 text-scalar-ink"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
