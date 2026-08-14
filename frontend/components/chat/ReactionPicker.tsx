export function ReactionPicker({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <div className="flex gap-1 rounded-full border border-scalar-line bg-white p-1 shadow">
      {["❤️", "😂", "👍", "🎉"].map((emoji) => (
        <button key={emoji} onClick={() => onPick(emoji)} className="focus-ring rounded-full px-2 py-1 text-sm hover:bg-scalar-wash" aria-label={`React ${emoji}`}>
          {emoji}
        </button>
      ))}
    </div>
  );
}
