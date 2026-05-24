# Content data (`src/data`)

All user-facing copy for the report lives under this folder. Page components
import from here — they should not hold marketing text inline.

## Where to edit each slide

| Slide (route) | File(s) | Notes |
|---------------|---------|-------|
| Cover (`#cover`) | [`static-pages/cover.json`](static-pages/cover.json) | Title, intro, stats, customize CTA |
| Navigation (`#navigation`) | [`static-pages/navigationToc.js`](static-pages/navigationToc.js) | TOC labels and descriptions |
| Foreword (`#foreword`) | [`static-pages/foreword.json`](static-pages/foreword.json) | Letter body, byline, video labels |
| By the Numbers (`#by-the-numbers`) | [`dynamic-pages/by-the-numbers/stats.json`](dynamic-pages/by-the-numbers/stats.json) | Use `getByTheNumbers(filterId)` — do not import JSON in page components |
| Short Takes (`#short-takes`) | [`dynamic-pages/short-takes/`](dynamic-pages/short-takes/) | Use `getShortTakes(filterId)` |
| Vision (`#vision`) | [`static-pages/vision.json`](static-pages/vision.json) | Letter body, takeaways, byline |
| Growth (`#growth`) | [`static-pages/growth.json`](static-pages/growth.json) | Four tabs, charts, CTAs |
| Insider Insights (`#insider-insights`) | [`static-pages/insider-insights.json`](static-pages/insider-insights.json) | Stories list |
| Filter UI | [`filters.json`](filters.json) | Partner/segment/region labels + modal chrome (`ui`) |
| Partner carousel (By the Numbers) | [`static-pages/partner-carousel.json`](static-pages/partner-carousel.json) | Partner names (images wired in `partnerSlides.js`) |

**Filter definitions:** [`filters.json`](filters.json) — canonical `filterIds` (17 variants).

**Resolvers:** [`dynamicContent.js`](dynamicContent.js) — `getByTheNumbers`, `getShortTakes` (fallback to `global`).

## Folder layout

- **`static-pages/`** — Global copy that does not change with filters. One file per page where possible. See [`static-pages/README.md`](static-pages/README.md).
- **`dynamic-pages/`** — Filter-dependent sections (library + `byFilterId`). See [`dynamic-pages/README.md`](dynamic-pages/README.md).

## Preview changes

```bash
npm run dev
```

Then open the site and navigate to the slide you changed.

## HubSpot CMS handoff (documentation)

This app is built as a React bundle, not native HubSpot modules. For CMS
editing after handoff:

1. HubSpot team creates a **custom template/module** and loads the built assets.
2. Map each JSON field to a HubSpot field (text, rich text, or repeater for
   arrays like `body[]`, `quotes[]`, `stats[]`).
3. At page render, HubL injects field values into a global object, e.g.
   `window.__ECOSYSTEMS_CONTENT__`, using the **same JSON shapes** as in this repo.
4. React reads those values instead of (or merged with) bundled JSON imports.

No duplicate copy should remain in JSX at handoff — everything editable should
trace back to a field in `src/data` (or the CMS mirror of it).
