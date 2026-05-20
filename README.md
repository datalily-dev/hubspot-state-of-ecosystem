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
| 2 | Navigation | Static | Table of contents |
| 3 | Foreword | Static | Letter from Zack Kass, OpenAI |
| 4 | By the Numbers | Dynamic | 17 filter variants, JSON-driven |
| 5 | Short Takes | Dynamic | 17 filter variants, Experts + Partners tabs |
| 6 | Vision | Global | Angie O'Dowd on the ecosystem |
| 7 | Growth | Global | 4 strategic areas |
| 8 | Insider Insights | Global | Partner case studies + video |

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

### Updating Dynamic Page Content (Pages 4 & 5)

Dynamic content lives in `src/data/dynamic-pages/` and is resolved through
`src/data/dynamicContent.js` (`getByTheNumbers(filterId)`, `getShortTakes(filterId)`).
Each section uses a shared "library + byFilterId" shape so every unit is
written once and referenced from any of the 17 filter variants. Unknown
`filterId`s fall back to the `global` variant.

See [`src/data/dynamic-pages/README.md`](src/data/dynamic-pages/README.md)
for the data model, conventions, and how to add or edit content.

### Updating Static Page Content

Global page content (Navigation, Growth, Insider Insights) lives in
`src/data/static-pages/` (`navigationToc.js`, `growth.json`,
`insider-insights.json`). Cover / Foreword / Vision body copy is currently
in JSX — it ships into HubSpot CMS downstream where it becomes editable.

### Changing Colors or Typography

Edit `src/styles/tokens.css`. All colors and typography values are CSS custom properties — changes propagate everywhere automatically.

---