import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function ConversationSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-2.5 text-scalar-pewter" size={17} />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search" className="pl-9" aria-label="Search conversations" />
    </label>
  );
}
