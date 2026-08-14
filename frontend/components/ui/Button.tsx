import { ButtonHTMLAttributes } from "react";
import { classNames } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-scalar-green px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(6,144,97,0.18)] transition hover:-translate-y-0.5 hover:bg-[#057a52] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}
