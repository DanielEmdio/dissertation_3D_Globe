export const METRICS = [
  { key: 'EXP_BUILDINGS',       label: 'Total number of buildings'  },
  { key: 'EXP_COST_TOTAL',      label: 'Total replacement cost' },
  { key: 'EXP_OCCUPANTS_TOTAL', label: 'Population' },
  { key: 'AAL_TOTAL',           label: 'AAL Economic'    },
  { key: 'AAL_FATALITIES',      label: 'AAL Fatalities'  },
  { key: 'AAL_BUILDINGS',       label: 'AAL Buildings'   },
  { key: 'AAL_PEOPLE_DISPLACED',label: 'AAL Displaced'   },
] as const;

export type MetricKey = typeof METRICS[number]['key'];
export type RawCountryData    = Record<MetricKey, number | null>;
// export type NormalizedCountryData = Record<MetricKey, number>; // 0–100

let rawCache:        Map<string, RawCountryData>        | null = null;
// let normalizedCache: Map<string, NormalizedCountryData> | null = null;

export async function getRawData(): Promise<Map<string, RawCountryData>> {
  return loadRaw();
}

async function loadRaw(): Promise<Map<string, RawCountryData>> {
  if (rawCache) return rawCache;

  const res  = await fetch('/data/Global_Risk_Summary_Adm0.csv');
  const text = await res.text();
  const lines   = text.trim().split('\n');
  const headers = lines[0].split(',');

  const map = new Map<string, RawCountryData>();

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
  }

  rawCache = map;
  return map;
}

// function logNormalize(allValues: (number | null)[], value: number | null): number {
//   if (value === null || value <= 0) return 0;

//   const valid = allValues.filter((v): v is number => v !== null && v > 0);
//   if (valid.length === 0) return 0;

//   const logs  = valid.map(v => Math.log10(v));
//   const min   = Math.min(...logs);
//   const max   = Math.max(...logs);
//   const logV  = Math.log10(value);

//   if (max === min) return 50;
//   return Math.round(((logV - min) / (max - min)) * 100);
// }

// export async function getNormalizedData(): Promise<Map<string, NormalizedCountryData>> {
//   if (normalizedCache) return normalizedCache;

//   const raw      = await loadRaw();
//   const allRows  = Array.from(raw.values());
//   const result   = new Map<string, NormalizedCountryData>();

//   for (const [name, data] of raw.entries()) {
//     const norm = {} as NormalizedCountryData;
//     for (const m of METRICS) {
//       const allVals = allRows.map(r => r[m.key]);
//       norm[m.key] = logNormalize(allVals, data[m.key]);
//     }
//     result.set(name, norm);
//   }

//   normalizedCache = result;
//   return result;
// }
