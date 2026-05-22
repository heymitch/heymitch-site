import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Workspace Persistence — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Workspace Persistence",
  robots: { index: false, follow: false },
};

const content = `# Workspace Persistence — What Survives and What Doesn't

The single most important thing to understand about Cowork's storage model: **your mounted folder is the only durable storage.** Everything else is ephemeral. Every session runs in a Linux VM that gets torn down when the session ends, and the only thing that bridges between sessions is the folder you mounted from your Mac.

## What persists

- **Files written inside the mounted workspace.** This is your one lifeline. If a skill writes a file here, it survives. If it writes anywhere else, it doesn't.
- **Dotfile directories inside the workspace** (\`.coworker/\`, \`.overclock/\`, etc.) persist across sessions. They're regular directories on your host filesystem. Visible in VS Code and Finder with Cmd+Shift+. but hidden in default Finder view.
- **CLAUDE.md at the workspace root.** It's re-read at every new task start. Not mid-session—if you edit CLAUDE.md while a task is running, the changes won't take effect until the next task.

## What doesn't persist

- **Files written outside the workspace.** \`/tmp\`, \`/home\`, \`/root\`, anywhere in the VM filesystem that isn't the mount point—gone when the session ends. No exceptions.
- **Installed packages.** \`npm install\`, \`pip install\`, \`apt-get install\`—all wiped between sessions. If a skill needs a dependency, it must install it at runtime every time. This is slow but unavoidable.
- **Environment variables.** Any \`export FOO=bar\` in a session is gone next session. If you need persistent env vars, write them to a file in the workspace and source them.
- **Shell history, aliases, dotfiles outside the workspace.** \`.bashrc\`, \`.zshrc\`, anything in the VM's home directory—ephemeral.
- **Running processes.** Background jobs, servers, watchers—all killed when the session ends.

## Path mapping

Your host path maps into the VM like this:

\`\`\`
Host:  /Users/you/Documents/Overclock/
VM:    /sessions/<session-id>/mnt/
\`\`\`

The session ID changes every time. This is why **skills should always use relative paths, never hardcode absolute paths.** A skill that references \`/sessions/abc123/mnt/config.json\` will break in the next session. A skill that references \`./config.json\` or \`config.json\` will work every time.

## Practical implications for skill authors

1. **Bootstrap on every run.** If your skill needs Node packages, install them at the top of execution. Cache the \`node_modules\` in the workspace if you want faster subsequent runs—that directory will persist.
2. **Write all output to the workspace.** Anything your skill produces that matters must land inside the mounted folder. Not \`/tmp/output.json\`. Not \`~/results/\`. Inside the workspace.
3. **Use relative paths everywhere.** The mount point path changes between sessions. Relative paths from the workspace root are the only safe bet.
4. **Don't assume tools are installed.** The VM has Node.js v22, gcc, and standard bash tools. Beyond that, install what you need.

## The "Open in Obsidian" bridge

If Cowork is configured with Obsidian integration, \`.md\` files in the workspace get an "Open in Obsidian" button in the Cowork UI automatically. This works because the workspace is a real folder on your Mac that Obsidian can open. Skills get this for free—no extra configuration needed. Just write markdown files to the workspace and users can view them in Obsidian.

## Common mistakes

- Writing temp files to \`/tmp\` and expecting them later. They won't be there.
- Hardcoding the VM mount path from a previous session.
- Assuming \`python3\` or a specific package is available without installing it.
- Editing CLAUDE.md mid-task and wondering why behavior didn't change. It loads at task start, not continuously.`;

export default function Page() {
  return <DocPage breadcrumb="Workspace Persistence" content={content} lastVerified="March 31, 2026" />;
}
