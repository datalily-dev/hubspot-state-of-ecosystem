# Dynamic page content

Content for pages that change based on the active filter combination
(17 variants — see `../filters.json`).

Components do not import these files directly. They go through helpers in
`../dynamicContent.js`, which centralize fallback logic:

```js
import { getShortTakes, getByTheNumbers } from '../../data/dynamicContent';
const shortTakes = getShortTakes(filterId);
const byTheNumbers = getByTheNumbers(filterId);
```

If a `filterId` has no entry, helpers fall back to the `global` variant so
pages never crash on an unknown filter.

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
  this file is a single block, not the library/byFilterId shape.
- `partners.json` — content for the "From Partners" tab. Varies per
  filter, so it uses the `library` + `byFilterId` shape. Entries in
  `byFilterId` are either:
  - an **array of quote IDs** from `library` (the quotes to render),
    or
  - a **placeholder string** shown verbatim when copy isn't ready yet
    (e.g. `"Content coming soon — copy pending from client."`).

### `by-the-numbers/`

The section has a single grid of stats per variant, so one file is
enough:

- `stats.json` — `library` + `byFilterId`. Each `byFilterId` entry is
  an array of stat IDs, in render order. Sizes (`lg` / `md` / `sm` /
  `image`) are assigned by position in `dynamicContent.js`, not stored
  per-stat, because the same stat appears at different positions
  across variants. The image card is identified by the stat ID
  `stat-image` and only appears in the Global variant today.

## Adding or editing content

- **Edit copy for a unit that's already in the library:** open the
  relevant section file, find the entry under `library`, edit it in
  place. The change applies everywhere that unit is referenced.
- **Add a new unit:** add it to `library` with a unique kebab-case ID,
  then list that ID under any `byFilterId` variants that should show
  it.
- **Mark a variant as "copy pending" (Short Takes only):** set its
  `byFilterId` entry to a placeholder string instead of an array. By
  the Numbers does not currently use placeholders since all 17 variants
  have copy.
