# Static page content

Global (unfiltered) page content that doesn't change with the filter.
Filter-dependent content lives in [`../dynamic-pages/`](../dynamic-pages).

See [`../README.md`](../README.md) for the full slide-to-file index.

| File | Used by | What lives here |
|------|---------|-----------------|
| `cover.json`            | `CoverPage`           | Title, intro, stats, customize CTA |
| `navigationToc.js`      | `NavigationPage`      | TOC entries (label, anchor, title, description) |
| `foreword.json`         | `ForewordPage`        | Letter body, byline, video labels |
| `vision.json`           | `VisionPage`          | Letter body, takeaways, byline, video labels |
| `growth.json`           | `GrowthPage`          | All four Growth tabs — copy, bullets, chart data, CTA |
| `insider-insights.json` | `InsiderInsights`     | Section heading + partner stories list |
| `partner-carousel.json` | `ByTheNumbers` carousel | Partner slide names (`partnerSlides.js` wires images) |

> **Video assets are not in JSON.** The Navigation page partner-story
> video is imported directly in
> `../../components/pages/NavigationPage/NavigationPage.jsx` from
> `../../assets/foreword/`. Swap the file there to change the video.
> Foreword and Vision poster/video files stay as imports in their page
> components.

Filter modal labels live in [`../filters.json`](../filters.json) under `ui`.

---

## How to edit

### Cover — `cover.json`

- `reportLabel`, `headline`, `intro`, `customizeCta`
- `stats[]` — each stat: optional `prefix`, `prefixKind` (`symbol` | `word`),
  `number`, optional `suffix`, `label`, optional `linkText` / `linkHref`
  (paired; rendered after `label`)

### Foreword — `foreword.json`

- `eyebrow`, `headline`
- `bodyBeforeVideo` / `bodyAfterVideo` — arrays of plain strings or
  `{ "segments": [{ "text": "..." }, { "text": "...", "href": "..." }] }`
  for paragraphs with inline links
- `video.regionLabel`, `video.playLabel`
- `author` — `name`, `role`, `linkedIn`, `linkedInAriaLabel`, `avatarAlt`

### Vision — `vision.json`

- `eyebrow`, `headline`, `subhead`
- `body[]` — intro paragraphs (strings)
- `takeaways[]` — `{ "title", "body" }` (title renders in `<strong>`); optional
  `linkText` / `linkHref` / `titleSuffix` for an inline link mid-title (e.g.
  “Guided by ” + link + “:”)
- `bodyAfterTakeaways[]` — closing paragraphs
- `video` and `author` — same shape as foreword

### Navigation TOC — `navigationToc.js`

Each entry maps to one row in the Navigation page menu. Update copy in
place, or add/remove rows:

```js
{
  label: 'Growth',
  href:  '#growth',          // must match a SlideDeck anchor
  title: 'Four strategic growth areas',
  description: 'Mid-market momentum, AI transformation, and more.',
}
```

`href` must match an anchor declared on a SlideDeck slide elsewhere in
the app — don't invent new anchors here without wiring them into the
target page.

### Growth tabs — `growth.json`

The top-level `tabs` array is rendered in order. Each tab has:

- `id`, `tabLabel` — picker label and stable id
- `eyebrow`, `heading`, `body[]` — copy (`body` is an array of paragraphs)
- `bullets[]` — bullet list shown beside the body
- `chart` — optional inline chart (see existing tabs for the schema:
  `data.years`, `data.totals`, `data.series`, plus `source` /
  `sourceLinkText` / `sourceHref` for attribution)
- `cta` — optional call-to-action block; every CTA with a link must set
  `linkText`

To add a fifth Growth tab, append a new object to `tabs` with the same
shape. The Tabs component picks them up automatically.

### Insider Insights — `insider-insights.json`

Top-level fields:

- `label`, `heading` — section eyebrow + title
- `stories[]` — array of case studies, rendered in the order given

(The partner-story video previously lived here. It now sits on the
Navigation page and is imported as an asset in `NavigationPage.jsx` —
see the callout at the top of this file.)

Each story:

```json
{
  "id": "siloy-twelve",
  "headline": "...",
  "body": "...",
  "tags": "SaaS | Global",
  "author": {
    "name": "Camiel Freriks",
    "role": "VP Strategic Alliances, Siloy",
    "linkedIn": "https://www.linkedin.com/in/camielfreriks/"
  },
  "audio": { "src": null, "durationSeconds": 38 }
}
```

- `id` — unique, kebab-case, stable (used as React key)
- `tags` — single string, pipe-separated for visual chips
- `audio.src` — leave `null` until the audio file is ready;
  `AudioPlayer` shows the disabled idle state in that case
- `audio.durationSeconds` — required even when `src` is `null`, so the
  idle pill shows the correct length

To add a story: append a new object to `stories[]` with a fresh `id`.
To reorder: rearrange the array.

### Partner carousel — `partner-carousel.json`

- `slides[]` — `{ "id", "name" }` in display order
- Image paths are mapped in `../../components/pages/ByTheNumbers/partnerSlides.js`
  by `id` — add a WebP import there when adding a new partner slide
