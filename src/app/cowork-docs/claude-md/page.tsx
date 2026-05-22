import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "How CLAUDE.md Works in Cowork — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — CLAUDE.md in Cowork",
  robots: { index: false, follow: false },
};

const content = `# How CLAUDE.md Works in Cowork

\`CLAUDE.md\` is the single most important file in your Cowork workspace. It tells Claude who to be, how to behave, and where to route requests. Understanding how it works in Cowork (vs. Claude Code) is critical.

## Cowork != Claude Code

This is the #1 source of confusion. Cowork and Claude Code share some DNA but the harness behaves differently:

| Behavior | Claude Code | Cowork |
|----------|------------|--------|
| \`CLAUDE.md\` loads at session start | Yes | Yes |
| \`settings.json\` agent activation | Yes | **No (dead)** |
| \`agents/\` directory | Yes | **No (dead)** |
| \`.mcp.json\` local MCP servers | Yes | **No (dead)** |
| Skills auto-discovery from plugins | N/A | **Yes** |
| Workspace file persistence | Local filesystem | **Mounted folder only** |

If you're reading Claude Code docs and trying to apply them to Cowork, half of it won't work. This guide covers what actually works.

## What CLAUDE.md Does

When you start a new Cowork task (session), Claude reads \`CLAUDE.md\` from the root of your mounted folder. This happens automatically, every time, no configuration needed.

\`CLAUDE.md\` controls:

1. **Persona** -- Who Claude thinks it is. "You are Coworker, an AI assistant that organizes files..."
2. **Routing** -- Which skills to invoke for which requests. "When the user asks to organize files, use the /organizing-files skill."
3. **Rules** -- Behavioral constraints. "Never delete files without confirmation."
4. **Context** -- Background information Claude needs. "This workspace belongs to a marketing consultant who..."

## How It Loads

1. User clicks "New Task" in Cowork
2. Cowork reads \`CLAUDE.md\` from the mounted folder root
3. The full content of \`CLAUDE.md\` is injected into Claude's system context
4. Claude now operates according to those instructions for the entire session

**Key behavior:** \`CLAUDE.md\` is read ONCE at session start. If you edit it mid-session, the changes won't take effect until you start a new task.

## Size and Token Budget

\`CLAUDE.md\` competes with skills, plugins, and conversation history for Claude's context window. Keep it focused:

- **Recommended:** Under 2,000 words for the core instructions
- **Maximum practical:** ~4,000 words before you start losing skill/conversation space
- **What to put in CLAUDE.md:** Persona, routing rules, behavioral constraints
- **What to put elsewhere:** Reference data, long examples, detailed procedures (use skills for these)

## Persona vs. Routing

The two jobs of \`CLAUDE.md\` are different and both matter:

**Persona** (who Claude is):
\`\`\`markdown
You are Coworker, a direct and efficient AI assistant. You organize files,
track projects, and remember preferences across sessions. You're helpful
but not chatty.
\`\`\`

**Routing** (what triggers what):
\`\`\`markdown
## Skills

When the user asks to organize files → use /organizing-files
When the user asks about workspace status → use /workspace-status
When the user mentions ingesting or filing a document → use /ingesting-files
\`\`\`

Without routing rules, Claude will try to handle requests itself instead of delegating to your skills. Good routing = skills actually get used.

## The Setup Command Pattern

For products/plugins that need first-run configuration:

1. User installs your plugin
2. User runs \`/setup\` (a skill in your plugin)
3. The setup skill creates a config directory (e.g., \`.coworker/\`) in the workspace
4. The setup skill writes config files based on user answers
5. User starts a **new task** (so CLAUDE.md + new config load together)
6. Claude now has both persona (CLAUDE.md) and user preferences (config files)

This pattern is essential for any plugin that needs to "remember" the user.

## Common Mistakes

**Mistake: Stuffing everything into CLAUDE.md**
Your CLAUDE.md is not a knowledge base. It's a routing table and persona definition. Long reference docs belong in skills or separate files that skills read on demand.

**Mistake: Expecting settings.json to work**
\`settings.json\` agent activation is Claude Code only. In Cowork, CLAUDE.md is the only way to configure Claude's behavior.

**Mistake: Not telling Claude about its skills**
If you install a plugin with 5 skills but CLAUDE.md doesn't mention them, Claude might not route to them. Skill descriptions help (they're always in context), but explicit routing rules in CLAUDE.md are more reliable.

**Mistake: Editing CLAUDE.md mid-session**
Changes don't take effect until a new task. Always start a new task after editing CLAUDE.md.`;

export default function Page() {
  return <DocPage breadcrumb="CLAUDE.md in Cowork" content={content} lastVerified="March 31, 2026" />;
}
