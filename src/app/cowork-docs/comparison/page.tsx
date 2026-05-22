import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Cowork vs. Claude Code vs. Chat — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Cowork vs Code vs Chat",
  robots: { index: false, follow: false },
};

const content = `# Cowork vs. Claude Code vs. Chat

Three surfaces, three different sets of capabilities. Knowing which features live where saves hours of debugging things that were never going to work.

## Feature Comparison Matrix

| Feature | Chat | Cowork | Claude Code |
|---------|:----:|:------:|:-----------:|
| **File System** | | | |
| Read local files | No | Mounted folder only | Full system |
| Write/create files | No | Mounted folder only | Full system |
| File uploads (drag & drop) | Yes (temporary) | Yes (to workspace) | Yes |
| **Skills & Plugins** | | | |
| Skills auto-discovery | No | Yes | Yes |
| Plugin install (marketplace) | No | Yes | Yes |
| Plugin install (ZIP upload) | No | Yes | Yes |
| Slash commands | No | Yes | Yes |
| Custom CLAUDE.md | No | Yes | Yes |
| **MCP & Integrations** | | | |
| Cloud connectors (Gmail, Notion, Slack) | No | Yes | Yes (plugins) |
| Local STDIO MCP servers (.mcp.json) | No | **No** | Yes |
| Local MCP from plugins | No | **No** | Yes |
| settings.json agent activation | No | **No** | Yes |
| agents/ directory | No | **No** | Yes |
| **Memory & Context** | | | |
| Auto-synthesized memory | Yes | **No** | Project memory |
| CLAUDE.md as persistent context | N/A | Yes (read at session start) | Yes |
| Conversation history | Full session | Per task | Per session |
| **Execution** | | | |
| Bash/shell commands | No | Yes (in VM) | Yes (native) |
| Node.js scripts | No | Yes (v22 in VM) | Yes (native) |
| Python scripts | No | Yes (in VM) | Yes (native) |
| gcc compilation | No | Yes (in VM) | Yes (native) |
| Background/async tasks | No | Yes | Yes (subagents) |
| Git operations | No | No | Yes |
| **Network** | | | |
| Web search | Yes (best) | Limited | Yes (tools) |
| Arbitrary HTTP requests | No | **No** (allowlist only) | Yes |
| API calls to external services | No | Via connectors only | Yes (native) |
| **Environment** | | | |
| Runs on | Anthropic cloud | Local VM (ephemeral) | Your terminal |
| OS | N/A | Linux aarch64 | Your OS |
| Persistence | Chat history | Mounted folder | Full filesystem |
| Multi-session state | Memory feature | CLAUDE.md + workspace files | Project memory + files |

## The Three Surfaces Explained

### Chat (claude.ai)

The conversation interface. Best for:
- One-off questions
- Web search (Chat's search is actually better than Cowork's)
- Brainstorming where you don't need file output
- Quick tasks that don't need to be repeated

Chat has auto-synthesized memory that remembers preferences across conversations. Cowork doesn't have this yet. Chat also can't touch your filesystem at all.

### Cowork (Claude Desktop > Cowork tab)

The knowledge work surface. Best for:
- Repeatable workflows packaged as skills
- Tasks that produce file outputs (reports, docs, organized folders)
- Background work that runs while you do something else
- Any task you'll do more than 3 times

Cowork runs in an isolated VM. It can only access files in your mounted folder. It cannot make arbitrary network requests. It cannot run local MCP servers. But it can install plugins with skills that fire automatically based on what you ask.

The key insight: **Cowork wins when the output is a file and the task is repeatable.**

### Claude Code (Terminal)

The engineering surface. Best for:
- Software development
- Full system access (filesystem, git, network, shell)
- Complex multi-step automation
- Orchestrating other tools via MCP
- Tasks that need arbitrary API access

Claude Code has no VM isolation. It runs directly on your machine with whatever permissions you grant. It can read any file, make any API call, run any command. Maximum power, maximum responsibility.

## Common Confusion Points

### "My MCP server doesn't work in Cowork"

Correct. Local STDIO MCP servers (configured in \`.mcp.json\`) only work in Claude Code. Cowork uses cloud connectors (Gmail, Notion, Slack, etc.) that route through Anthropic's infrastructure. If your skill needs external API access in Cowork, use a connector or an edge function.

### "My settings.json agents don't activate in Cowork"

Correct. \`settings.json\` agent activation is Claude Code only. In Cowork, use CLAUDE.md for persona and routing. Skills in plugins auto-discover based on their description.

### "Chat has better memory than Cowork"

Yes, currently. Chat auto-synthesizes memory across conversations. Cowork has no equivalent. The workaround in Cowork is explicit: write preferences and context to CLAUDE.md or \`.coworker/config.json\` so they load every session.

### "I can do everything in Claude Code, why use Cowork?"

Distribution. You can't give a client or student a Claude Code setup. You CAN give them a Cowork plugin (ZIP or marketplace). Cowork is the productized surface. Claude Code is the workshop where you build the products.

### "When should I use Chat vs. Cowork for content?"

If you're writing one post and want to brainstorm: Chat. If you have a voice profile, hook library, and quality pipeline that produces content consistently: Cowork with skills. Chat is better for exploration. Cowork is better for production.

## The Decision Flowchart

\`\`\`
Is the output a file?
├─ No → Chat
└─ Yes
   ├─ Will you do this task more than 3 times?
   │  ├─ No → Chat or Cowork (either works)
   │  └─ Yes → Cowork (build a skill)
   └─ Does it need full system access?
      ├─ No → Cowork
      └─ Yes
         ├─ Git, arbitrary APIs, local MCP?
         │  └─ Claude Code
         └─ Just files + connectors?
            └─ Cowork
\`\`\`

## Quick Reference: What's Where

| I want to... | Use |
|---|---|
| Ask a quick question | Chat |
| Research a topic with web search | Chat |
| Organize my files | Cowork |
| Write a newsletter with my voice | Cowork (with voice skill) |
| Build a plugin | Claude Code (then install in Cowork) |
| Run a shell script | Claude Code (or Cowork if simple) |
| Connect to Gmail/Notion/Slack | Cowork (connectors) |
| Make API calls to any endpoint | Claude Code |
| Ship a product to customers | Build in Claude Code, deliver via Cowork |
| Automate a repeatable workflow | Cowork (skill) |
| Debug code | Claude Code |
| Get meeting prep from calendar + email | Cowork (with connectors) |`;

export default function Page() {
  return <DocPage breadcrumb="Cowork vs Code vs Chat" content={content} lastVerified="March 31, 2026" />;
}
