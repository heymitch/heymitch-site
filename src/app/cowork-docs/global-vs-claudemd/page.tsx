import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Global Instructions vs. CLAUDE.md — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Global vs CLAUDE.md",
  robots: { index: false, follow: false },
};

const content = `# Global Instructions vs. CLAUDE.md — Two Systems, Different Jobs

Cowork has two ways to give Claude persistent instructions. They look similar but serve different purposes and load at different times. Using the wrong one causes confusion.

## The Two Systems

### Global Instructions (Claude Desktop Settings)

- Set in: Claude Desktop > Settings > Profile (or similar)
- Applies to: **every session** across Chat, Cowork, and Code
- Scope: your identity, preferences, communication style
- Persists: in Claude Desktop's local storage (Application Support)
- Examples: "I'm a marketing consultant. I prefer direct communication. Always respond in English."

### CLAUDE.md (Project File)

- Location: root of your mounted workspace folder
- Applies to: **only Cowork/Code sessions** using that specific folder
- Scope: persona, routing rules, skill instructions, project-specific context
- Persists: as a file on your filesystem (you control it)
- Examples: "You are Coworker. Route file organization requests to /organize. Never delete files without asking."

## When Each One Loads

\`\`\`
User opens Claude Desktop
│
├─ Chat tab
│   └─ Global instructions loaded ✓
│       CLAUDE.md NOT loaded (no folder mounted)
│
├─ Cowork tab → mounts a folder
│   └─ Global instructions loaded ✓
│       CLAUDE.md loaded from folder root ✓
│       Both active simultaneously
│
├─ Cowork tab → Dispatch (no folder)
│   └─ Global instructions loaded ✓
│       CLAUDE.md NOT loaded (no folder mounted)
│
└─ Code tab → opens a project
    └─ Global instructions loaded ✓
        CLAUDE.md loaded from project root ✓
\`\`\`

## The Conflict Problem

If your global instructions say "always be formal and professional" but your CLAUDE.md says "you're Coworker, be casual and direct," Claude receives both. In practice, CLAUDE.md usually wins because it's more specific and loaded later. But the conflict exists and can cause inconsistent behavior.

**Best practice:** Keep global instructions about YOU (who you are, how you communicate). Keep CLAUDE.md about THE PROJECT (what Claude should do, how to route, what skills to use).

## What Goes Where

| Instruction | Global | CLAUDE.md |
|---|:-:|:-:|
| Your name and role | ✓ | |
| Your communication preferences | ✓ | |
| Your timezone and locale | ✓ | |
| Agent persona ("You are Coworker") | | ✓ |
| Skill routing rules | | ✓ |
| Project-specific context | | ✓ |
| File organization preferences | | ✓ |
| "Never delete without asking" rules | | ✓ |
| Default language/tone | ✓ | |
| Tool preferences (which connectors to use) | | ✓ |

## Common Mistakes

### Putting routing rules in global instructions

Global instructions apply to Chat too, where skills don't exist. Putting "use /organize for file tasks" in global instructions confuses Claude in Chat mode where that skill isn't available. Put routing rules in CLAUDE.md only.

### Duplicating identity in both places

If both global instructions and CLAUDE.md say "the user's name is Mitch," that's wasted context. Say it once in global instructions (which loads everywhere) and reference it in CLAUDE.md only if the persona needs to know it.

### Forgetting that Dispatch doesn't load CLAUDE.md

If all your important instructions are in CLAUDE.md, Dispatch tasks start with a blank slate (plus global instructions only). For Dispatch-compatible workflows, put critical instructions in global instructions or accept that Dispatch tasks are "generic Claude" without your project persona.

### Making CLAUDE.md too long

CLAUDE.md competes with skill descriptions and conversation history for context window space. If your CLAUDE.md is 5,000 words of project history, skills have less room to operate. Keep CLAUDE.md focused: persona + routing + rules. Put detailed reference material in skill reference files that load on demand.

## Testing Which Instructions Are Active

Ask Claude directly:

\`\`\`
What instructions are you following right now?
\`\`\`

or

\`\`\`
What do you know about me from your instructions?
\`\`\`

Claude will summarize what it sees in its system context, which reveals whether global instructions, CLAUDE.md, or both are loaded.

## The Mental Model

Think of it like a company:

- **Global instructions** = your business card (who you are, follows you everywhere)
- **CLAUDE.md** = the job briefing for this specific project (what to do here, only relevant in this workspace)

You wouldn't put project deliverables on your business card. You wouldn't introduce yourself differently in every project briefing. Same principle.`;

export default function Page() {
  return <DocPage breadcrumb="Global vs CLAUDE.md" content={content} lastVerified="March 31, 2026" />;
}
