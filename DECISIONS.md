# Studio Woodland — Project Decisions

A record of architectural, design, and workflow decisions made during initial planning.
Reference this file at the start of any Claude Code session to avoid re-explaining context.

---

## The Client

**Artist:** Lynn M. Ruiz
**Studio name:** Studio Woodland
**Medium:** Mosaics (glass, ceramic, stone tesserae)
**Site purpose:** Display artwork, convey information about the artist, provide a way to contact her
**Ecommerce:** Not needed now. May add later (e.g. merch, prints, commissions).

---

## Domain & Hosting

**Domain:** TBD — `studiowoodland.com` was taken. Still deciding between:
- `studiowoodland.co`
- `studiowoodland.studio`
- `studioLMR.com`
- Check `.art` on Porkbun (Cloudflare doesn't support it)

**Registrar:** Cloudflare Registrar preferred (at-cost pricing, free WHOIS privacy).
For `.art` TLD use Porkbun instead — equally trusted, no dark patterns.

**Hosting:** GitHub Pages to start (free, zero config, deploys from repo).
Migration path later: Cloudflare Pages (change host, update one DNS record — trivial).

**DNS note:** Domain registrar and host do not need to be the same company.
If domain is at Porkbun, just add Cloudflare Pages DNS records in Porkbun's panel.

---

## Stack

**Decision: Plain HTML/CSS + vanilla JS. No framework, no build step.**

Rationale:
- Claude Code is the "CMS" — content lives in code, updated by prompting
- Zero build pipeline means the repo IS the site — Cloudflare/GitHub serves files directly
- Maximally legible to an LLM — no framework abstractions or config files
- Trivial updates: "add this painting, here's the filename and metadata" = one prompt
- Still upgradeable: can migrate to Astro or Vite later without throwing away HTML/CSS

**Rejected alternatives:**
- Astro — good framework but overkill for this use case; build tooling overhead not justified
- Headless CMS (Sanity, Decap) — deferred, can add later if Lynn needs to self-manage content

**If a CMS is added later:**
Astro + Sanity is the target stack. Migration is a data-layer swap — components don't change,
just replace local data fetches with Sanity client queries. Low risk refactor.

**Image optimization:**
No automatic build-time optimization (tradeoff of no build step).
Mitigation: manually run images through Squoosh or ImageOptim before adding to repo.
Claude Code can write a batch Sharp (Node) or Pillow (Python) script to automate this.

---

## Content Structure

Artwork data lives in a `paintings` array in `index.html` (or a separate `paintings.js`).
Each object has: `title`, `year`, `medium`, `dimensions`, `series`, `note`, `image`, `color`.

To add a painting:
1. Drop image file into `assets/images/`
2. Copy a paintings object, fill in fields, set `image` to the file path
3. Done — no CMS, no build step

**Adding a CMS later:** This array mirrors exactly how a headless CMS exposes data.
Migration = replace `const paintings = [...]` with an async fetch from Sanity/Contentful.

---

## File Structure

```
/
  index.html          ← entire site (HTML + CSS + JS in one file)
  DECISIONS.md        ← this file
  assets/
    images/
      raw/            ← original files before optimization
      painting-1.jpg  ← optimized files referenced by paintings array
```

---

## Design Decisions

**Aesthetic:** "The Studio Wall" — warm, personal, gallery-like without being cold.
Inspired by: mosaics (geometry, tesserae, fragmented color), a bright personal studio space.

**Color palette:**
- Background: `#faf8f4` (warm off-white)
- Warm surface: `#f3ede3`
- Ink: `#1e1a16` (dark charcoal, not pure black)
- Mid ink: `#5a5046`
- Light ink: `#9a8f82`
- Accent: `#b85c2a` (warm terracotta)
- Accent soft: `#e8c9b0`

**Typography:**
- Headings/titles: Cormorant Garamond (serif, elegant, warm)
- Body/nav/labels: Jost (clean geometric sans, lightweight)

**Navigation:** Top bar. Links: Home · Paintings · Bio · Artist Statement · Contact
(Derived from noreene.janus.com which Lynn called out as ideal nav structure)

**Gallery grid:**
- `auto-fill` with `minmax(260px, 1fr)` — roughly 3 col desktop, 2 tablet, 1 mobile
- Uniform `aspect-ratio: 1/1` thumbnails, `6px` gap (tight, echoes mosaic tesserae)
- Hover: slight scale + darken + title/medium overlay fades in

**Lightbox interaction (derived from katherineasullivan.com preference):**
- Click 1 → detail panel: title, year, medium, dimensions, series, note
- Click 2 (on image in panel) → fullscreen dark view
- Keyboard: arrow keys navigate, Escape closes
- No scroll-triggered animations (Lynn explicitly disliked these — michaelprice.info)

**Homepage:** Goes straight to gallery grid. No hero image, no splash.
(Lynn disliked sites where you have to click through to see work — noreene.janus.com)

**Contact:** Simple form posting to Formspree (free tier, no backend needed) + mailto link.

---

## Reference Sites

**Liked:**
- `katherineasullivan.com` — clean, left nav, one click for info, two clicks for large view
- `clewisart.com` — clean, banner then gallery, magnifying glass interaction
- `noreene.janus.com` — nav structure (Home · Paintings · Purchase · Bio · Statement · Contact)

**Disliked:**
- `michaelprice.info` — scroll-triggered thumbnail animations (gimmicky, distracting)
- `cyndylewis.com` — thumbnails too large, no metadata on click

---

## Workflow

**claude.ai chat:** Design decisions, visual feedback (screenshots), planning new features.
**Claude Code:** All file edits, adding paintings, running scripts, git operations.

**Typical painting-add prompt for Claude Code:**
> "Add garden-mosaic.jpg to the paintings array: title 'Garden Study', medium 'Glass mosaic
> on board', dimensions '18×24 in', year '2024', series 'Garden', note 'Commission for
> private collection.'"

**Image processing workflow:**
1. You sort raw images into series subfolders under `assets/images/raw/`
2. Claude Code runs batch optimization script (Sharp/Node or Pillow/Python)
3. Upload batches here (claude.ai) to draft metadata entries if needed
4. Claude Code adds metadata objects to paintings array

**Context management in Claude Code:**
- Start each session by referencing this file: "Read DECISIONS.md for project context"
- Use `/clear` between unrelated tasks to avoid context bloat
- Use Plan mode for any non-trivial changes

---

## Future Considerations (not building yet)

- CMS: Sanity + Astro when/if Lynn needs to self-manage content
- Ecommerce: Stripe + React island component, or Snipcart (works with static HTML)
- Commission flow: multi-step React form
- Gallery filtering: client-side filter by series/medium/year
- Auth: private preview gallery for collectors (Clerk or Auth.js)
- Hosting upgrade: Cloudflare Pages (trivial migration from GitHub Pages)
- Image CDN: Cloudflare Polish (paid) if image count grows significantly
