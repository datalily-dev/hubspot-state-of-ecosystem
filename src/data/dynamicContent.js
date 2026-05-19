import fieldData from './dynamic-pages/short-takes/field.json';
import partnersData from './dynamic-pages/short-takes/partners.json';
import statsData from './dynamic-pages/by-the-numbers/stats.json';

const SHORT_TAKES_LABEL = 'Short Takes';

/**
 * Resolves a list of quote IDs against the partners library, injecting `id`
 * from the library key. Silently drops unknown IDs so a typo in one variant
 * can't crash the page.
 */
function resolvePartnerQuotes(quoteIds) {
  return quoteIds
    .map((id) => {
      const entry = partnersData.library[id];
      return entry ? { id, ...entry } : null;
    })
    .filter(Boolean);
}

/**
 * Returns the Short Takes content for a given filter ID, in the shape the
 * `<ShortTakes />` component expects:
 *
 *   {
 *     label: string,
 *     tabs: {
 *       field:    { heading, quotes },
 *       partners: { heading, quotes }   // OR { heading, placeholder }
 *     }
 *   }
 *
 * The "From the Field" (experts) tab is shared across all 17 variants. The
 * "From Partners" tab varies per filter — entries in `partners.byFilterId`
 * are either an array of quote IDs (resolved against `partners.library`) or
 * a placeholder string shown verbatim when copy isn't ready yet.
 *
 * Falls back to the `global` partners variant if `filterId` is unknown.
 *
 * @param {string} filterId one of the 17 filter IDs from `data/filters.json`
 */
export function getShortTakes(filterId) {
  const variant =
    partnersData.byFilterId[filterId] ?? partnersData.byFilterId.global;

  const partnersPanel = { heading: partnersData.heading };
  if (Array.isArray(variant)) {
    partnersPanel.quotes = resolvePartnerQuotes(variant);
  } else {
    partnersPanel.placeholder = variant;
  }

  return {
    label: SHORT_TAKES_LABEL,
    tabs: {
      field: {
        label: fieldData.tabLabel,
        heading: fieldData.heading,
        quotes: fieldData.quotes,
      },
      partners: {
        label: partnersData.tabLabel,
        ...partnersPanel,
      },
    },
  };
}

/**
 * Size assignment is positional, not content-driven, because the same stat
 * (e.g. `stat-42b`) appears in different grid positions across variants and
 * therefore needs different visual weights. The image card is the lone
 * exception — it's identified by its `image` size and rendered differently.
 *
 *   index 0     → "lg"     (top-left hero)
 *   index 1     → "md"     (top-middle, centered)
 *   index 2     → "lg"     (top-right hero)
 *   index 3+    → "sm"     (bottom row)
 *   stat-image  → "image"  (special card; only on Global today)
 */
function sizeForPosition(id, index) {
  if (id === 'stat-image') return 'image';
  if (index === 1) return 'md';
  if (index < 3) return 'lg';
  return 'sm';
}

/** Figma 2405:2913 — per-stat value typography when size class alone isn't enough. */
const VALUE_VARIANT_BY_STAT_ID = {
  'stat-300k': 'feature',
  'stat-119b-services': 'feature-compact',
  'stat-30b-isv': 'feature-compact',
  'stat-309b-smb': 'feature-compact',
  'stat-86b-emea-smb': 'feature-compact',
  'stat-5b-japac-smb': 'feature-compact',
  'stat-24b-latam-smb': 'feature-compact',
  'stat-139b-nam-smb': 'feature-compact',
  'stat-196b-nam': 'feature-compact',
  'stat-122b-emea': 'feature-compact',
  'stat-71b-japac': 'feature-compact',
  'stat-35b-latam': 'feature-compact',
  'stat-11b-mid': 'feature-compact',
  'stat-10k-500k-spend': 'compact',
  'stat-1-12-months': 'multiline',
};

function resolveStats(statIds) {
  return statIds
    .map((id, index) => {
      const entry = statsData.library[id];
      if (!entry) return null;
      const valueVariant = VALUE_VARIANT_BY_STAT_ID[id];
      return {
        id,
        size: sizeForPosition(id, index),
        ...(valueVariant ? { valueVariant } : {}),
        ...entry,
      };
    })
    .filter(Boolean);
}

/**
 * Returns the By the Numbers content for a given filter ID, in the shape the
 * `<ByTheNumbers />` component expects:
 *
 *   {
 *     label:   string,
 *     heading: string,
 *     stats:   Array<{ id, size, value, description, icon?, linkText?, linkHref? }>
 *   }
 *
 * Falls back to the `global` variant if `filterId` is unknown so the page
 * never crashes on an unrecognized filter.
 *
 * @param {string} filterId one of the 17 filter IDs from `data/filters.json`
 */
export function getByTheNumbers(filterId) {
  const ids = statsData.byFilterId[filterId] ?? statsData.byFilterId.global;
  return {
    label: statsData.label,
    heading: statsData.heading,
    stats: resolveStats(ids),
  };
}
