---
sidebar_position: 2
---

# Project Structure

The repository is split into two top-level packages:

```
dissertation_3D_Globe/
├── globe-app/          # Next.js application (the interactive globe)
└── documentation/      # Docusaurus site (what you are reading now)
```

## Globe app layout

```
globe-app/
├── app/
│   ├── layout.tsx          # Root HTML layout, global font setup
│   └── page.tsx            # Entry point — renders <Dashboard />
│
├── components/
│   ├── Dashboard.tsx       # Top-level layout, owns all shared state
│   ├── Globe3D.tsx         # 3D globe, textures, click detection, audio
│   ├── CountryProfile.tsx  # Draggable country detail panel
│   ├── MetricTabs.tsx      # Metric switcher + colour-scale legend
│   ├── RadarChart.tsx      # Country comparison radar chart
│   ├── LoadingScreen.tsx   # Shown while globe assets load
│   └── ui/                 # shadcn/ui primitives (tabs, cards, loaders…)
│
├── lib/
│   └── riskData.ts         # CSV loader, metric definitions, data cache
│
├── utils/
│   └── countryMapping.ts   # Country name → profile image path mapping
│
└── public/
    ├── data/
    │   ├── countries_bounderies.geojson   # Country polygons (click detection)
    │   └── Global_Risk_Summary_Adm0.csv   # Country-level risk metrics
    ├── textures/
    │   ├── seismic-risk-map-losses.png
    │   ├── seismic-risk-map-fatalities.png
    │   └── seismic-risk-map-buildings.png
    ├── country-profiles/
    │   └── country_profile_<Name>.png     # One PNG per country
    └── sounds/
        ├── 647591__collectionofmemories__lo-fi-loop.wav   # Background music
        └── universfield-interface-124464.mp3              # Click sound effect
```

## Key file roles

### `app/page.tsx`
The single Next.js route. It simply renders `<Dashboard />` which is the root of the application component tree.

### `components/Dashboard.tsx`
Owns the three pieces of state that drive the whole UI:

| State | Type | Purpose |
|-------|------|---------|
| `selectedCountry` | `string \| null` | Country whose profile panel is open |
| `selectedMetric` | `'losses' \| 'fatalities' \| 'buildings'` | Active globe texture |
| `compareCountries` | `[string \| null, string \| null]` | Last two clicked countries for the radar chart |

### `lib/riskData.ts`
Fetches and parses `Global_Risk_Summary_Adm0.csv` once, then caches the result in module scope. Exports `getRawData()` and the `METRICS` array used by the radar chart.

### `utils/countryMapping.ts`
Translates GeoJSON country names (e.g. `"United States of America"`) to the filename convention used for profile images (e.g. `country_profile_United_States.png`). See [Country Profile Mapping](../reference/adding-a-country-profile) for the full rules.
