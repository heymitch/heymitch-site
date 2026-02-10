export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-void via-surface to-void" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Coral glow — top left */}
      <div
        className="absolute -top-36 -left-12 w-[450px] h-[450px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(224,122,95,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Blue glow — bottom right */}
      <div
        className="absolute -bottom-36 -right-12 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(91,141,239,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Secondary blue glow */}
      <div
        className="absolute top-12 right-48 w-[300px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(91,141,239,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
