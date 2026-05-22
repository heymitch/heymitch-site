import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Memory and Context — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Memory and Context",
  robots: { index: false, follow: false },
};

const content = `# Memory and Context — How Cowork Remembers (and Forgets)

Cowork does not have Chat's auto-synthesized memory. This is the single biggest gap people hit when moving from Claude Chat to Cowork. In Chat, Claude quietly builds a memory of your preferences, past conversations, and working style. In Cowork, none of that exists. If you want Claude to remember something across sessions, you have to write it down yourself.

## The memory stack (what's actually in context)

Three things compete for Claude's context window in every Cowork session:

1. **CLAUDE.md** — Loaded at task start. This is your primary memory mechanism. Everything you want Claude to know about your project, your preferences, your constraints—put it here. You control it entirely.

2. **Skill descriptions** — Every skill in your \`skills/\` directory has a description in its SKILL.md frontmatter (~100 words). These descriptions are **always in context.** The body of the SKILL.md only loads after the description triggers a match. This means your skill descriptions are burning context tokens whether or not they're being used, so keep them tight.

3. **Conversation history** — The current session's back-and-forth. This grows as you work and eventually pushes against the context window.

These three compete. A 5,000-word CLAUDE.md eats into the space available for conversation history and skill descriptions. A project with 40 skills, each with 100-word descriptions, adds 4,000 words of always-on context.

## CLAUDE.md is your memory

Keep it under 2,000 words for core instructions. This isn't a soft suggestion—go much beyond that and you start crowding out conversation history, which degrades performance on longer tasks.

What belongs in CLAUDE.md:
- Project identity and persona instructions
- Routing rules (which skill handles what)
- Hard constraints ("NEVER do X", "ALWAYS do Y")
- File structure orientation

What doesn't belong in CLAUDE.md:
- Long reference documents (put them in files, load on demand)
- Full API docs (link to them or use a skill)
- Conversation history or session logs

## Config files as structured memory

Skills can read and write files in the workspace. The pattern that works:

\`\`\`
.coworker/
  config.json      # Structured settings skills can read
  index.md         # Navigation and routing for the workspace
  memory.md        # Anything Claude should "remember" across sessions
\`\`\`

This is manual memory. You or your skills write to these files, and future sessions read them. It's not elegant, but it's reliable and transparent. You can see exactly what Claude "remembers" because it's a file on your disk.

## What Cowork does NOT have

- **No auto-memory synthesis.** Claude won't remember that you prefer TypeScript over JavaScript unless CLAUDE.md says so.
- **No cross-session conversation recall.** Previous sessions are gone. The conversation history starts fresh every time.
- **No implicit learning.** If you correct Claude's behavior in session 1, it won't carry that correction to session 2 unless you write it to CLAUDE.md or a config file.

## Projects vs. folder-mounted sessions

Claude's "Work in a project" feature may provide some project-level memory that persists across conversations within that project. But this is separate from Cowork's folder-mounted sessions. Don't confuse the two:

- **Project memory** — managed by Claude's project system, may carry some context between conversations within the same project
- **Workspace memory** — files in your mounted folder, fully under your control, read by CLAUDE.md and skills

If you're using Cowork with a mounted folder, your workspace files are the authoritative memory. Anything else is a bonus you shouldn't depend on.

## Practical guidelines

1. **Treat CLAUDE.md as a living document.** Update it as your project evolves. Stale instructions are worse than no instructions.
2. **Keep skill descriptions surgical.** Every word in a skill description is always-on context. "Generates LinkedIn posts using proven hook patterns and client voice config" is better than a paragraph explaining the history of your content strategy.
3. **Offload reference material to files.** Instead of stuffing your CLAUDE.md with style guides, write \`See .coworker/style-guide.md for voice and tone rules\` and let the skill load it when needed.
4. **If it matters across sessions, write it to disk.** There is no other way. This is the rule.`;

export default function Page() {
  return <DocPage breadcrumb="Memory and Context" content={content} lastVerified="March 31, 2026" />;
}
