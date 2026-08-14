export function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="relative">
      <summary className="focus-ring cursor-pointer list-none rounded-full px-3 py-2 text-sm font-medium text-scalar-ink hover:bg-scalar-wash">{label}</summary>
      <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-scalar-line bg-white p-2 shadow-lg">{children}</div>
    </details>
  );
}
