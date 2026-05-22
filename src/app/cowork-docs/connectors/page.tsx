import type { Metadata } from "next";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "How Connectors Work — Claude Cowork Field Docs",
  description: "Claude Cowork Field Docs — Connectors",
  robots: { index: false, follow: false },
};

const content = `# How Connectors Work — The Network Workaround

## The VM Network Is Locked Down

The Cowork VM runs on a strict network allowlist. Only three domains are reachable:

- \`api.anthropic.com\`
- \`pypi.org\`
- \`registry.npmjs.org\`

Everything else times out. If your skill tries to \`curl\` an API, \`fetch\` a webhook, or use \`axios\` to hit any external service, it will fail silently or hang until timeout. There is no error message telling you the network is blocked. The request just dies.

This means you cannot build a skill that makes raw HTTP calls to external services. No REST APIs, no GraphQL endpoints, no webhooks to your own server. The VM's network stack simply will not route the traffic.

## Connectors Route Through Anthropic's Edge

Connectors (Gmail, Notion, Slack, Google Calendar, Google Docs, Google Sheets, Google Slides, Figma, and others) work because they do not go through the VM's network. They route through Anthropic's edge infrastructure. The VM calls Anthropic's API, Anthropic's servers make the actual HTTP request to the third-party service, and the result comes back through the same channel.

This is why connectors work and raw API calls do not. The connector traffic never touches the VM's network stack.

## Adding Connectors

Connectors are added through the Cowork UI:

1. Open the sidebar
2. Go to **Customize > Connectors**
3. Select the connector you want (Gmail, Notion, Slack, etc.)
4. Complete OAuth authentication when prompted

Each connector requires OAuth the first time. After that, the authentication persists across sessions.

## How Skills See Connectors

Once a connector is installed, it appears in Claude's context as an available tool. You do not need to write explicit instructions in your skill telling Claude to use the Gmail connector. Claude sees the connector tools and uses them when relevant.

If a connector is NOT installed, Claude will still attempt to accomplish the task. It will try workarounds, suggest manual steps, or produce inferior results. It will not tell the user "you need to install the Gmail connector first" unless your skill's instructions explicitly say to check for it.

## What Does NOT Work

- **MCP servers in \`.mcp.json\`** do not work in Cowork. That file is a Claude Code feature. Cowork ignores it entirely. If your plugin ships with an \`.mcp.json\`, it will be ignored.
- **Local stdio MCP servers** cannot run. The VM does not support launching background processes that serve as MCP endpoints.
- **Direct API calls** from skills to any service outside the allowlist. No amount of retry logic or timeout configuration will fix this. The traffic is blocked at the network level.

## Practical Implications for Skill Authors

If your skill needs to interact with an external service, you have two options:

1. **Use a connector.** If one exists for the service you need, this is the only reliable path. Your skill should document which connectors it requires.
2. **Work offline.** Design your skill to operate on local files in the workspace. Generate output that the user can manually copy/paste or upload elsewhere.

There is no third option. You cannot sneak HTTP requests through. You cannot proxy through \`api.anthropic.com\`. You cannot use npm packages that phone home during execution. The allowlist is enforced at the network layer, not the application layer.`;

export default function Page() {
  return <DocPage breadcrumb="Connectors" content={content} lastVerified="March 31, 2026" />;
}
