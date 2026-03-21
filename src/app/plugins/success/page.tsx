import RetroStripes from "@/components/RetroStripes";
import PhysicalButton from "@/components/PhysicalButton";

export default function PluginSuccess({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const product = searchParams.product || "your plugin";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-cream">
      <div className="w-full max-w-[520px] text-center">
        <div className="max-w-[280px] mx-auto mb-10">
          <RetroStripes />
        </div>

        <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight text-brown mb-3">
          hey<span className="text-orange">mitch</span>
        </h1>

        <div className="metal-housing inline-block px-6 py-5 sm:px-8 sm:py-6 mt-8 mb-8 w-full">
          <div className="metal-well p-4 sm:p-5">
            <div className="mini-crt px-5 py-4 sm:px-6 sm:py-5">
              <p className="mini-crt-text font-mono text-xs sm:text-sm tracking-wider uppercase leading-relaxed">
                {product}
              </p>
              <p className="mini-crt-text font-mono text-[10px] sm:text-xs tracking-wider uppercase mt-2 opacity-60">
                READY TO INSTALL
              </p>
            </div>
          </div>
        </div>

        <p className="font-mono text-sm text-brown/70 leading-relaxed mb-3">
          Your access link is valid. To install:
        </p>

        <ol className="font-mono text-sm text-brown/60 leading-loose text-left max-w-[360px] mx-auto mb-8 list-decimal list-inside">
          <li>Open <span className="text-brown font-semibold">Cowork</span></li>
          <li>Go to <span className="text-brown font-semibold">Settings &rarr; Plugins</span></li>
          <li>Click <span className="text-brown font-semibold">Add from URL</span></li>
          <li>Paste the link from your welcome email</li>
        </ol>

        <p className="font-mono text-xs text-brown/40 mb-8">
          Don&apos;t have Cowork yet?{" "}
          <a href="https://cowork.ai" className="text-teal hover:text-orange underline">
            Get started here
          </a>
        </p>

        <PhysicalButton href="/" variant="secondary">
          <span className="font-mono text-sm tracking-wide">
            Back to heymitch.ai
          </span>
        </PhysicalButton>

        <div className="max-w-[280px] mx-auto mt-10">
          <RetroStripes />
        </div>
      </div>
    </main>
  );
}
