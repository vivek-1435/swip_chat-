export function Loading({ label = "Loading..." }: { label?: string }) {
  return <div className="p-4 text-sm text-scalar-slate">{label}</div>;
}
