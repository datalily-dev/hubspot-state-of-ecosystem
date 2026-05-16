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
Level 2 — Segment:        SMB | Upmarket       (Solutions only)
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
│   │   ├── PageShell/        # Wraps every page (consistent structure)
│   │   └── ScrollManager/    # Per-page scroll behavior (advance vs in-page)
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
│   └── FilterContext.jsx     # App-wide filter state + URL sync
├── hooks/
│   ├── useFilterState.js     # Two-stage filter state (pending → confirmed)
│   ├── useUrlState.js        # URL hash ↔ filter state sync
│   └── useScrollBehavior.js  # Throttled scroll handler per page
├── data/
│   ├── filters.json          # All valid filter definitions + IDs
│   ├── static-pages/         # Content for pages 2 & 3
│   └── dynamic-pages/        # Per-filter JSON for pages 4 & 5
├── styles/
│   ├── tokens.css            # Design tokens (colors, spacing, type, etc.)
│   └── global.css            # Reset + global styles (imports tokens)
└── utils/
    └── url.js                # URL hash parsing, building, and filter ID derivation
```

---

## Content Editing Guide

### Updating Dynamic Page Content (Pages 4 & 5)

Dynamic content lives in `src/data/dynamic-pages/`. One JSON file per filter combination.

**File naming:** `{filterId}.json`

All valid filter IDs:

```
global
technology
solutions
solutions-smb
solutions-upmarket
solutions-nam  /  solutions-emea  /  solutions-japac  /  solutions-latam
solutions-smb-nam  /  solutions-smb-emea  / ...  (8 combinations)
solutions-upmarket-nam  /  ...  (4 combinations)
```

**Data model:**

```json
{
  "id": "solutions-smb-nam",
  "label": "Solutions Partner / SMB / NAM",
  "byTheNumbers": {
    "headline": "The HubSpot ecosystem at a glance",
    "stats": [
      {
        "value": "$42B",
        "label": "market opportunity at a 21.8% CAGR",
        "source": "IDC",
        "url": "https://..."
      }
    ]
  },
  "shortTakes": {
    "experts": [
      { "name": "Jane Doe", "title": "CEO, Acme", "quote": "..." }
    ],
    "partners": [
      { "name": "John Smith", "company": "Beta Co", "quote": "..." }
    ]
  }
}
```

**To add a new filter combination:** create the JSON file and register the ID in `src/data/filters.json`.

### Updating Static Page Content (Pages 2 & 3)

Static content will live in `src/data/static-pages/` once those pages are built out.

### Changing Colors or Typography

Edit `src/styles/tokens.css`. All colors and typography values are CSS custom properties — changes propagate everywhere automatically.

---

## Delivery Notes

- **Accessibility:** WCAG 2.1 AA, 0 AXE issues (mobile + desktop)
- **Performance:** Lighthouse 85+ (mobile baseline)
- **SEO:** Lighthouse 90+
- **Browser support:** Chrome, Firefox, Safari, Edge (latest)
- **No console errors/warnings** in production
- **Localization-ready:** no hardcoded strings
