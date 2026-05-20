# Static page content

Global (unfiltered) page content that doesn't change with the filter.
Filter-dependent content lives in [`../dynamic-pages/`](../dynamic-pages).

| File | Used by | What lives here |
|------|---------|-----------------|
| `navigationToc.js`      | `NavigationPage`      | TOC entries (label, anchor, title, description) |
| `growth.json`           | `GrowthPage`          | All four Growth tabs — copy, bullets, chart data, CTA |
| `insider-insights.json` | `InsiderInsights`     | Section heading + partner stories list |

> **Video assets are not in JSON.** The Navigation page partner-story
> video is imported directly in
> `../../components/pages/NavigationPage/NavigationPage.jsx` from
> `../../assets/foreword/`. Swap the file there to change the video.

Cover / Foreword / Vision body copy is **not** in this folder — it lives
inline in the page JSX so it can ship into HubSpot CMS downstream where
it becomes editable. To edit before hand-off, change the copy in:

- `../../components/pages/CoverPage/CoverPage.jsx`
- `../../components/pages/ForewordPage/ForewordPage.jsx`
- `../../components/pages/VisionPage/VisionPage.jsx`

---

## How to edit

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
- `cta` — optional call-to-action block (heading, body, button, image)

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
