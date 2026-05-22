import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Plugin Packaging Rules — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Plugin Packaging",
  robots: { index: false, follow: false },
};

const content = `# Plugin Packaging Rules — What Breaks and Why

These rules come from repeated testing. Every rule here corresponds to something that broke when violated.

## Plugin Naming

Plugin names must be **lowercase alphanumeric + hyphens only**.

| Name | Works? |
|------|--------|
| \`file-master\` | Yes |
| \`File Master\` | No |
| \`file.master\` | No |
| \`File-Master\` | No |
| \`file_master\` | No |
| \`file master\` | No |

No spaces, no dots, no capitals, no underscores, no special characters. If you deviate from this, the upload may succeed but skills will not register properly.

## Required: \`.claude-plugin/plugin.json\`

Every plugin ZIP must contain a \`.claude-plugin/plugin.json\` file at the root level. Without it, the ZIP uploads successfully through the UI with no error, but skills will not appear.

The required fields:

\`\`\`json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "description": "What this plugin does",
  "author": "Your Name"
}
\`\`\`

All four fields are required. The \`name\` here must follow the same naming rules above.

## Skills Directory Structure

Skills live in a \`skills/\` directory at the plugin root. Each skill is a folder containing a \`SKILL.md\` file:

\`\`\`
your-plugin.zip
├── .claude-plugin/
│   └── plugin.json
└── skills/
    ├── organize/
    │   └── SKILL.md
    ├── search/
    │   └── SKILL.md
    └── ingest/
        └── SKILL.md
\`\`\`

## SKILL.md Frontmatter

Every \`SKILL.md\` must have YAML frontmatter with at least \`name\` and \`description\`:

\`\`\`yaml
---
name: Organize Files
description: >
  Organize files in the workspace by type, date, or project.
  Use when the user asks to clean up folders, sort documents,
  organize their workspace, or tidy files. Handles renaming,
  moving, and creating folder structures.
---
\`\`\`

The \`description\` field is the trigger mechanism. It is always loaded into Claude's context (roughly 100 words). Write it like a search engine snippet: what the skill does and when to activate it.

The body of the SKILL.md (everything below the frontmatter) only loads after the description triggers activation. This is how Cowork keeps context lean. Do not put critical trigger information in the body.

## Uploading Plugins

- Use **"Upload Plugin"** in the Cowork UI. There is no separate "Upload Skill" option for ZIP packages.
- If a plugin with the same name already exists, you will see a **"Replace existing plugin?"** confirmation dialog.
- After uploading or replacing, you **must start a New Task** for the plugin to load. The current task will not pick up newly installed or updated plugins.

## Update Behavior

- Plugins installed from the marketplace auto-update when new versions are published.
- Plugins uploaded manually as ZIP files do not auto-update. You must re-upload the ZIP and replace.

## Read-Only Plugin Directory

The plugin directory inside the Cowork VM is read-only. Skills can read their own reference files (other markdown files, JSON configs, templates bundled in the ZIP), but they cannot write to the plugin location.

All writable output must go to the mounted workspace. This is the directory the user sees in their local filesystem. Any files a skill creates or modifies should be written there, not back into the plugin directory.

## ZIP Structure Checklist

Before shipping any plugin:

- [ ] ZIP root contains \`.claude-plugin/plugin.json\` with name, version, description, author
- [ ] Plugin name is lowercase alphanumeric + hyphens only
- [ ] \`skills/\` directory at root with one folder per skill
- [ ] Each skill folder contains \`SKILL.md\` with \`name\` and \`description\` in frontmatter
- [ ] Description is written as a trigger (~100 words, includes phrases users would say)
- [ ] No files in the ZIP depend on writing back to the plugin directory
- [ ] Tested: upload, start New Task, verify skills appear in \`/\` autocomplete`;

export default function Page() {
  return <DocPage breadcrumb="Plugin Packaging" content={content} lastVerified="March 31, 2026" />;
}
