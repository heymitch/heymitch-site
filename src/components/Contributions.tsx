export default function Contributions() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-white/40 text-sm font-medium tracking-widest uppercase text-center mb-6">
          Building in public
        </p>
        <a
          href="https://github.com/heymitch"
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-x-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ghchart.rshah.org/F4722B/heymitch"
            alt="heymitch's GitHub contribution chart"
            className="w-full min-w-[640px] opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        </a>
      </div>
    </section>
  );
}
