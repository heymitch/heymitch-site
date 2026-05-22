import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Cowork Field Docs — heymitch",
  description:
    "Battle-tested documentation for Claude Cowork. The harness, plugins, skills, and VM behavior that official docs don't cover.",
  robots: { index: false, follow: false },
};

const tocItems = [
  { label: "Why this exists", id: "why" },
  { label: "Cowork vs. Code vs. Chat", id: "comparison" },
  { label: "The Harness", id: "harness" },
  { label: "Connectors", id: "connectors" },
  { label: "Plugins", id: "plugins" },
  { label: "Skills", id: "skills" },
  { label: "Tutorials", id: "tutorials" },
  { label: "Marketplace Plugin", id: "marketplace" },
];

const sections = [
  {
    id: "comparison",
    title: "Cowork vs. Claude Code vs. Chat",
    description: "What works where, so you stop debugging the wrong surface",
    docs: [
      {
        title: "Feature Comparison Matrix",
        href: "/cowork-docs/comparison",
        summary:
          "Side-by-side: what's available in Cowork, Claude Code, and Chat. Skills, MCP, file access, memory, web search, connectors.",
        live: true,
      },
    ],
  },
  {
    id: "harness",
    title: "The Harness",
    description: "How CLAUDE.md, workspaces, and the VM actually work",
    docs: [
      {
        title: "How CLAUDE.md Works in Cowork",
        href: "/cowork-docs/claude-md",
        summary:
          "Persona, routing, token budget, the setup command pattern, and why settings.json is dead.",
        live: true,
      },
      {
        title: "The Cowork VM Environment",
        href: "/cowork-docs/vm",
        summary:
          "Linux aarch64, ephemeral except mounted folder, network allowlist, what's dead.",
        live: true,
      },
      {
        title: "Workspace Persistence",
        href: "/cowork-docs/persistence",
        summary:
          "What survives across sessions, what vanishes. Mounted folder is the only durable storage. Packages, env vars, /tmp files all ephemeral.",
        live: true,
      },
      {
        title: "Memory and Context",
        href: "/cowork-docs/memory",
        summary:
          "Cowork has no Chat-style auto-memory. CLAUDE.md is the mechanism. How skill descriptions, CLAUDE.md, and conversation history compete for context.",
        live: true,
      },
      {
        title: "Global Instructions vs. CLAUDE.md",
        href: "/cowork-docs/global-vs-claudemd",
        summary:
          "Two instruction systems with different jobs. Global = who you are. CLAUDE.md = what this project does. When they conflict and how to fix it.",
        live: true,
      },
      {
        title: "Dispatch and Scheduled Tasks",
        href: "/cowork-docs/dispatch",
        summary:
          "Dispatch and Scheduled do NOT mount a folder. Skills that need workspace files will fail. What works without a mount and what breaks.",
        live: true,
      },
      {
        title: "Local Data Safety",
        href: "/cowork-docs/data-safety",
        summary:
          "Never delete ~/Library/Application Support/Claude/. Where session history lives, what's safe to clear, and how we learned this the hard way.",
        live: true,
      },
    ],
  },
  {
    id: "connectors",
    title: "Connectors",
    description: "How external services work through Anthropic's edge, not the VM",
    docs: [
      {
        title: "How Connectors Work",
        href: "/cowork-docs/connectors",
        summary:
          "The VM blocks all HTTP except 3 domains. Connectors route through Anthropic's edge infrastructure. Why raw API calls fail and .mcp.json is dead.",
        live: true,
      },
    ],
  },
  {
    id: "plugins",
    title: "Plugins",
    description: "Building, packaging, and troubleshooting plugins",
    docs: [
      {
        title: "Packaging Rules",
        href: "/cowork-docs/plugin-packaging",
        summary:
          "Lowercase hyphens only. plugin.json is required. Skills register from description, not name. Upload Plugin not Upload Skill. New Task after install.",
        live: true,
      },
      {
        title: "Plugin Doctor",
        summary:
          "Diagnose why your plugin isn't working. Common failures and specific fixes.",
      },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    description: "Writing skills that actually trigger",
    docs: [
      {
        title: "Trigger Behavior",
        href: "/cowork-docs/skill-triggers",
        summary:
          "Description is the sole trigger. ~100 words, always in context. Slash command slug comes from folder name, not the name field. Debugging checklist.",
        live: true,
      },
      {
        title: "Skill Doctor",
        summary:
          "Diagnose why your skill isn't triggering. Frontmatter checks, description audit.",
      },
    ],
  },
  {
    id: "tutorials",
    title: "Tutorials",
    description: "Step-by-step with annotated screenshots",
    docs: [
      {
        title: "Install Your First Plugin",
        summary:
          "Customize > Personal Plugins > Upload. Every step screenshotted and annotated.",
      },
      {
        title: "Build Your First Skill",
        summary:
          "SKILL.md frontmatter, description writing, testing, packaging into a plugin.",
      },
    ],
  },
];

export default function CoworkDocsPage() {
  return (
    <div className="flex justify-center">
      {/* Center content */}
      <div className="flex-1 min-w-0 max-w-2xl px-8 lg:px-12 py-10">
        {/* Breadcrumb */}
        <div className="font-mono text-sm text-brown/60 mb-8 flex items-center gap-1.5">
          <a href="/" className="hover:text-brown transition-colors">heymitch.ai</a>
          <span className="text-brown/30">/</span>
          <span className="text-brown/80">cowork-docs</span>
        </div>

        {/* Title */}
        <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight text-brown mb-4">
          Claude Cowork Field Docs
        </h1>
        <p className="font-sans text-brown/80 text-lg leading-relaxed mb-4">
          Battle-tested documentation for Claude Cowork.
        </p>
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs text-brown/50 border border-brown/15 rounded px-2.5 py-1">
            Last updated: March 2026
          </span>
          <span className="font-mono text-xs text-brown/50 border border-brown/15 rounded px-2.5 py-1">
            Verified by agents
          </span>
        </div>

        {/* Why */}
        <div id="why" className="rounded-xl border border-brown/12 bg-cream-dark/40 px-6 py-5 mb-14">
          <p className="font-sans font-bold text-brown text-base mb-2">
            Why this exists
          </p>
          <p className="font-sans text-brown/75 text-sm leading-relaxed">
            Anthropic&apos;s docs tell you what Cowork is. This guide tells you how it actually works:
            how the harness differs from Claude Code, what&apos;s dead in the VM, plugin packaging
            gotchas that cost hours, and skill trigger behavior that isn&apos;t documented anywhere.
            Built from 6 bootcamp cohorts and 24+ shipped plugins.{" "}
            <a
              href="https://github.com/heymitch/cowork-field-guide"
              className="text-orange font-medium hover:text-orange/80 transition-colors"
            >
              Open source on GitHub.
            </a>
          </p>
        </div>

        {/* Doc sections */}
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="mb-12">
            <h2 className="font-sans text-2xl font-bold text-brown mb-1">
              {section.title}
            </h2>
            <p className="font-sans text-brown/60 text-sm mb-5">
              {section.description}
            </p>
            <div className="space-y-3">
              {section.docs.map((doc) => {
                const isLive = "live" in doc && doc.live;
                const Tag = isLive && "href" in doc ? "a" : "div";
                return (
                  <Tag
                    key={doc.title}
                    {...(isLive && "href" in doc ? { href: doc.href } : {})}
                    className={`block rounded-xl border px-6 py-5 transition-all ${
                      isLive
                        ? "border-brown/10 bg-cream-dark/25 hover:border-orange/25 hover:bg-cream-dark/50 cursor-pointer"
                        : "border-brown/6 bg-cream-dark/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-sans font-semibold text-base ${isLive ? "text-brown" : "text-brown/40"}`}>
                          {doc.title}
                          {isLive && (
                            <span className="ml-2 text-orange">→</span>
                          )}
                        </h3>
                        <p className={`font-sans text-sm mt-1.5 leading-relaxed ${isLive ? "text-brown/70" : "text-brown/35"}`}>
                          {doc.summary}
                        </p>
                      </div>
                      {isLive ? (
                        <span className="shrink-0 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-green/30 bg-green/10 text-green font-medium">
                          Live
                        </span>
                      ) : (
                        <span className="shrink-0 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-brown/12 bg-brown/5 text-brown/40 font-medium">
                          Soon
                        </span>
                      )}
                    </div>
                  </Tag>
                );
              })}
            </div>
          </div>
        ))}

        {/* Marketplace callout */}
        <div id="marketplace" className="rounded-xl border border-orange/25 bg-orange/5 px-6 py-5 mt-14 mb-16">
          <p className="font-sans font-bold text-orange text-base mb-2">
            Coming to the Cowork Marketplace
          </p>
          <p className="font-sans text-brown/75 text-sm leading-relaxed">
            This field guide is being packaged as a Cowork plugin. Install it,
            and your agent can query the docs mid-task. Includes a plugin
            doctor and skill doctor for instant diagnostics.
          </p>
        </div>
      </div>

      {/* Right sidebar — Table of Contents */}
      <aside className="hidden xl:block w-56 shrink-0 sticky top-[53px] h-[calc(100vh-53px)] overflow-y-auto">
        <div className="py-10 pr-6">
          <p className="font-mono text-[11px] text-brown/50 uppercase tracking-[0.15em] font-medium mb-3">
            On this page
          </p>
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block font-sans text-sm text-brown/60 hover:text-orange transition-colors py-0.5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-brown/10">
            <p className="font-mono text-[11px] text-brown/50 uppercase tracking-[0.15em] font-medium mb-3">
              Resources
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/heymitch/cowork-field-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-sans text-sm text-brown/60 hover:text-orange transition-colors py-0.5"
                >
                  GitHub Repo
                </a>
              </li>
              <li>
                <a
                  href="https://support.claude.com/en/articles/13345190-get-started-with-cowork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-sans text-sm text-brown/60 hover:text-orange transition-colors py-0.5"
                >
                  Official Cowork Docs
                </a>
              </li>
              <li>
                <a
                  href="https://code.claude.com/docs/en/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-sans text-sm text-brown/60 hover:text-orange transition-colors py-0.5"
                >
                  Claude Code Docs
                </a>
              </li>
              <li>
                <a
                  href="https://claudecoworkbootcamp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-sans text-sm text-brown/60 hover:text-orange transition-colors py-0.5"
                >
                  Cowork Bootcamp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
