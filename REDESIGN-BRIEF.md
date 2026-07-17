# heymitch.ai Cloudflare redesign preview

> Branch: `codex/heymitch-redesign-cloudflare`
> Base: current `main` at `bf4b1f9`

## Goal

Port the Every.to-style, cassette-futurist homepage prototype onto the current site without merging the stale redesign branch or replacing current product routes.

## Design retained

- Paper background with warm orange signal color
- Large ASCII portrait and `USEFUL AI` hero
- Instrument-panel navigation, buttons, LEDs, rails, and micrographics
- Editorial writing grid
- Job-oriented tool and services cards
- Arming-panel newsletter interaction

## Current-site boundaries

- `/myrmidocs`, `/dispatch`, `/signal`, `/ai-native`, `/buckler`, `/wingman`, and all existing routes remain current.
- Free tools still come from `src/data/resources.json`.
- Social profiles use current links, including `https://x.com/heymitch`.
- Canonical `wrangler.jsonc` remains the `heymitch` worker.
- `wrangler.redesign.jsonc` targets the isolated `heymitch-redesign` preview worker.
- The newsletter panel continues to the existing Substack subscription flow rather than claiming a local subscription succeeded.

## Preview deployment

Build OpenNext first, then deploy the alternate worker config:

```bash
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.redesign.jsonc
```

This branch is preview-only until visually approved.
