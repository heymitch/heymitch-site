import type { ArchetypeName, ArchetypeReco } from './types';

// ~12 marquee tools for the quiz's multi-select inventory, tier-tagged by sophistication.
// 1 = entry (chat) · 2 = applied · 3 = builder/automation · 4 = agentic/sovereign.
// Source: State of AI Q1 2026 Tools Guide by Mitch Harris.
export const MARQUEE_TOOLS: { id: string; label: string; tier: 1 | 2 | 3 | 4 }[] = [
  { id: 'chatgpt',       label: 'ChatGPT',       tier: 1 },
  { id: 'perplexity',    label: 'Perplexity',    tier: 1 },
  { id: 'notebooklm',    label: 'NotebookLM',     tier: 2 },
  { id: 'nano-banana',   label: 'Nano Banana',    tier: 2 },
  { id: 'elevenlabs',    label: 'ElevenLabs',     tier: 2 },
  { id: 'midjourney',    label: 'Midjourney',     tier: 2 },
  { id: 'seedance',      label: 'Seedance',       tier: 2 },
  { id: 'fathom',        label: 'Fathom',         tier: 2 },
  { id: 'cursor',        label: 'Cursor',         tier: 3 },
  { id: 'n8n',           label: 'n8n',            tier: 3 },
  { id: 'zapier',        label: 'Zapier',         tier: 3 },
  { id: 'claude-code',   label: 'Claude Code',    tier: 3 },
  { id: 'claude-cowork', label: 'Claude Cowork',  tier: 4 },
];

// What each archetype should learn/add NEXT, grounded in the State of AI Q1 2026
// Tools Guide. Voice: Mitch (no em-dashes; verified against the AI Hunter engine).
export const RECOMMENDATIONS: Record<ArchetypeName, ArchetypeReco> = {
  Tinkerer: {
    headline: 'Stop re-typing the same prompts. Get your first real harness.',
    harness: {
      name: 'Claude Cowork',
      why: 'It turns the chat box into an operating system. Your files, your browser, your workflow, all connected, so you stop copy-pasting results around.',
    },
    tool: {
      name: 'NotebookLM',
      why: 'Upload 50 docs and interrogate them in an hour. Fastest way to feel what a contained, reliable AI setup can do.',
    },
    connectorOrSkill: {
      name: 'Fathom',
      why: 'Record one call, feed the transcript to an agent. That single move is what delegation actually feels like.',
    },
    firstStep: 'Install Claude Cowork, describe one task you do manually every day, and let it run while you make coffee.',
  },

  Operator: {
    headline: 'The workflow runs. Now make it start itself.',
    harness: {
      name: 'Claude Cowork',
      why: 'You already trust a few workflows. Cowork gives them a trigger, a schedule, and a memory, so you stop being the one who presses go.',
    },
    tool: {
      name: 'Fathom',
      why: 'Every call becomes a content and action-item pipeline the moment you stop treating the transcript as a document.',
    },
    connectorOrSkill: {
      name: 'n8n',
      why: 'Open source, self-hostable, AI nodes built in. Wire your highest-frequency trigger to a workflow you already run and watch the domino fall without you.',
    },
    firstStep: 'Pick one workflow you run by hand three-plus times a week and set an n8n trigger to kick it off automatically.',
  },

  Builder: {
    headline: 'You can build. Now build something that runs without you in the loop.',
    harness: {
      name: 'Claude Code',
      why: 'You are already building real things. Code lets you hand the next build to an agent that understands your whole architecture, not just the file you are in.',
    },
    tool: {
      name: 'Cursor',
      why: 'Drop Claude Code output into Cursor and you get an AI-aware IDE that reads your whole codebase. Cuts the debugging loop in half.',
    },
    connectorOrSkill: {
      name: 'n8n',
      why: 'AI nodes plus deterministic triggers in one tool. It is the seam between the thing you built and the system that runs it with no human handoff.',
    },
    firstStep: 'Take your last build and wire one output to an n8n node so it ships automatically. No manual push.',
  },

  Hermit: {
    headline: 'Your automation is real. It is also a black box that dies when you leave.',
    harness: {
      name: 'Claude Cowork',
      why: 'Cowork skills are the format. Write your black box as a skill and now a person, or another agent, can run it cold.',
    },
    tool: {
      name: 'Perplexity',
      why: 'Start every documentation session here. Fast synthesis of how other builders make complex workflows legible forces you to think in outputs, not inputs.',
    },
    connectorOrSkill: {
      name: 'NotebookLM',
      why: 'Upload your own process docs and audio-overview them. If the two-host podcast can explain your workflow, you have made it legible enough to hand off.',
    },
    firstStep: 'Pick your most important black-box workflow and write it up as a Claude Cowork skill this week. If someone else could run it, you have won.',
  },

  Scribe: {
    headline: 'Beautiful docs. No engine. Time to make the map drive the car.',
    harness: {
      name: 'Claude Cowork',
      why: 'Your docs are already the system prompt. Cowork turns them into an agent that can actually execute the steps you wrote down.',
    },
    tool: {
      name: 'Fathom',
      why: 'Record the next workflow you run manually, let Fathom transcribe it, then hand that transcript to Cowork as the spec. Instant executable doc.',
    },
    connectorOrSkill: {
      name: 'n8n',
      why: 'Your process docs become n8n workflow logic. The moment you wire the first trigger, you go from Scribe to Operator.',
    },
    firstStep: 'Take your best process doc and paste it into Claude Cowork as a task. Tell it to execute step one and see what breaks.',
  },

  Mogul: {
    headline: 'You buy the best and move fast. Make sure the connectors keep up with the pace.',
    harness: {
      name: 'Claude Cowork',
      why: 'The command layer that sits on top of your whole tool stack. Instead of tab-switching between your best-in-class tools, Cowork routes between them for you.',
    },
    tool: {
      name: 'Fathom',
      why: 'Free, best-in-class transcription plus real CRM integration. Every call becomes a content and insight asset automatically, with no extra subscription line.',
    },
    connectorOrSkill: {
      name: 'Zapier',
      why: 'Five thousand pre-built connectors and the most polished interface in the category. When you just need dominoes to fall reliably, Zapier is the move.',
    },
    firstStep: 'Map out your top five tools and find the two that still need a manual handoff between them. Wire that gap in Zapier today.',
  },

  Sovereign: {
    headline: 'You own the engine. Keep it open, keep it yours, keep it running.',
    harness: {
      name: 'Claude Code',
      why: 'The top everything-agent. If something needs to happen on a computer, Code handles it, and it calls local open-source models when you need to stay off the cloud.',
    },
    tool: {
      name: 'n8n',
      why: 'Open source, self-hostable, AI nodes native. The automation layer that matches your values: you own the stack, you are not renting someone else\'s.',
    },
    connectorOrSkill: {
      name: 'Obsidian',
      why: 'Local-first, AI-native markdown, no vendor lock. Your knowledge base becomes the memory layer your agents read without burning tokens on third-party connectors.',
    },
    firstStep: 'Audit one cloud-only tool in your stack and find the self-hosted equivalent. n8n over Zapier is the first obvious swap.',
  },

  Wizard: {
    headline: 'You run the fleet. Your job now is keeping it legible as it grows.',
    harness: {
      name: 'Claude Cowork',
      why: 'The fleet-manager interface. Skills, agent chains, file access, browser control, all in one place, so you supervise outputs instead of driving every agent by hand.',
    },
    tool: {
      name: 'Fathom',
      why: 'Fleet reviews are calls. Fathom turns every oversight conversation into an automatic action-item pipeline, so nothing falls through the coordination gap.',
    },
    connectorOrSkill: {
      name: 'n8n',
      why: 'Multi-agent coordination needs a deterministic backbone. n8n lets your agents hand off to each other with you out of the middle.',
    },
    firstStep: 'Write a one-page brief for your current fleet: what each agent does, its inputs and outputs, and what breaks when it fails. Legibility is the actual job now.',
  },
};
