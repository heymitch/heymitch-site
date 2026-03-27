import PhysicalButton from "@/components/PhysicalButton";
import CountdownCRT from "@/components/CountdownCRT";
import RetroStripes from "@/components/RetroStripes";
import SectionHeader from "@/components/SectionHeader";
import dynamic from "next/dynamic";

const AsciiPortrait = dynamic(() => import("@/components/AsciiPortrait"), {
  ssr: false,
});

const socials = [
  {
    label: "YouTube",
    href: "https://youtube.com/@heymitchh",
    d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/heymitchh",
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "GitHub",
    href: "https://github.com/heymitch",
    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    label: "X",
    href: "https://x.com/heymitchh",
    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export default function Home() {
  return (
    <div className="bg-cream">
      {/* ASCII Portrait — fixed to viewport, right half, sits behind everything */}
      <div className="hidden lg:block fixed top-0 right-0 w-1/2 h-screen z-0">
        <AsciiPortrait />
      </div>

      {/* ═══ HERO ═══ */}
      <main className="relative min-h-screen bg-cream lg:bg-transparent">

        {/* LEFT: Content */}
        <div className="relative z-10 lg:w-1/2 flex flex-col items-center lg:items-start justify-center min-h-screen px-6 lg:px-16 xl:px-24 py-16">
          <div className="w-full max-w-[540px] text-center lg:text-left">
            <div className="max-w-[280px] mx-auto lg:mx-0 mb-10">
              <RetroStripes />
            </div>

            <h1 className="font-sans text-6xl sm:text-8xl font-bold tracking-tight text-brown mb-3">
              hey<span className="text-orange">mitch</span>
            </h1>

            <p className="font-mono text-sm sm:text-base text-brown/60 tracking-wide mb-10">
              AI skills you can actually use. Newsletters, bootcamps, free tools.
            </p>

            {/* Desktop: horizontal row */}
            <div className="metal-housing hidden sm:inline-flex items-center gap-4 px-5 py-4 mb-6">
              <div className="metal-well p-2.5 relative z-10">
                <PhysicalButton
                  href="https://ccb-waitlist.vercel.app/"
                  variant="red"
                >
                  <span className="sr-only">Join the next bootcamp</span>
                </PhysicalButton>
              </div>

              <div className="metal-well p-1.5 relative z-10">
                <div className="mini-crt px-6 py-3.5">
                  <span className="mini-crt-text font-mono text-sm tracking-[0.2em] uppercase whitespace-nowrap">
                    CHECK OUT THE NEXT BOOTCAMP
                  </span>
                </div>
              </div>

              <div className="metal-well p-1.5 relative z-10">
                <CountdownCRT />
              </div>
            </div>

            {/* Mobile: vertical stack — CRT text top, button + countdown bottom */}
            <div className="metal-housing sm:hidden inline-flex flex-col gap-3 px-4 py-3 mb-6">
              <div className="metal-well p-1 relative z-10">
                <div className="mini-crt px-4 py-2.5">
                  <span className="mini-crt-text font-mono text-xs tracking-[0.15em] uppercase text-center block leading-relaxed">
                    CHECK OUT<br />THE NEXT<br />BOOTCAMP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="metal-well p-2 relative z-10">
                  <PhysicalButton
                    href="https://ccb-waitlist.vercel.app/"
                    variant="red"
                  >
                    <span className="sr-only">Join the next bootcamp</span>
                  </PhysicalButton>
                </div>

                <div className="metal-well p-1 relative z-10 flex-1">
                  <CountdownCRT />
                </div>
              </div>
            </div>

            <SectionHeader />

            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 secondary-btn-row">
              <div className="flex-1">
                <PhysicalButton
                  href="https://heymitch.substack.com/"
                  variant="secondary"
                  className="w-full"
                >
                  <span className="font-mono text-sm tracking-wide block text-center">
                    AI Dispatch
                  </span>
                </PhysicalButton>
              </div>

              <div className="flex-1">
                <PhysicalButton
                  href="https://discipleai.substack.com/"
                  variant="secondary"
                  className="w-full"
                >
                  <span className="font-mono text-sm tracking-wide block text-center">
                    Disciple AI Substack
                  </span>
                </PhysicalButton>
              </div>

              <div className="flex-1">
                <PhysicalButton
                  href="/resources"
                  variant="secondary"
                  className="w-full"
                >
                  <span className="font-mono text-sm tracking-wide block text-center">
                    Free Resources
                  </span>
                </PhysicalButton>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-5 mt-10">
              {socials.map(({ label, href, d }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-brown/25 hover:text-orange transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>

            <div className="max-w-[280px] mx-auto lg:mx-0 mt-10">
              <RetroStripes />
            </div>
          </div>
        </div>
      </main>

      {/* ═══ DARK FOOTER BAND — full width, transparent right half on desktop ═══ */}
      <footer className="relative z-10 bg-brown px-6 py-8 text-center lg:bg-gradient-to-r lg:from-brown lg:from-50% lg:to-transparent lg:to-50%">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-cream/40 lg:w-1/2 lg:text-left lg:pl-10 xl:pl-18">
          By Mitch Harris
        </p>
        <p className="font-mono text-xs text-cream/25 mt-1 lg:w-1/2 lg:text-left lg:pl-10 xl:pl-18">
          AI coach, builder, writer
        </p>
      </footer>
    </div>
  );
}
