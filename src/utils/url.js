/**
 * Parses a URL hash string into a structured filter object.
 * @param {string} hash - e.g. "#partnerType=solutions&segment=smb&region=nam"
 * @returns {{ partnerType: string|null, segment: string|null, region: string|null }}
 */
export function parseUrlHash(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return {
    partnerType: params.get('partnerType') || null,
    segment: params.get('segment') || null,
    region: params.get('region') || null,
  };
}

/**
 * Builds a URL hash string from a filter object.
 * @param {{ partnerType: string|null, segment: string|null, region: string|null }} filters
 * @returns {string} e.g. "#partnerType=solutions&segment=smb"
 */
export function buildUrlHash({ partnerType, segment, region }) {
  const params = new URLSearchParams();
  if (partnerType) params.set('partnerType', partnerType);
  if (segment) params.set('segment', segment);
  if (region) params.set('region', region);
  const str = params.toString();
  return str ? `#${str}` : '';
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

const PARTNER_LABELS = {
  technology: 'Technology partner',
  solutions: 'Solutions partner',
};
const SEGMENT_LABELS = { smb: 'SMB', upmarket: 'Upmarket' };
const REGION_LABELS = { nam: 'NAM', emea: 'EMEA', japac: 'JAPAC', latam: 'LATAM' };

/**
 * Builds the human-readable summary shown on the cover page after a user
 * applies filters (e.g. "Solutions partner / SMB / EMEA").
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
