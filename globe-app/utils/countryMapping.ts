/**
 * Country naming hub.
 *
 * Single source of truth for translating the globe's GeoJSON country names
 * (feature.properties.NAME, Natural Earth 1:110m) into the canonical name used
 * by the GEM datasets — both the risk CSV (lib/riskData.ts) and the
 * gem/risk-profiles GitHub repo. Everything downstream (radar lookups, profile
 * image URLs) derives from this canonical name, so the two can never drift.
 *
 * The canonical name is the GEM dataset spelling (clean ASCII, e.g.
 * "Ivory Coast", "United States"), which makes it safe to turn into URL/path
 * segments by replacing spaces with underscores.
 */

/**
 * GeoJSON NAME -> canonical GEM dataset name.
 * Only the names that differ need an entry; everything else passes through.
 */
export const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'Bosnia and Herz.':         'Bosnia and Herzegovina',
  'Central African Rep.':     'Central African Republic',
  "Côte d'Ivoire":            'Ivory Coast',
  'Dem. Rep. Congo':          'Democratic Republic of the Congo',
  'Dominican Rep.':           'Dominican Republic',
  'Eq. Guinea':               'Equatorial Guinea',
  'Guinea-Bissau':            'Guinea Bissau',
  'S. Sudan':                 'South Sudan',
  'Solomon Is.':              'Solomon Islands',
  'Timor-Leste':              'Timor Leste',
  'United States of America': 'United States',
  'eSwatini':                 'Eswatini',
};

/**
 * Resolve a globe/GeoJSON country name to its canonical GEM dataset name.
 * Names without an alias are returned unchanged.
 */
export function toCanonicalCountryName(geoName: string): string {
  return COUNTRY_NAME_ALIASES[geoName] ?? geoName;
}

/**
 * Convert a name into a URL/path segment used by the GEM repos
 * (e.g. "United States" -> "United_States", "North America" -> "North_America").
 */
export function toPathSegment(name: string): string {
  return name.trim().replace(/\s+/g, '_');
}

const RISK_PROFILES_BASE =
  'https://raw.githubusercontent.com/gem/risk-profiles/refs/heads/master';

/**
 * Build the raw GitHub URL for a country's seismic risk profile image.
 *
 * Pattern: {base}/{Region}/{Country}/seismic_risk_profile_{Country}.png
 * `region` is the GEM region (CSV REGION column); `country` may be either a
 * GeoJSON name or an already-canonical name — it is normalized either way.
 */
export function buildSeismicRiskProfileUrl(region: string, country: string): string {
  const regionSeg  = toPathSegment(region);
  const countrySeg = toPathSegment(toCanonicalCountryName(country));
  return `${RISK_PROFILES_BASE}/${regionSeg}/${countrySeg}/seismic_risk_profile_${countrySeg}.png`;
}
