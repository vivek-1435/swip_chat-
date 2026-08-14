import { InputHTMLAttributes } from "react";
import { classNames } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={classNames("focus-ring h-10 w-full rounded-full border border-scalar-line bg-white px-4 text-sm text-scalar-ink shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] transition placeholder:text-scalar-pewter hover:border-scalar-pewter/60", className)} {...props} />;
}
