import type { Toast } from "@/hooks/useNotifications";
import { classNames } from "@/lib/utils";

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={classNames(
            "rounded-md px-4 py-3 text-sm font-medium shadow-lg",
            toast.tone === "error" ? "bg-scalar-orange text-white" : toast.tone === "success" ? "bg-scalar-green text-white" : "bg-scalar-ink text-white"
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
