export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Headshot */}
      <img
        src="/headshot.png"
        alt="Mitch"
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-white/10 mb-8"
      />

      {/* Brand name */}
      <h1 className="font-garamond text-7xl sm:text-8xl md:text-9xl font-normal leading-none mb-3">
        hey<span className="text-coral italic">mitch</span>
      </h1>

      {/* Tagline */}
      <p className="text-2xl sm:text-3xl text-white/90 font-medium tracking-wide mb-10">
        Build .skills
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <a
          href="https://claudecoworkbootcamp.com"
          className="inline-flex items-center gap-2 px-8 py-4 bg-coral hover:bg-coral/90 text-white text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
        >
          Start Building
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <a
          href="https://heymitch.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
        >
          heymitch newsletter
        </a>
        <a
          href="https://discipleai.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
        >
          disciple.ai newsletter
        </a>
      </div>

      {/* Value props */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
        {["Beginner friendly", "Claude Cowork", "Agent workflows"].map(
          (prop) => (
            <div
              key={prop}
              className="flex items-center gap-2.5 text-white/80 text-base font-medium"
            >
              <span className="w-2.5 h-2.5 bg-blue rounded-full" />
              {prop}
            </div>
          )
        )}
      </div>
    </section>
  );
}
