import type { Metadata } from "next";
import Background from "@/components/Background";
import ResourceCard from "@/components/ResourceCard";
import Footer from "@/components/Footer";
import resources from "@/data/resources.json";

export const metadata: Metadata = {
  title: "Free Resources — heymitch",
  description:
    "Free AI skills and tools for Claude Cowork. Download plugins, templates, and agent workflows.",
  openGraph: {
    title: "Free Resources — heymitch",
    description:
      "Free AI skills and tools for Claude Cowork. Download plugins, templates, and agent workflows.",
  },
};

export default function ResourcesPage() {
  const published = resources.filter((r) => r.published);

  return (
    <main className="relative">
      <Background />

      <section className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-12 transition-colors duration-200"
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
            heymitch
          </a>

          {/* Header */}
          <div className="mb-14">
            <h1 className="font-garamond text-5xl sm:text-6xl font-normal mb-4">
              Free Resources
            </h1>
            <p className="text-white/50 text-lg max-w-lg">
              Skills and tools for your AI agent. Each one installs in minutes.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((resource) => (
              <ResourceCard key={resource.url} {...resource} />
            ))}
          </div>

          {/* Empty state */}
          {published.length === 0 && (
            <p className="text-white/30 text-center py-20">
              Resources coming soon.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
