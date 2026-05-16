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
