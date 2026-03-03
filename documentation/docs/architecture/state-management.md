---
sidebar_position: 3
---

# State Management

The app has no external state library. All state lives in `Dashboard` and is passed down via props. The state surface is intentionally small.

## State in Dashboard

```ts
// Currently open country profile
const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

// Active globe texture / metric
const [selectedMetric, setSelectedMetric] = useState<Metric>('losses');

// Last two selected countries for the radar chart
const [compareCountries, setCompareCountries] = useState<[string | null, string | null]>([null, null]);

// Profile panel dimensions (controlled by the resize handle)
const [panelSize, setPanelSize] = useState({ width: 400, height: 500 });
```

## How `compareCountries` updates

Every country click shifts the buffer:

```ts
setCompareCountries(prev => {
  // Ignore if already in the buffer
  if (prev[0] === countryName || prev[1] === countryName) return prev;
  // Shift: prev[1] moves to [0], new country goes to [1]
  return [prev[1], countryName];
});
```

This guarantees the radar chart always shows the **two most recently clicked distinct countries** without any user-facing "add to comparison" step.

## Local state in child components

Some UI state is managed locally in child components where it is not needed by anyone else:

| Component | Local state | Purpose |
|-----------|-------------|---------|
| `MetricTabs` | `activeTab`, `cardVisible` | Which tab is active; whether the legend card is shown |
| `RadarChart` | `isMinimized`, `chartData`, `c1Missing`, `c2Missing`, `colorCycle` | Chart visibility, fetched data, missing-data flags, colour rotation |
| `CountryProfile` | `errorCountry`, `isLoading` | Image load / error tracking per country |
| `Globe3D` | `countriesData`, `isLoading`, `textureAvailable` | Loaded GeoJSON features; asset readiness |

## Data fetching

There is no server or API layer. Data is fetched client-side from static files:

| Data | Where fetched | Cache strategy |
|------|---------------|----------------|
| `Global_Risk_Summary_Adm0.csv` | `lib/riskData.ts → getRawData()` | Module-level variable (`rawCache`); fetched once per browser session |
| `countries_bounderies.geojson` | `Globe3D` component `useEffect` | Stored in component state; refetched if the component unmounts and remounts |
| Country profile PNGs | `<img src=...>` in `CountryProfile` | Browser HTTP cache |
| Globe textures | `react-globe.gl` → Three.js | Browser HTTP cache |

## Refs

Two refs in `Dashboard` manage imperative operations that don't require re-renders:

| Ref | Type | Purpose |
|-----|------|---------|
| `cardRef` | `{ resetPosition: () => void }` | Exposes the draggable card's snap-back method to the magnet button |
| `isResizing` / `startPos` / `startSize` | mutable refs | Track the panel resize drag gesture without triggering renders on every mouse move |
