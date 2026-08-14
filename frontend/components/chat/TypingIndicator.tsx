export function TypingIndicator({ names }: { names: string[] }) {
  if (!names.length) return <div className="h-5" />;
  return <div className="h-5 px-3 text-xs text-scalar-slate">{names.join(", ")} {names.length === 1 ? "is" : "are"} typing...</div>;
}
