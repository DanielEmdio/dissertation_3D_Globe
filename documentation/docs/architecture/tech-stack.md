---
sidebar_position: 1
---

# Tech Stack

## Framework — Next.js 15 (App Router)

The app is a [Next.js](https://nextjs.org/) project using the **App Router** (`app/` directory). The entire application is a **single route** (`/`) that renders the `Dashboard` component. There is no server-side API — all data is loaded client-side from static files in the `public/` directory.

Since the globe requires browser APIs (WebGL via Three.js), the key globe component is imported with:

```ts
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });
```

This prevents Next.js from trying to server-render Three.js code.

## Globe rendering — react-globe.gl + Three.js

[`react-globe.gl`](https://github.com/vasturiano/react-globe.gl) is a React wrapper around the [`globe.gl`](https://globe.gl/) library, which itself is built on [Three.js](https://threejs.org/). It handles:

- WebGL scene setup and camera controls (orbit, zoom, pan).
- Globe sphere geometry with configurable texture URLs.
- Polygon layers (used for country click detection).
- Label / tooltip rendering.

The app passes PNG texture URLs directly to `globeImageUrl`, making it straightforward to swap the displayed risk layer.

## Data visualisation — Recharts

The radar chart is built with [Recharts](https://recharts.org/), a React charting library based on SVG. Components used:

- `RadarChart`, `Radar`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis` — chart structure.
- `Tooltip` with a custom renderer — shows raw values with K/M/B/T formatting.
- `Legend` — country name labels.

## Styling — Tailwind CSS + shadcn/ui

All layout and visual styling uses [Tailwind CSS](https://tailwindcss.com/) utility classes. Component primitives (tabs, cards, loaders) come from [shadcn/ui](https://ui.shadcn.com/), which are copied into `components/ui/` and can be customised freely.

## Icons — Lucide React

[Lucide React](https://lucide.dev/) provides the icon set: `BadgeEuro`, `User`, `Building2`, `Magnet`, `Radar`, `Eye`, `EyeClosed`, `OctagonAlert`.

## TypeScript

The entire codebase is TypeScript. Key shared types are defined locally in each component file rather than in a shared types module, since the app is small and the types are not reused across many boundaries.
