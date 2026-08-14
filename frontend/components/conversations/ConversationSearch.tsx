import { Search } from "lucide-react";

export function ConversationSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="relative flex w-full items-center">
      <Search className="pointer-events-none absolute left-3 text-scalar-pewter" size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search or start a new chat"
        aria-label="Search conversations"
        className="w-full rounded-full bg-white py-2 pl-9 pr-4 text-[14px] text-scalar-ink placeholder:text-scalar-pewter focus:outline-none"
      />
    </label>
  );
}
