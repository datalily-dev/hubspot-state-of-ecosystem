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

> **Binary assets are not in JSON.** Video files, poster images, audio
> clips, and headshots are `import`-ed at the top of each page component
> so Vite can fingerprint and bundle them. JSON only carries data the UI
> needs (labels, durations, alt text). See
> [the top-level README](../../../README.md#adding-media-images-video-audio)
> for the full media-wiring guide; the relevant component file for each
> page is listed in the table above.

Filter modal labels live in [`../filters.json`](../filters.json) under `ui`.

---

## How to edit

> The dev server (`npm run dev`) hot-reloads JSON edits — save and your
> change appears immediately. `navigationToc.js` reloads on save too.

**Adding a new copy line (text only):** open the file from the table
above, find the array/field you want to extend, add your line. Example —
adding a new takeaway to Vision (`vision.json`):

```diff
  "takeaways": [
    { "title": "Trust", "body": "..." },
+   { "title": "Speed", "body": "Partners who move first win the segment." },
    { "title": "Context", "body": "..." }
  ]
```

No component changes are needed for text-only edits.

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

- `id` — unique, kebab-case, stable (used as React key, and used to look
  up the avatar + audio file in `InsiderInsights.jsx`)
- `tags` — single string, pipe-separated for visual chips
- `audio.durationSeconds` — required; drives the idle pill label
- `audio.src` — unused in this codebase; the actual `.m4a` file is wired
  in `InsiderInsights.jsx` via the `AUDIO` map keyed by `story.id`.
  Leave the JSON field as `null`.

**Adding a story** (full example, including media):

1. Append a new object to `stories[]` with a fresh kebab-case `id`
   (e.g. `"valantic-acme"`).
2. Add the headshot at `src/assets/insider-insights/<name>.webp` (320×320).
3. Add the audio clip at `src/assets/audio/<filename>.m4a`.
4. Open `src/components/pages/InsiderInsights/InsiderInsights.jsx` and:
   - Add an `import` for the avatar; add a key in `AVATARS` matching the
     story `id`.
   - Add an `import` for the audio; add a key in `AUDIO` matching the
     story `id`.

If you only have copy (no audio yet), skip steps 3 and the `AUDIO` entry —
the player will render its disabled idle state automatically.

To reorder stories: rearrange `stories[]`.

### Partner carousel — `partner-carousel.json`

- `slides[]` — `{ "id", "name" }` in display order

**Adding a partner slide:**

1. Add `{ "id": "<id>", "name": "<Brand Name>" }` to `slides[]`.
2. Drop the WebP into `src/assets/by-the-numbers/<id>-slide.webp`
   (480×530, q=82 — see the asset-size table in the top-level README).
3. In `src/components/pages/ByTheNumbers/partnerSlides.js`, add an `import`
   for the new WebP and a key in `SLIDE_SRC_BY_ID` matching the slide `id`.
