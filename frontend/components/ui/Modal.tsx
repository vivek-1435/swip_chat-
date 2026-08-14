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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-scalar-ink/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[88vh] overflow-auto rounded-t-2xl sm:rounded-lg border border-scalar-line bg-white shadow-[var(--surface-raised)] animate-[slideUp_0.22s_ease-out] sm:animate-none">
        <div className="flex items-center justify-between border-b border-scalar-line px-5 py-4">
          <h2 className="text-base font-semibold text-scalar-ink">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="topbar-icon-button h-10 w-10 p-0 text-scalar-ink"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>
        <div className="p-5 pb-safe">{children}</div>
      </div>
    </div>
  );
}
