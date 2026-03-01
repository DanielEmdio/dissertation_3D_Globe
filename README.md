# Global Seismic Risk — Interactive 3D Globe

An interactive web application for visualizing global seismic risk data on a 3D globe. Built as part of a side project of a Master's dissertation, it allows users to explore earthquake risk metrics by country, view detailed country risk profiles, and compare countries side-by-side.

This project was developed in colaboration with the [Global Earthquake Model Foundation (GEM)](https://www.globalquakemodel.org/who-we-are) using their seismic risk datasets. Please visit their [OpenQuake platform](https://www.globalquakemodel.org/product/openquake-engine) for more information on seismic risk modeling and data.

## Features
- **3D Interactive Globe** — auto-rotating globe with rendered seismic risk map overlays powered by `react-globe.gl` and Three.js
- **Three Risk Metrics** — switch between:
  - **Losses** — Annual Average Loss (AAL) in monetary terms (expected replacement/repair costs)
  - **Fatalities** — Seismic risk to human life
  - **Buildings** — Structural exposure (approximate number of buildings per area)
- **Country Profiles** — click any country to open a draggable card showing its detailed seismic risk profile image
- **Country Comparison** — a radar chart compares the last two selected countries across 7 risk metrics (buildings, replacement cost, population, AAL economic, AAL fatalities, AAL buildings, AAL displaced)
- **Ambient Audio** — lo-fi background music and UI click sound effects

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 / React 19 / TypeScript |
| 3D Globe | [react-globe.gl](https://github.com/vasturiano/react-globe.gl) + Three.js |
| Charts | Recharts |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |

## Project Structure

```
globe-app/
├── app/                  # Next.js app router entry
├── components/
│   ├── Dashboard.tsx     # Main layout — composes all panels
│   ├── Globe3D.tsx       # 3D globe with texture overlays and click handling
│   ├── CountryProfile.tsx# Draggable country profile card
│   ├── MetricTabs.tsx    # Risk metric switcher with color legends
│   ├── RadarChart.tsx    # Country comparison radar chart
│   └── ui/               # shadcn/ui components
├── lib/
│   └── riskData.ts       # CSV data loading and metric definitions
├── utils/
│   └── countryMapping.ts # Maps country names to profile image paths
└── public/
    ├── data/
    │   ├── Global_Risk_Summary_Adm0.csv   # Country-level seismic risk data
    │   └── countries_bounderies.geojson   # Country polygon boundaries
    ├── textures/                           # Pre-rendered risk map PNGs per metric
    ├── country-profiles/                   # Per-country seismic risk profile images
    └── sounds/                             # UI audio files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
cd globe-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. The globe loads with the **Losses** metric active and begins auto-rotating.
2. Use the **tabs in the top-left** to switch between Losses, Fatalities, and Buildings. Click the active tab again to toggle the legend card.
3. **Hover** over a country to see its name in a tooltip.
4. **Click** a country to open its seismic risk profile card (draggable, resizable). A radar chart will appear in the bottom-left comparing the last two selected countries.
5. Use the **magnet button** to snap the profile card back to its default position.
6. The **radar icon** in the bottom-left can minimize/expand the comparison chart.
