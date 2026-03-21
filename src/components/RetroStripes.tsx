export default function RetroStripes() {
  return (
    <div className="flex gap-1 h-1.5">
      <div className="flex-[8] bg-green rounded-sm" />
      <div className="flex-[12] bg-teal rounded-sm" />
      <div className="flex-[35] bg-orange rounded-sm" />
      <div className="flex-[25] bg-brown rounded-sm" />
      <div className="flex-[20] bg-brown-muted rounded-sm" />
    </div>
  );
}
