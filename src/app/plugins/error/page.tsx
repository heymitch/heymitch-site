import RetroStripes from "@/components/RetroStripes";
import PhysicalButton from "@/components/PhysicalButton";

export default function PluginError({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const message =
    searchParams.message ||
    "Something went wrong with your install link.";

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
                INSTALL FAILED
              </p>
            </div>
          </div>
        </div>

        <p className="font-mono text-sm text-brown/70 leading-relaxed mb-8 max-w-[400px] mx-auto">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 justify-center">
          <PhysicalButton href="mailto:support@heymitch.ai" variant="primary">
            <span className="font-mono text-sm tracking-wide">
              Contact Support
            </span>
          </PhysicalButton>

          <PhysicalButton href="/" variant="secondary">
            <span className="font-mono text-sm tracking-wide">
              Back to heymitch.ai
            </span>
          </PhysicalButton>
        </div>

        <div className="max-w-[280px] mx-auto mt-10">
          <RetroStripes />
        </div>
      </div>
    </main>
  );
}
