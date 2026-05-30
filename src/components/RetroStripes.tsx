export default function RetroStripes() {
  return (
    <div className="flex gap-1 h-1.5">
      <div className="flex-[8] bg-green rounded-sm" />
      <div className="flex-[12] bg-teal rounded-sm" />
      <div className="flex-[35] bg-orange rounded-sm" />
      <div className="flex-[25] bg-ink rounded-sm" />
      <div className="flex-[20] bg-ink/70 rounded-sm" />
    </div>
  );
}
