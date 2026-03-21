import type { Metadata } from "next";
import ResourceCard from "@/components/ResourceCard";
import SectionHeader from "@/components/SectionHeader";
import RetroStripes from "@/components/RetroStripes";
import resources from "@/data/resources.json";

export const metadata: Metadata = {
  title: "Free Resources — heymitch",
  description:
    "Free AI skills and tools for Claude Cowork. Download plugins, templates, and agent workflows.",
};

export default function ResourcesPage() {
  const published = resources.filter((r) => r.published);

  return (
    <main className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-[960px] mx-auto px-6 pt-6 pb-4">
        <div className="max-w-[240px] mb-4">
          <RetroStripes />
        </div>
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="font-sans text-3xl sm:text-4xl font-bold text-brown hover:text-brown/70 transition-colors"
          >
            hey<span className="text-orange">mitch</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-2 text-brown/50 hover:text-brown text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </a>
        </div>
      </nav>

      {/* Content */}
      <section className="max-w-[960px] mx-auto px-6 pb-12">
        <SectionHeader label="Resources" />

        <div className="mb-10">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-brown mb-2">
            Free Resources
          </h1>
          <p className="font-mono text-brown/50 text-sm">
            Skills and tools for your AI agent. Each one installs in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {published.map((resource) => (
            <ResourceCard key={resource.url} {...resource} />
          ))}
        </div>

        {published.length === 0 && (
          <div className="rounded-xl border border-brown/10 bg-cream-dark/30 px-6 py-12 text-center">
            <p className="font-mono text-brown/40 text-lg tracking-wider">
              Resources coming soon.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-brown px-6 py-6 text-center">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-cream/40">
          By Mitch Harris
        </p>
      </footer>
    </main>
  );
}
