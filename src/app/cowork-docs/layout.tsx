import RetroStripes from "@/components/RetroStripes";

const navSections = [
  {
    label: "Getting Started",
    items: [
      { title: "Overview", href: "/cowork-docs", active: true },
      { title: "Cowork vs. Code vs. Chat", href: "/cowork-docs/comparison" },
    ],
  },
  {
    label: "The Harness",
    items: [
      { title: "CLAUDE.md in Cowork", href: "/cowork-docs/claude-md" },
      { title: "VM Environment", href: "/cowork-docs/vm" },
      { title: "Workspace Persistence", href: "/cowork-docs/persistence" },
      { title: "Memory and Context", href: "/cowork-docs/memory" },
      { title: "Dispatch and Scheduled", href: "/cowork-docs/dispatch" },
      { title: "Global vs. CLAUDE.md", href: "/cowork-docs/global-vs-claudemd" },
      { title: "Local Data Safety", href: "/cowork-docs/data-safety" },
    ],
  },
  {
    label: "Connectors",
    items: [
      { title: "How Connectors Work", href: "/cowork-docs/connectors" },
    ],
  },
  {
    label: "Plugins",
    items: [
      { title: "Packaging Rules", href: "/cowork-docs/plugin-packaging" },
      { title: "Plugin Doctor", href: "/cowork-docs/plugin-doctor", soon: true },
    ],
  },
  {
    label: "Skills",
    items: [
      { title: "Trigger Behavior", href: "/cowork-docs/skill-triggers" },
      { title: "Skill Doctor", href: "/cowork-docs/skill-doctor", soon: true },
    ],
  },
  {
    label: "Tutorials",
    items: [
      { title: "Install a Plugin", href: "/cowork-docs/tutorial-plugin", soon: true },
      { title: "Build a Skill", href: "/cowork-docs/tutorial-skill", soon: true },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-brown/8">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="font-sans text-xl font-bold text-brown hover:text-brown/70 transition-colors"
            >
              hey<span className="text-orange">mitch</span>
            </a>
            <span className="text-brown/15 font-mono text-xs">/</span>
            <span className="font-mono text-xs text-brown/40">
              field docs
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/heymitch/cowork-field-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-brown/50 hover:text-orange transition-colors"
            >
              GitHub
            </a>
            <a
              href="/"
              className="font-mono text-xs text-brown/50 hover:text-orange transition-colors"
            >
              heymitch.ai
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-brown/6 sticky top-[53px] h-[calc(100vh-53px)] overflow-y-auto">
          <nav className="px-4 py-6">
            <div className="max-w-[140px] mb-5">
              <RetroStripes />
            </div>
            {navSections.map((section) => (
              <div key={section.label} className="mb-5">
                <p className="font-mono text-[10px] text-brown/50 uppercase tracking-[0.15em] mb-2 px-2">
                  {section.label}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${
                          "active" in item && item.active
                            ? "bg-orange/10 text-orange font-medium"
                            : "soon" in item && item.soon
                              ? "text-brown/45 cursor-default"
                              : "text-brown/75 hover:text-brown hover:bg-brown/5"
                        }`}
                      >
                        <span className="font-sans">{item.title}</span>
                        {"soon" in item && item.soon && (
                          <span className="ml-2 font-mono text-[9px] text-brown/20 uppercase">
                            soon
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
