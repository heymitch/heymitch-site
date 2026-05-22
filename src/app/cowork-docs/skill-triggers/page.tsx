import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Skill Trigger Behavior — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Skill Triggers",
  robots: { index: false, follow: false },
};

const content = `# Skill Trigger Behavior — Why Your Skill Isn't Firing

The most common problem with custom skills is that they exist but never activate. This is almost always a trigger issue, not a packaging issue.

## The Description Is the Entire Trigger

The \`description\` field in your SKILL.md frontmatter is the only thing Cowork uses to decide whether to activate a skill. It sits in Claude's context at all times (roughly 100 words). When a user says something that matches the description, the skill fires and the body of SKILL.md loads.

If the description does not match what the user says, the skill will not fire. There is no fallback mechanism. There is no fuzzy matching beyond what Claude's own reasoning provides.

\`\`\`yaml
---
name: File Organizer
description: >
  Organize files in the workspace by type, date, or project.
  Use when the user asks to clean up folders, sort documents,
  organize their workspace, tidy files, or restructure directories.
  Handles renaming, moving, and creating folder structures.
---
\`\`\`

The description above will trigger on "organize my files," "clean up this folder," and "sort these documents." It will probably not trigger on "help me find a file" because that language is not in the description.

## Include Trigger Phrases Explicitly

Do not write the description like a product blurb. Write it like search keywords combined with a brief explanation. Include the actual phrases users would say:

**Bad:**
\`\`\`yaml
description: A powerful file management solution for your workspace.
\`\`\`

**Good:**
\`\`\`yaml
description: >
  Organize files in the workspace by type, date, or project.
  Use when the user asks to organize files, clean up folders,
  sort documents, tidy their workspace, or restructure directories.
\`\`\`

The second version has concrete trigger phrases. The first has marketing copy that will not match natural user language.

## Slash Commands vs. Natural Language

There are two ways a skill can fire:

1. **Slash command** (\`/organize\`) -- triggers directly, no description matching needed
2. **Natural language** ("can you organize my files?") -- depends entirely on the description matching

Slash commands are derived from the **folder name** inside \`skills/\`, not from the \`name\` field in SKILL.md frontmatter. If your folder is \`skills/organize/SKILL.md\`, the slash command is \`/organize\`. If your folder is \`skills/organizing-files/SKILL.md\`, the slash command is \`/organizing-files\`.

In our testing, skill slugs were \`/ingest\`, \`/organize\`, \`/search\`, \`/status\` -- matching the folder names exactly.

## CLAUDE.md Routing Makes Triggers More Reliable

Adding routing instructions to your plugin's CLAUDE.md significantly improves trigger reliability. Instead of relying solely on the description match, you give Claude explicit instructions:

\`\`\`markdown
## Routing

- When the user asks about organizing, sorting, or cleaning up files, use /organize
- When the user asks to find or search for files, use /search
- When the user asks to import or ingest content, use /ingest
\`\`\`

This acts as a secondary trigger layer. Claude reads CLAUDE.md and the skill descriptions together, making the connection between user intent and the correct skill stronger.

## Skills Not Appearing After \`/\`

If you type \`/\` and your skills do not appear in the autocomplete dropdown:

1. **Start a New Task.** This is the fix 90% of the time. Existing tasks do not pick up newly installed or updated plugins. You must begin a new task for the plugin to load.
2. Verify the plugin uploaded successfully (check for the "Replace existing plugin?" dialog if re-uploading).
3. Verify your \`plugin.json\` exists and has valid fields.
4. Verify your skill folders each contain a \`SKILL.md\` with valid frontmatter.

## Multiple Plugins, Similar Descriptions

When multiple installed plugins have skills with similar descriptions, Claude picks the best match based on the user's request. Skills from plugins show their source plugin name in the autocomplete dropdown, so users can disambiguate by selecting the specific skill.

If you are building a plugin that covers territory already handled by another installed plugin, make your descriptions specific enough to differentiate.

## The "See All" View

The **"See all"** link at the bottom of the Cowork home screen shows every available skill across all installed plugins. This is useful for verifying that your skills registered correctly after upload. If your skill appears here, the plugin packaging is correct and the issue is trigger matching.

## Debugging Checklist

When a skill is not firing:

- [ ] Does the skill appear when you type \`/\`? If not, start a New Task.
- [ ] Does the skill appear in "See all" on the home screen? If not, check plugin packaging.
- [ ] Does the description contain the words the user is actually saying?
- [ ] Is the description under ~100 words? Overly long descriptions may get truncated.
- [ ] Does CLAUDE.md have routing rules pointing to this skill?
- [ ] Try the slash command directly (\`/skillname\`) to confirm the skill works when triggered manually.`;

export default function Page() {
  return <DocPage breadcrumb="Skill Triggers" content={content} lastVerified="March 31, 2026" />;
}
