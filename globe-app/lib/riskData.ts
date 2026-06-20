import {
  COUNTRY_NAME_ALIASES,
  toCanonicalCountryName,
  buildSeismicRiskProfileUrl,
} from '@/utils/countryMapping';

export const METRICS = [
  { key: 'EXP_BUILDINGS',       label: 'Total number of buildings'  },
  { key: 'EXP_COST_TOTAL',      label: 'Total replacement cost' },
  { key: 'EXP_OCCUPANTS_TOTAL', label: 'Population' },
  { key: 'AAL_TOTAL',           label: 'AAL Economic'    },
  { key: 'AAL_FATALITIES',      label: 'AAL Fatalities'  },
  { key: 'AAL_BUILDINGS',       label: 'AAL Buildings'   },
  { key: 'AAL_PEOPLE_DISPLACED',label: 'AAL Displaced'   },
  { key: 'AAL_EMBODIED_CARBON', label: 'AAL Embodied Carbon' },
] as const;

export type MetricKey = typeof METRICS[number]['key'];
export type RawCountryData    = Record<MetricKey, number | null>;
// export type NormalizedCountryData = Record<MetricKey, number>; // 0–100

let rawCache:    Map<string, RawCountryData> | null = null;
// region keyed by canonical GEM name (CSV REGION column)
let regionCache: Map<string, string>         | null = null;

export async function getRawData(): Promise<Map<string, RawCountryData>> {
  return loadRaw();
}

/** GEM region for a country, looked up by GeoJSON or canonical name. */
export async function getCountryRegion(name: string): Promise<string | null> {
  await loadRaw();
  return regionCache!.get(toCanonicalCountryName(name)) ?? null;
}

/**
 * Raw GitHub URL of a country's seismic risk profile image, or null if the
 * country has no entry in the dataset (so no region to build the path from).
 */
export async function getSeismicRiskProfileUrl(name: string): Promise<string | null> {
  const region = await getCountryRegion(name);
  return region ? buildSeismicRiskProfileUrl(region, name) : null;
}

async function loadRaw(): Promise<Map<string, RawCountryData>> {
  if (rawCache) return rawCache;

  const res  = await fetch('/data/grm_radar_adm0.csv');
  const text = await res.text();
  const lines   = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  const regionIdx = headers.indexOf('REGION');

  const map     = new Map<string, RawCountryData>();
  const regions = new Map<string, string>();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const name = cols[1]?.trim();
    if (!name) continue;

    const entry = {} as RawCountryData;
    for (const m of METRICS) {
      const idx = headers.indexOf(m.key);
      const raw = cols[idx]?.trim();
      entry[m.key] = raw ? parseFloat(raw) : null;
    }
    map.set(name, entry);

    const region = cols[regionIdx]?.trim();
    if (region) regions.set(name, region);
  }

  // Register GeoJSON-name aliases so the globe's country names resolve.
  for (const [geoName, dataName] of Object.entries(COUNTRY_NAME_ALIASES)) {
    const entry = map.get(dataName);
    if (entry) map.set(geoName, entry);
  }

  regionCache = regions;

  rawCache = map;
  return map;
}


