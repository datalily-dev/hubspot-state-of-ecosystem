# Dynamic page content

Content for pages that change based on the active filter combination
(17 variants — full list of filter IDs in [`../filters.json`](../filters.json)
under `filterIds`).

Components do not import these files directly. They go through helpers in
[`../dynamicContent.js`](../dynamicContent.js), which centralize fallback
logic:

```js
import { getShortTakes, getByTheNumbers } from '../../data/dynamicContent';
const shortTakes   = getShortTakes(filterId);
const byTheNumbers = getByTheNumbers(filterId);
```

If a `filterId` has no entry, helpers fall back to the `global` variant
so pages never crash on an unknown filter.

## File organization

The shared pattern is "library + byFilterId":

- `library` holds every unique content unit (a stat, a quote, etc.),
  defined once. The object key is the unit's stable ID; do **not**
  repeat the ID inside the entry — the helper injects it back.
- `byFilterId` lists, for each of the 17 filter IDs, the IDs from
  `library` to render in that variant. This lets reviewers scan all 17
  variants on one screen while every unit is written exactly once.

A section is one folder; whether that folder has one or several files
depends on how the section's sub-parts vary:

### `short-takes/`

The section has two tabs that vary independently, so it's split:

- `field.json` — content for the "From the Field" experts tab. Shared
  across all 17 filter variants (the experts tab does not change), so
  this file is a single block of `quotes`, not the library/byFilterId
  shape.
- `partners.json` — content for the "From Partners" tab. Varies per
  filter, so it uses the `library` + `byFilterId` shape. Entries in
  `byFilterId` are either:
  - an **array of quote IDs** from `library` (the quotes to render),
    or
  - a **placeholder string** shown verbatim when copy isn't ready yet
    (e.g. `"Content coming soon — copy pending from client."`).

Quote schema (both files):

```json
{
  "title":  "Customer-centric integrations drive the future of work",
  "quote":  "...",
  "author": {
    "name":     "Brendan Ittelson",
    "role":     "Chief Ecosystem Officer, Zoom",
    "linkedIn": "https://www.linkedin.com/in/bittelson/"
  },
  "audio":  { "durationSeconds": 41 }
}
```

`audio.durationSeconds` drives the idle pill label. The actual `.m4a`
file is **not** stored in JSON — it's wired in
`src/components/pages/ShortTakes/ShortTakes.jsx` via the `AUDIO` map
keyed by quote `id`. The avatar is wired the same way via the `AVATARS`
map. Quotes without an `AUDIO`/`AVATARS` entry render the player's
disabled idle state and skip the headshot — both fall back gracefully.

### `by-the-numbers/`

The section has a single grid of stats per variant, so one file is
enough:

- `stats.json` — `library` + `byFilterId`. Each `byFilterId` entry is
  an array of stat IDs in render order.

Stat schema:

```json
{
  "icon":        "target",                  // optional, key from icon set
  "value":       "$42B",
  "description": "...",
  "linkText":    "according to IDC",        // optional
  "linkHref":    "https://..."              // optional, paired with linkText
}
```

Visual sizing is **not** stored per stat — it's assigned by position
inside `dynamicContent.js#sizeForPosition`:

```
index 0   → "lg"     (top-left hero)
index 1   → "md"     (top-middle)
index 2   → "lg"     (top-right hero)
index 3+  → "sm"     (bottom row)
stat-image → "image" (special card; only on Global today)
```

Per-stat **typography** overrides (when the size class alone doesn't
produce the right value treatment) live in the `VALUE_VARIANT_BY_STAT_ID`
map at the top of `dynamicContent.js`. If you add a stat with an unusual
value length (very long, multi-line, or compact), add an entry there
mapping its ID to `'feature'`, `'feature-compact'`, `'compact'`, or
`'multiline'`.

The image card is identified by the stat ID `stat-image` and currently
appears only in the Global variant.

## Adding or editing content

> The dev server (`npm run dev`) hot-reloads JSON edits — no restart
> needed.

- **Edit copy for a unit already in the library:** open the relevant
  section file, find the entry under `library`, edit it in place. The
  change applies everywhere that unit is referenced.
- **Add a new unit:** add it to `library` with a unique kebab-case ID,
  then list that ID under any `byFilterId` variants that should show
  it. For stats, also add a `VALUE_VARIANT_BY_STAT_ID` entry in
  `dynamicContent.js` if the value needs custom typography.
- **Reorder a variant:** rearrange the IDs in that variant's
  `byFilterId` array. For By the Numbers, remember the order also
  drives sizing (positions 0/2 are hero cards).
- **Mark a variant as "copy pending" (Short Takes only):** set its
  `byFilterId` entry to a placeholder string instead of an array. By
  the Numbers does not currently use placeholders since all 17 variants
  have copy.

### Worked example — adding a new partner quote

Say HubSpot wants to add a new quote from "Jane Doe" of Acme Co to the
`solutions-emea` variant of Short Takes, with a headshot and audio clip.

1. **Drop the assets:**
   - Headshot: `src/assets/short-takes/jane-doe.webp` (320×320, q=85).
   - Audio: `src/assets/audio/Acme - Solutions Partner - EMEA.m4a`.
2. **Add the library entry** in `short-takes/partners.json`:

   ```json
   "library": {
     "jane-doe-acme": {
       "title": "Why EMEA partners win with HubSpot",
       "quote": "...",
       "author": {
         "name": "Jane Doe",
         "role": "VP Partnerships, Acme",
         "linkedIn": "https://www.linkedin.com/in/janedoe/"
       },
       "audio": { "durationSeconds": 42 }
     }
   }
   ```

3. **Reference the ID** in the variant(s) that should show it:

   ```diff
     "byFilterId": {
   -   "solutions-emea": ["camiel-freriks-strategic", "patrick-ganzmann-scalable", "ross-breckenridge-transformed", "daryl-michel-influence"],
   +   "solutions-emea": ["camiel-freriks-strategic", "patrick-ganzmann-scalable", "jane-doe-acme", "ross-breckenridge-transformed", "daryl-michel-influence"],
     }
   ```

4. **Wire the avatar + audio** in
   `src/components/pages/ShortTakes/ShortTakes.jsx`:

   ```diff
   + import janeDoe from '../../../assets/short-takes/jane-doe.webp';
   + import janeDoeAudio from '../../../assets/audio/Acme - Solutions Partner - EMEA.m4a';
     // …
     const AVATARS = {
       // …
   +   'jane-doe-acme': janeDoe,
     };
     const AUDIO = {
       // …
   +   'jane-doe-acme': janeDoeAudio,
     };
   ```

If you skip step 4, the page still renders — the quote appears with no
headshot and a disabled audio pill (intentional fallback).

### Worked example — adding a new stat

To add a stat to the Global By the Numbers grid:

1. Add the entry to `by-the-numbers/stats.json` under `library`:

   ```json
   "library": {
     "stat-50pct-agentic": {
       "value": "50%",
       "description": "of partners are piloting agentic workflows, ",
       "linkText": "per HubSpot research",
       "linkHref": "https://example.com/agentic"
     }
   }
   ```

2. Add the ID to the relevant `byFilterId` arrays (order = sizing —
   index 0/2 = `lg` hero, 1 = `md`, 3+ = `sm`):

   ```diff
   - "global": ["stat-42b", "stat-cagr", "stat-top10", "stat-300k", "stat-119b-services"],
   + "global": ["stat-42b", "stat-cagr", "stat-top10", "stat-300k", "stat-50pct-agentic", "stat-119b-services"],
   ```

3. If the value renders too large/small at its assigned size, add a
   `VALUE_VARIANT_BY_STAT_ID` entry in `dynamicContent.js`:

   ```diff
     const VALUE_VARIANT_BY_STAT_ID = {
       // …
   +   'stat-50pct-agentic': 'feature-compact',
     };
   ```

## Where else content can change

Some content for these pages is **not** in JSON:

- Section labels and the static "Short Takes" / "By the Numbers"
  headings come from `library`-level fields and constants in
  `dynamicContent.js` (e.g. `SHORT_TAKES_LABEL`).
- Filter IDs and labels themselves live in [`../filters.json`](../filters.json).
  Adding a new filter combination requires adding it there *and*
  giving it a `byFilterId` entry in every dynamic file.
