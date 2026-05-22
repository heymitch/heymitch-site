import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "The Cowork VM Environment — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — VM Environment",
  robots: { index: false, follow: false },
};

const content = `# The Cowork VM Environment

Cowork runs inside an isolated virtual machine. Understanding what this VM can and cannot do saves hours of debugging.

## What the VM Is

Cowork sessions execute in a lightweight Linux VM on your local machine. The VM is:

- **OS:** Linux aarch64 (Ubuntu 22.04)
- **Lifecycle:** Ephemeral per session, except for the mounted workspace
- **Isolation:** Cannot access your host filesystem outside the mounted folder
- **Runtime:** Node.js v22, gcc, bash scripts available
- **Network:** Restricted (see below)

## What Persists (and What Doesn't)

| Persists across sessions | Does NOT persist |
|--------------------------|------------------|
| Files in your mounted workspace folder | Anything written outside the workspace |
| \`.coworker/\` config inside workspace | Installed npm packages |
| Skills loaded from plugins | Temporary files in \`/tmp\` |
| CLAUDE.md (read fresh each session) | Environment variables set in session |

**The mounted folder is the only durable storage.** If a skill writes output to \`/tmp\` or anywhere outside your workspace, it's gone when the session ends.

### Workspace Path

On your Mac, your workspace might be at:
\`\`\`
/Users/you/Desktop/coworker/
\`\`\`

Inside the Cowork VM, it's mounted at:
\`\`\`
/sessions/<session-id>/mnt/
\`\`\`

Skills and plugins should use relative paths or let Claude resolve the workspace root, not hardcode paths.

## Network Access

The VM has a strict network allowlist. Only these domains are accessible:

- \`api.anthropic.com\` -- Claude API calls
- \`pypi.org\` -- Python package installs
- \`registry.npmjs.org\` -- npm package installs

**Everything else is blocked.** No arbitrary HTTP requests. No web scraping. No API calls to third-party services from inside the VM.

### How Connectors Work Around This

Cowork connectors (Gmail, Notion, Slack, etc.) don't make API calls from inside the VM. They route through Anthropic's edge infrastructure. That's why connectors work but raw \`curl\` to external APIs doesn't.

If your skill needs external API access, you need a connector or an edge function, not a direct HTTP call.

## Dotfiles and Visibility

Files and folders starting with \`.\` (like \`.coworker/\`) are:

- **Visible** in VS Code and Finder (Cmd+Shift+.)
- **Not visible** in Finder by default
- **Fully readable/writable** by Cowork
- **Persistent** (they're in the mounted workspace)

This is important for the setup command pattern: your plugin creates \`.coworker/\` or \`.overclock/\` to store config, and it survives across sessions.

## Plugin Directory is Read-Only

Installed plugins live in a read-only location inside the VM. You cannot write to the plugin directory. Skills can read their own files (references, templates) but cannot modify them.

All writable output goes to the mounted workspace.

## What's Dead in the VM

These Claude Code features do not work in Cowork:

| Feature | Status in Cowork |
|---------|-----------------|
| \`settings.json\` agent activation | Dead |
| \`agents/\` directory | Dead |
| \`.mcp.json\` local STDIO MCP | Dead |
| Local MCP servers from plugins | Dead |
| Direct filesystem access outside workspace | Dead |
| Arbitrary network requests | Dead |

Don't waste time trying to make these work. They're Claude Code features that don't carry over.

## What Works

| Feature | Status |
|---------|--------|
| Skills auto-discovery from plugins | Works |
| CLAUDE.md routing and persona | Works |
| Workspace file read/write/create | Works |
| Node.js v22 scripts | Works |
| Bash scripts | Works |
| gcc compilation | Works |
| npm/pip installs (within session) | Works |
| Connectors (Gmail, Notion, Slack, etc.) | Works (via edge) |

## Debugging Tips

**"My skill can't find a file"**
Check if the file is inside the mounted workspace. Paths outside the workspace don't exist in the VM.

**"My API call times out"**
The domain is probably not on the allowlist. Use a connector instead of direct HTTP.

**"My config disappeared"**
Did you write it inside the workspace (\`.coworker/config.json\`)? Or to a temp location that got wiped?

**"My npm package isn't available next session"**
Packages installed via \`npm install\` in a session are ephemeral. If your skill needs packages, include them in the plugin or use built-in Node.js APIs.`;

export default function Page() {
  return <DocPage breadcrumb="VM Environment" content={content} lastVerified="March 31, 2026" />;
}
