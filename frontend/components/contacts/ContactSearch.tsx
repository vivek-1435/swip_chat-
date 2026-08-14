import { Input } from "@/components/ui/Input";

export function ContactSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Input aria-label="Search users" placeholder="Search people by name, username, or phone" value={value} onChange={(e) => onChange(e.target.value)} />;
}
