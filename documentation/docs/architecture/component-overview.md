---
sidebar_position: 2
---

# Component Overview

## Component tree

```
app/page.tsx
└── Dashboard
    ├── Globe3D                    (full-screen background)
    ├── MetricTabs                 (top-left overlay)
    ├── DraggableCardContainer     (bottom-right overlay, shown when a country is selected)
    │   ├── DraggableCardBody
    │   │   └── CountryProfile
    │   └── [Magnet snap button]
    └── RadarChart                 (bottom-left overlay, shown once ≥1 country clicked)
```

## Responsibility summary

| Component | File | Responsibility |
|-----------|------|----------------|
| `Dashboard` | `components/Dashboard.tsx` | Owns all shared state; composes all other components into the full-page layout |
| `Globe3D` | `components/Globe3D.tsx` | Renders the WebGL globe, handles texture loading, country click events, and audio |
| `MetricTabs` | `components/MetricTabs.tsx` | Metric switcher UI with colour-scale legend cards |
| `CountryProfile` | `components/CountryProfile.tsx` | Displays the profile image for the selected country; handles loading/error states |
| `RadarChart` | `components/RadarChart.tsx` | Multi-metric spider chart comparing up to two countries |
| `LoadingScreen` | `components/LoadingScreen.tsx` | Full-screen loading overlay shown while globe assets initialise |
| `DraggableCardContainer` / `DraggableCardBody` | `components/ui/draggable-card.tsx` | Draggable wrapper used by the country profile panel |

## Data flow diagram

```
User clicks country on globe
        │
        ▼
Globe3D.onPolygonClick(countryName)
        │
        ▼
Dashboard.handleCountryClick(countryName)
  ├─ setSelectedCountry(countryName)       → opens CountryProfile panel
  └─ setCompareCountries([prev[1], name])  → updates RadarChart

User clicks a MetricTab
        │
        ▼
MetricTabs.onMetricChange(metric)
        │
        ▼
Dashboard.setSelectedMetric(metric)
        │
        ▼
Globe3D receives new metric prop → checks texture → swaps globeImageUrl
```

## Overlay positioning

All UI panels are absolutely positioned over the full-screen globe:

| Panel | Position | z-index |
|-------|----------|---------|
| `Globe3D` | `absolute inset-0` (fills viewport) | base |
| `MetricTabs` | `absolute top-4 left-4` | 50 |
| `RadarChart` | `absolute bottom-4 left-4` | 50 |
| `CountryProfile` + snap button | `absolute bottom-4 right-4` | 50 |
