import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Dispatch and Scheduled Tasks — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Dispatch and Scheduled",
  robots: { index: false, follow: false },
};

const content = `# Dispatch and Scheduled Tasks

Dispatch and Scheduled Tasks are two features that let you use Cowork without sitting at your computer. They are useful and they have sharp limitations that are not documented anywhere obvious.

## Dispatch

Dispatch is a mobile-first interface. You open Cowork on your phone, type a task, and send it. Claude works on it asynchronously. You check back later for results.

The sidebar navigation shows: **New task, Search, Scheduled, Dispatch, Ideas, Customize.**

## Scheduled Tasks

Scheduled tasks run on a cron schedule you define. You set up a task like "Summarize my inbox every weekday at 8AM" and Cowork runs it automatically.

Each scheduled task shows:
- Its schedule (e.g., "Weekdays ~8AM")
- Its status (Active or Paused)
- A "Keep awake" toggle

## The critical limitation

**Dispatch and Scheduled Tasks do not mount a folder.** They run in a temporary workspace with no persistent files. This one fact changes everything about what works and what doesn't.

When you start a regular Cowork session, you pick a folder from your computer. That folder gets mounted into the VM. Your CLAUDE.md loads. Your skills load. Your config files are readable. Dispatch and Scheduled Tasks skip all of this. There is no folder. There is no mount.

This means:

- **Skills that depend on reading workspace files will fail.** If a skill tries to read \`.coworker/config.json\` or any other workspace file, it won't find it. The file doesn't exist in the temporary environment.
- **CLAUDE.md may or may not load.** If you have a Project selected and that project has instructions, those may apply. But a folder-level CLAUDE.md from a workspace that isn't mounted won't be there.
- **There is no way to "mount a folder" from Dispatch.** If a model suggests you mount a folder to fix a broken Dispatch task, that advice is wrong. Dispatch doesn't have that capability. The entire point of Dispatch is that you're away from your computer.
- **File output has nowhere to go.** A task that generates files and writes them to the workspace has no workspace to write to. The files land in the ephemeral VM and vanish when the task completes.

## What works with Dispatch and Scheduled Tasks

Tasks that don't need local files:

- **Web research.** "Research the top 5 competitors to [company] and summarize their pricing."
- **Writing drafts.** "Write a cold email to [person] about [topic]." The output appears in the conversation, not in a file.
- **Answering questions.** "What's the difference between Series A and Series B funding?"
- **API-based tasks via connectors.** If you have MCP connectors set up (Slack, Notion, Gmail, etc.), Dispatch can use them. "Send a Slack message to #general with today's standup update" works because it goes through the connector, not through local files.
- **Calculations and analysis.** "Calculate the ROI on a $50K ad spend with 2% conversion at $500 ACV."

## What does NOT work with Dispatch and Scheduled Tasks

Anything that requires the mounted workspace:

- **File organization.** "Clean up my downloads folder" — there is no folder.
- **Reading local documents.** "Summarize the PDF in my project folder" — no project folder is mounted.
- **Running skills that read config files.** Most well-built skills read voice configs, style guides, or project context from the workspace. Without the workspace, they either fail or produce generic output.
- **Writing persistent output.** "Generate a report and save it to reports/" — the reports directory doesn't exist, and even if the skill creates it, it vanishes after the task.
- **Git operations.** No repo is mounted, so there's nothing to commit, push, or branch.

## Designing for Dispatch compatibility

If you want a skill to work from Dispatch, it must:

1. **Not depend on any workspace files.** No config reads, no template files, no local context.
2. **Return output in the conversation**, not to a file. The user will see it in the Dispatch response.
3. **Use connectors for external writes.** If the skill needs to save output somewhere durable, use an API (Notion, Slack, email) rather than the filesystem.
4. **Degrade gracefully.** If a skill can optionally use workspace config but doesn't require it, it should detect the missing files and fall back to defaults instead of crashing.

## Scheduled task specifics

- The "Keep awake" toggle prevents the session from going idle between runs. Useful if you want faster startup but consumes more resources.
- Scheduled tasks show a history of past runs so you can audit what happened.
- If a scheduled task fails repeatedly, it doesn't auto-disable. Check your task history.
- The schedule uses approximate times ("~8AM"), not precise cron timestamps. Don't design workflows that depend on exact timing.`;

export default function Page() {
  return <DocPage breadcrumb="Dispatch and Scheduled" content={content} lastVerified="March 31, 2026" />;
}
