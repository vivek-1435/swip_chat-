import { UserRound } from "lucide-react";
import { classNames } from "@/lib/utils";

export function Avatar({ src, name, online, className }: { src?: string | null; name: string; online?: boolean; className?: string }) {
  return (
    <span className={classNames("relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-[linear-gradient(135deg,#ffffff,#ecece8)] text-sm font-bold text-scalar-ink shadow-[0_8px_18px_rgba(27,27,27,0.10)] ring-1 ring-scalar-line", className)}>
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : name ? (
        name.slice(0, 1).toUpperCase()
      ) : (
        <UserRound size={18} />
      )}
      {online !== undefined && <span className={classNames("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white", online ? "bg-scalar-green" : "bg-scalar-pewter")} />}
    </span>
  );
}
