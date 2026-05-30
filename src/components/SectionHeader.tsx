export default function SectionHeader({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-ink/15" />
      {label && (
        <span className="font-mono text-xs tracking-[0.25em] uppercase text-ink/40">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-ink/15" />
    </div>
  );
}
