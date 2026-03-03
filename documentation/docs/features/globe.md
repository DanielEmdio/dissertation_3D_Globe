---
sidebar_position: 1
---

# 3D Globe

The central element of the application is an interactive 3D globe rendered by [`react-globe.gl`](https://github.com/vasturiano/react-globe.gl), which wraps [Three.js](https://threejs.org/).

<!-- TODO: add a GIF or screenshot showing the globe with a texture and a hover tooltip -->

## Texture system

The globe surface displays a pre-rendered seismic risk map that changes depending on the active metric. The textures live in `/public/textures/`:

| File | Metric |
|------|--------|
| `seismic-risk-map-losses.png` | Losses |
| `seismic-risk-map-fatalities.png` | Fatalities |
| `seismic-risk-map-buildings.png` | Buildings |

When the metric changes, the component checks whether the corresponding texture file is reachable. If the file is found, it becomes the globe's surface image. If it is **not** found (e.g. during local development without the texture files), the globe falls back to the standard blue-marble Earth texture and logs a warning to the browser console.

## Country boundaries

A transparent polygon layer is drawn on top of the globe using GeoJSON data from `/public/data/countries_bounderies.geojson`. The polygons are invisible but:

- **Intercept clicks** — clicking within a country's polygon fires the `onCountryClick` callback, which opens the country's profile panel.
- **Show a tooltip** on hover with the country name.

The polygon borders are rendered with a subtle grey stroke (`rgba(100, 100, 100, 0.3)`) to give a faint outline of country shapes.

## Auto-rotation

Once the globe is ready, auto-rotation is enabled with a speed of `0.5`. The user can interrupt rotation by clicking and dragging; rotation resumes naturally when the drag ends (Three.js OrbitControls default behaviour).

## Audio

Two audio files are managed by the globe component:

| Audio | File | Behaviour |
|-------|------|-----------|
| Background music | `lo-fi-loop.wav` | Loops at 40% volume once the globe is ready. Respects browser autoplay policy — starts on first user interaction if autoplay is blocked. |
| Click sound | `universfield-interface-124464.mp3` | Plays at 2× speed / 80% volume each time a country is clicked. |

## Loading screen

While country GeoJSON is being fetched **and** the texture availability check is pending, a `<LoadingScreen />` overlay is shown. The globe is rendered only when both checks complete, ensuring the user never sees a partially initialised scene.

## SSR

`react-globe.gl` uses Three.js browser APIs that are not available in Node.js. The component is therefore imported with Next.js dynamic import and `ssr: false`:

```ts
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });
```
