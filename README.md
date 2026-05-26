# HubSpot — The State of Ecosystems

A multi-page scrolling web experience for HubSpot's "State of Ecosystems" partner report.

## Getting Started

**Requirements:** Node.js ≥ 20.17.0

```bash
npm install
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview the production build
npm run lint      # ESLint
npm run lint:css  # Stylelint
```

## Architecture

### Page Structure (8 pages)

| # | Page | Type | Notes |
|---|------|------|-------|
| 1 | Cover | Static | Landing + filter modal trigger |
| 2 | Navigation | Static | Table of contents + partner-story video |
| 3 | Foreword | Static | Letter from Zack Kass, OpenAI |
| 4 | By the Numbers | Dynamic | 17 filter variants, JSON-driven |
| 5 | Short Takes | Dynamic | 17 filter variants, Experts + Partners tabs |
| 6 | Vision | Global | Angie O'Dowd on the ecosystem |
| 7 | Growth | Global | 4 strategic areas |
| 8 | Insider Insights | Global | Partner case studies |

### Filter System

The filter is hierarchical (not flat):

```
Level 1 — Partner Type:   Technology | Solutions
Level 2 — Segment:        Small business | Mid-market  (Solutions only)
Level 3 — Region:         NAM | EMEA | JAPAC | LATAM  (Solutions only)
```

This creates **17 unique content combinations** (including "Global / nothing selected"). The active combination is stored in the URL hash, making every view shareable:

```
https://example.com/#partnerType=solutions&segment=smb&region=nam
```

### Folder Structure

```
src/
├── components/
│   ├── common/
│   │   ├── PageShell/        # Page layout wrapper (title region, min-height, etc.)
│   │   ├── SlideDeck/        # Horizontal deck; hash anchors ↔ slide index
│   │   ├── TopNav/           # Persistent header
│   │   ├── PageNav/          # Per-page prev/next + dot pager
│   │   ├── Tabs/             # Reusable tab bar (Short Takes, Growth)
│   │   ├── Dropdown/         # Reusable dropdown (Growth area picker)
│   │   ├── AudioPlayer/      # Quote audio player (Short Takes, Insider)
│   │   └── VideoHero/        # Shared video poster + player (Foreword, Vision, Insider)
│   ├── pages/                # One component per page
│   │   ├── CoverPage/
│   │   ├── NavigationPage/
│   │   ├── ForewordPage/
│   │   ├── ByTheNumbers/
│   │   ├── ShortTakes/
│   │   ├── VisionPage/
│   │   ├── GrowthPage/
│   │   └── InsiderInsights/
│   └── filters/
│       ├── FilterModal/      # Hierarchical filter selection overlay
│       └── FilterChip/       # Individual filter toggle chip
├── context/
│   ├── FilterContext.jsx     # App-wide filter state + URL sync
│   ├── SlideDeckContext.jsx  # Active slide index + theme hints for chrome
│   └── PageIdContext.jsx     # Stable per-page id for nav highlighting
├── hooks/
│   ├── useFilterState.js     # Two-stage filter state (pending → confirmed)
│   ├── useUrlState.js        # URL hash ↔ filter state sync
│   └── useEntranceAnimation.js  # IntersectionObserver-driven enter animations
├── data/
│   ├── filters.json          # All valid filter definitions + IDs
│   ├── dynamicContent.js     # Helpers that resolve filterId → page content
│   ├── static-pages/         # Global (unfiltered) page content
│   └── dynamic-pages/        # Per-filter content for pages 4 & 5
├── styles/
│   ├── tokens.css            # Design tokens (colors, spacing, type, etc.)
│   ├── fonts.css             # @font-face declarations
│   └── global.css            # Reset + global styles (imports tokens)
└── utils/
    └── url.js                # URL hash parsing, building, and filter ID derivation
```

---

## Content Editing Guide

**Start here:** [`src/data/README.md`](src/data/README.md) — maps every slide to its data file(s).

### Updating Dynamic Page Content (Pages 4 & 5)

Dynamic content lives in `src/data/dynamic-pages/` and is resolved through
`src/data/dynamicContent.js` (`getByTheNumbers(filterId)`, `getShortTakes(filterId)`).
Each section uses a shared "library + byFilterId" shape so every unit is
written once and referenced from any of the 17 filter variants. Unknown
`filterId`s fall back to the `global` variant.

See [`src/data/dynamic-pages/README.md`](src/data/dynamic-pages/README.md)
for the data model, conventions, and how to add or edit content.

### Updating Static Page Content

Global (unfiltered) page content lives in `src/data/static-pages/`:

| File | Edits |
|------|-------|
| `cover.json`           | Cover title, intro, stats, customize CTA |
| `navigationToc.js`     | Table-of-contents entries on the Navigation page |
| `foreword.json`        | Foreword letter, byline, video labels |
| `vision.json`          | Vision letter, takeaways, byline, video labels |
| `growth.json`          | All four Growth tabs (eyebrow, body, bullets, chart, CTA) |
| `insider-insights.json`| Section heading and partner stories |
| `partner-carousel.json`| Partner names on the By the Numbers carousel |
| `filters.json` (`ui`)  | Filter modal title, row labels, Apply/Close |

See [`src/data/static-pages/README.md`](src/data/static-pages/README.md)
for per-file schemas.

### Changing Colors or Typography

Edit `src/styles/tokens.css`. All colors and typography values are CSS custom properties — changes propagate everywhere automatically.

---

## Adding Media (Images, Video, Audio)

Most copy lives in JSON, but **binary assets are imported in component files** so
Vite can fingerprint and bundle them. The pattern is always the same:

1. Drop the file into the right `src/assets/<page>/` folder.
2. `import` it in the page component (or its small wiring file).
3. Reference it via an `id`-keyed map (or directly, for one-off assets).

### Audio (`.m4a`)

Audio is **not** stored in JSON. The JSON entry only declares the duration; the
actual file is mapped to a quote/story `id` in the page component.

1. Add the file to `src/assets/audio/`.
2. Open the corresponding page component:
   - **Short Takes quotes:** `src/components/pages/ShortTakes/ShortTakes.jsx`
   - **Insider Insights stories:** `src/components/pages/InsiderInsights/InsiderInsights.jsx`
3. Add an `import` for the new file and a new key in the `AUDIO` map keyed by
   the quote/story `id`.
4. In the JSON entry, keep `audio.durationSeconds` accurate (drives the pill
   label). `audio.src` in JSON is unused once the component-level map has an
   entry — leave it absent or `null`.

If a quote/story has no entry in the component's `AUDIO` map, the player
renders its disabled idle state — safe by design.

### Video (`.mp4`) and poster (`.jpg`)

Each page that has a video imports both the poster image and the `.mp4`
directly. There is no JSON entry for video files.

| Page | File to edit |
|------|--------------|
| Foreword | `src/components/pages/ForewordPage/ForewordPage.jsx` |
| Vision | `src/components/pages/VisionPage/VisionPage.jsx` |
| Navigation (partner-story video) | `src/components/pages/NavigationPage/NavigationPage.jsx` |

Drop the new file into `src/assets/foreword/` or `src/assets/vision/`, then
update the `import` line at the top of the page component. Labels (`Watch
video`, region label, etc.) live in the page's JSON — see the static-pages
README for fields.

### Images

- **Headshots/avatars (Short Takes, Insider Insights):** drop a 320×320 WebP
  into `src/assets/short-takes/` or `src/assets/insider-insights/`, import it
  in the page component, and add a key to the `AVATARS` map (keyed by quote
  or story `id`).
- **Partner carousel slides (By the Numbers):** drop a 480×530 WebP into
  `src/assets/by-the-numbers/`, then add it in
  `src/components/pages/ByTheNumbers/partnerSlides.js` (import + add to
  `SLIDE_SRC_BY_ID` keyed by slide `id`). Add the matching `{ id, name }` to
  `src/data/static-pages/partner-carousel.json`.
- **Growth CTA photos:** drop a 496×284 JPG into `src/assets/growth/` and
  update the `import` in `src/components/pages/GrowthPage/GrowthPage.jsx`.

Source images should be sized at roughly **2× their displayed dimensions**
(retina) and re-encoded before committing. Rough targets:

| Asset | Displayed @ 1440 | Save at |
|---|---|---|
| `by-the-numbers/*-slide.webp` | ~210 × 232 | 480 × 530, WebP q=82 |
| `growth/cta-photo.jpg` | 248 × 169 | 496 × 284, JPEG q=82 progressive |
| `foreword/video.jpg` (poster) | ~712 wide | 1280 × 853, JPEG q=82 |
| `vision/video.jpg` (poster) | ~1080 wide | 1280 × 720, JPEG q=82 |
| Headshots (`short-takes/*`, `insider-insights/*`) | 160 × 160 | 320 × 320, WebP q=85 |

Below-the-fold `<img>` tags should use `loading="lazy" decoding="async"`.

### Adding a new copy line

Anything text-only is JSON-only — no component edits needed. Example: adding a
new bullet to a Growth tab:

```diff
  "bullets": [
    "AI-ready integrations across the stack",
+   "Verified partner directory updates monthly",
    "Co-marketing and co-sell motions"
  ]
```

Save, the dev server hot-reloads, done. See the static-pages and dynamic-pages
READMEs for per-file schemas.

---
