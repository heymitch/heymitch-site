import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Local Data Safety — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Local Data Safety",
  robots: { index: false, follow: false },
};

const content = `# Local Data Safety — What Lives Where and What You Can Lose

Claude Desktop stores session data, conversation history, and cache files on your local machine. Deleting the wrong folder can wipe out every conversation you've ever had. This doc tells you where things live and what not to touch.

## Where Claude Stores Data on macOS

\`\`\`
~/Library/Application Support/Claude/
├── conversation history
├── session state
├── plugin cache
├── settings
└── internal databases
\`\`\`

This is the **entire brain** of Claude Desktop on your machine. If you delete this directory, you lose:

- Every Chat conversation
- Every Cowork task and session
- Every Code session
- All installed plugin state
- Your settings and preferences
- Your Claude memory (Chat's auto-synthesized memory)

There is no cloud backup of this data. It's gone.

## The Danger Zone

### Never Delete \`~/Library/Application Support/Claude/\`

Not the folder. Not individual files inside it. Not "just the cache." The internal structure is undocumented and files that look like "cache" may contain conversation history.

If Claude Desktop is acting up, the safe fix is:

1. Quit Claude Desktop completely
2. Reopen it

If that doesn't work:

1. Quit Claude Desktop
2. Check for updates (Claude menu > Check for Updates)
3. Reopen

If you're still stuck, contact Anthropic support. Do not delete Application Support files as a troubleshooting step.

### How We Learned This

During a workspace cleanup, we deleted \`~/Library/Application Support/\` contents for an app thinking it was safe to clear cache. It wiped Cowork session state entirely. All active sessions, all task history, all conversation context — gone in one \`rm -rf\`.

The lesson: **Application Support is not cache. It's data.**

## What's Safe to Delete

| Location | Safe to delete? | What happens |
|----------|:-:|---|
| Files in your mounted workspace folder | Yes | Your files, your control |
| \`~/Downloads/*.zip\` (plugin ZIPs) | Yes | Re-download from source if needed |
| Claude Desktop app itself | Careful | Reinstalling the app preserves data in Application Support, but check first |
| \`~/Library/Application Support/Claude/\` | **NEVER** | Wipes all session history, conversations, settings |
| \`~/Library/Caches/Claude/\` | Mostly safe | May slow down first launch, but no data loss |

## Your Workspace vs. Claude's Storage

These are completely separate:

| Your workspace | Claude's storage |
|---|---|
| \`~/Desktop/coworker/\` (or wherever you mounted) | \`~/Library/Application Support/Claude/\` |
| Files YOU created and control | Files CLAUDE created internally |
| Persists because it's your filesystem | Persists because Claude Desktop manages it |
| Safe to organize, move, rename | Never touch manually |
| Backed up if you back up your Mac | Only backed up if your Mac backup includes Library/ |

## Backup Recommendations

1. **Time Machine** — If enabled, it backs up \`~/Library/Application Support/\` automatically. This is your safety net.
2. **Your workspace** — Back up your mounted folder separately if it contains important work. Git, iCloud, Dropbox — whatever you use for files.
3. **Plugin ZIPs** — Keep copies of any custom plugins you've uploaded. If Claude's plugin cache gets corrupted, you'll need to re-upload.

## For Skill Builders

If you're building skills or plugins, your skill code lives in the plugin ZIP you uploaded. The installed copy inside Claude is managed by Claude Desktop. To be safe:

- Always keep your source plugin folder outside of Claude's storage
- Use \`build.sh\` to regenerate ZIPs from source
- Version control your skill code (git)
- The plugin directory inside the VM is read-only — you can't accidentally modify installed plugins from within Cowork

## The One Rule

**If the path contains \`Library/Application Support\`, don't touch it.** Ask before deleting. Verify before purging. There is no undo.`;

export default function Page() {
  return <DocPage breadcrumb="Local Data Safety" content={content} lastVerified="March 31, 2026" />;
}
