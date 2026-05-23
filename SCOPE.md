# Tiny Wins

## One-liner
A minimal daily wins journal with a full-width year grid and a quiet list view — log what you conquered, see it accumulate over time.

## The idea
A personal daily wins log for marking small, honest progress without the aspirational habit-tracker vibe. Text-first and reflective: one centered prompt, category-tagged entries, and two ways to look back (chronological list or a 7-column year grid). Quiet aesthetic — Space Grotesk, light gray canvas, pixel logo — built mobile-first for a phone-sized viewport.

## Who's it for
Me first; friends can try it via a shared link (each person’s data stays on their own device until/unless cloud sync is added later).

## Core features (v2)

### Logging (pen icon)
- **Logo** — `tiny-wins-logo.png` centered at top
- **Input** — borderless centered textarea; placeholder **“what did you conquer today?”** (hidden while focused; brief **“logged ✓”** after save)
- **Submit flow** — press **Enter** → bottom sheet to **pick a category** → win saved to `localStorage`
- **Categories (fixed)** — creative, work, life, health, learning, relationships (color-coded pills)

### Logged (history icon)
- **No logo** on this screen
- **View switcher** — single floating icon toggles **list** ↔ **grid**
- **List view** — wins grouped **year → month**; each entry shows category tag + text
- **Grid view (“2k26”)** — last **365 days** as a **7-column** square grid, full width minus **20px** side padding; cell size = `(width − 40px) ÷ 7`; no gaps between cells; logged days filled by category color
- **Day overlay** — tap any cell → overlay on the grid with that day’s win(s), or “no wins logged”; tap outside to dismiss

### Navigation & layout
- **Bottom floating toggle** — sliding pill control: **pen** (log) / **history** (logged); no footer bar background
- **Viewport** — 375px max-width, mobile-first; `public/preview.html` phone-frame preview for dev

## Out of scope for v2
- Backend, accounts, or cross-device sync
- Settings or custom categories
- Data export, sharing, or social feed
- Analytics dashboard
- Category illustrations (grid uses solid category colors only)

## Tech approach
- **Stack** — React 18 + Vite (`projects/tiny-wins/`)
- **Persistence** — `localStorage` key `tiny-wins:v2` (one-time read/migrate from legacy `small-wins-log:v2`)
- **Hosting** — static deploy (e.g. Vercel/Netlify); no server required for friends to use the link
- **Assets** — `public/assets/tiny-wins-logo.png`; Space Grotesk via Google Fonts

## Design reference
- Figma: homepage empty / active / typing states; minimal log-first UI
- Tokens: background `#f5f6f8`, text `#0e0e0e`, placeholder `#adadad`, toggle active `#243f7a`

## Version history

One row per major version. Use **ISO dates** (`YYYY-MM-DD`).

| Date | Version | What changed |
|------|---------|--------------|
| 2026-05-23 | **v2** | Figma design pass + logged UX: Space Grotesk UI, logo, centered log input (“what did you conquer today?”), Enter → category sheet, floating pen/history nav, list/grid logged views, **2k26** 7-column year grid with day overlay, icon toggles; `SCOPE.md` synced |
| — | **v1** | Prototype: log flow, GitHub-style 365-day dot grid, year → month list; React + Vite + `localStorage` (`tiny-wins:v2`) |

## Status
- [x] Idea
- [x] Scoped
- [x] In progress
- [ ] Shipped (friends beta — post-v2 deploy)
