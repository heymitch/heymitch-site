# heymitch.ai redesign : reflect the full stack (working brief)

> Branch: `feat/homepage-fullstack-redesign`. Launchpad for the redesign, not the redesign itself.
> Goal (Mitch): redesign the homepage so it reflects the FULL STACK we have been building this week. No em dashes.

## Already done on this branch
- **Paper swap applied.** `--c-page` (light mode) moved from `#F0E4D0` cream to **`#F1EEEA` paper** (the PAB palette), in `src/app/globals.css:12`. Dark mode untouched.
- Note: one unrelated file (`src/lib/ai-hunter-engine.ts`) was already modified in the working tree before this branch. Left as-is.

## Token harmonization (your call)
The page is now cooler paper, but the warm tokens around it did not move. If the cream-vs-paper mismatch reads off, harmonize:
- `--c-surface: 224 212 190` (`#E0D4BE`, warm cream-dark) to a cooler raise, e.g. `#E7E2DA` = `231 226 218`.
- `--link-hover: #E8682A` (burnt orange) and `--ascii-portrait` still warm. Decide if the new palette stays warm-accented or shifts.

## Current homepage structure (`src/app/page.tsx`, 208 lines)
1. **ASCII portrait** fixed to the right half, behind everything.
2. **Hero** : h1 + CRT readout + apply/CTA + countdown + socials.
3. **Free Tools & Skills** : a card gallery driven by `publishedResources`.
4. **Dark footer band.**

The redesign center of gravity is section 3. That gallery IS where "the full stack" shows up.

## The stack is data-driven
`src/app/page.tsx:6` imports `@/data/resources.json`, then `resources.filter(r => r.published)`.
Schema per entry:
```json
{ "title": "", "description": "", "image": "/products/x.png", "url": "/route", "category": "skill|tool", "published": true }
```

### What is in the gallery today (published)
AI Hunter 2.0, BrowserMonkey, Unbundle, Snaptastic, Sifu. (Google Drive Skill = unpublished.)

### The gap = the full stack is NOT represented
These shipped or this-week builds have routes/products but are missing from the gallery:
- **Buckler** (`/buckler`) : shipped this week (free OSS LP + Kit waitlist).
- **Signal** (`/signal`) : OSS LinkedIn analytics.
- **AI-Native quiz** (`/ai-native`) : the free archetype tool.
- **Dispatch** (`/dispatch`).
- **Personal Agent Bootcamp** (new this week) : `lead-gen/funnels/personal-agent-bootcamp/`, the Build & Sell landing. [NEED: deployed URL + a product image]
- **Wingman** (new this week) : the personal-agent product. [NEED: where it lives publicly + image]

Adding these to `resources.json` (with `published: true` + a `/products/*.png` image each) is the fastest path to "reflect the full stack." The bigger redesign question is whether the gallery should also gain **categories/sections** (Tools vs Skills vs Bootcamps/Products) now that the stack is this deep.

## Open questions for you
1. Which of the gap items get featured, and in what order? (All of them, or a curated top set?)
2. Does the gallery stay one flat grid, or split into Products / Tools / Skills tiers?
3. Palette: full cool-paper harmonization, or keep the warm accents on the new paper base?
4. Hero: does the redesign touch the hero (new headline reflecting the stack), or only the gallery?

## Run it locally
```bash
cd lead-gen/funnels/heymitch-site && npm run dev   # then open the localhost port it prints
```

## Asset notes
New products need a `/public/products/*.png` (the floppy/product-image style the gallery uses). PAB has its own art in `lead-gen/funnels/personal-agent-bootcamp/assets/` to draw from.
