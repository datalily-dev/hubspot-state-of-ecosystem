import filtersData from '../data/filters.json';

/**
 * Splits a URL hash into its slide anchor (slug) and filter query parts.
 * Format: `#<anchor>?<filterParams>` where either half may be missing.
 * Examples:
 *   "#by-the-numbers?partnerType=solutions&segment=smb"
 *     → { anchor: "by-the-numbers", query: "partnerType=solutions&segment=smb" }
 *   "#by-the-numbers" → { anchor: "by-the-numbers", query: "" }
 *   "#partnerType=solutions" → { anchor: "", query: "partnerType=solutions" } (legacy)
 *   "" → { anchor: "", query: "" }
 *
 * Legacy hashes that contain only filter params (no anchor) are still parsed
 * correctly so existing shared links keep working.
 * @param {string} hash
 * @returns {{ anchor: string, query: string }}
 */
export function splitHash(hash) {
  const raw = (hash || '').replace(/^#/, '');
  if (!raw) return { anchor: '', query: '' };
  const qIdx = raw.indexOf('?');
  if (qIdx !== -1) {
    return { anchor: raw.slice(0, qIdx), query: raw.slice(qIdx + 1) };
  }
  if (raw.includes('=')) {
    return { anchor: '', query: raw };
  }
  return { anchor: raw, query: '' };
}

/**
 * Parses a URL hash string into a structured filter object.
 * Accepts both the new `#anchor?partnerType=...` and the legacy
 * `#partnerType=...` formats.
 * @param {string} hash
 * @returns {{ partnerType: string|null, segment: string|null, region: string|null }}
 */
export function parseUrlHash(hash) {
  const { query } = splitHash(hash);
  const params = new URLSearchParams(query);
  return {
    partnerType: params.get('partnerType') || null,
    segment: params.get('segment') || null,
    region: params.get('region') || null,
  };
}

/**
 * Builds a URL hash string from a filter object, optionally preserving an
 * existing slide anchor (e.g. "by-the-numbers"). Without an anchor, falls
 * back to a filter-only hash.
 * @param {{ partnerType: string|null, segment: string|null, region: string|null }} filters
 * @param {string} [anchor]
 * @returns {string}
 */
export function buildUrlHash({ partnerType, segment, region }, anchor = '') {
  const params = new URLSearchParams();
  if (partnerType) params.set('partnerType', partnerType);
  if (segment) params.set('segment', segment);
  if (region) params.set('region', region);
  const query = params.toString();
  if (anchor && query) return `#${anchor}?${query}`;
  if (anchor) return `#${anchor}`;
  if (query) return `#${query}`;
  return '';
}

/**
 * Derives a stable content key from a filter combination.
 * Returns one of the 17 possible keys (including "global").
 * @param {{ partnerType: string|null, segment: string|null, region: string|null }} filters
 * @returns {string}
 */
export function buildFilterId({ partnerType, segment, region }) {
  if (!partnerType) return 'global';
  if (partnerType === 'technology') return 'technology';
  if (partnerType === 'solutions') {
    const parts = ['solutions'];
    if (segment) parts.push(segment);
    if (region) parts.push(region);
    return parts.join('-');
  }
  return 'global';
}

const PARTNER_LABELS = Object.fromEntries(
  filtersData.partnerTypes.map(({ id, label }) => [id, label]),
);
const SEGMENT_LABELS = Object.fromEntries(
  filtersData.segments.map(({ id, label }) => [id, label]),
);
const REGION_LABELS = Object.fromEntries(
  filtersData.regions.map(({ id, label }) => [id, label]),
);

/**
 * Builds the human-readable summary shown on the cover page after a user
 * applies filters (e.g. "Solutions Partner / Small business / EMEA").
 * Returns an empty string when no filters are applied.
 * @param {{ partnerType: string|null, segment: string|null, region: string|null }} filters
 * @returns {string}
 */
export function buildFilterSummary({ partnerType, segment, region }) {
  if (!partnerType) return '';
  const parts = [PARTNER_LABELS[partnerType]];
  if (partnerType === 'solutions') {
    if (segment) parts.push(SEGMENT_LABELS[segment]);
    if (region) parts.push(REGION_LABELS[region]);
  }
  return parts.filter(Boolean).join(' / ');
}
