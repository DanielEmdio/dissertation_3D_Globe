# Globe-App Implementation Guide

A comprehensive technical guide for understanding the **Global Seismic Risk Visualization** web application. This document is designed for developers with limited experience in TypeScript or Three.js.

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Concepts](#core-concepts)
5. [Component Breakdown](#component-breakdown)
6. [Utility Functions](#utility-functions)
7. [Data Flow](#data-flow)
8. [How Three.js and react-globe.gl Work Together](#how-threejs-and-react-globegl-work-together)
9. [Key TypeScript Concepts Used](#key-typescript-concepts-used)
10. [React Patterns Explained](#react-patterns-explained)
11. [Performance Optimization: Texture Mode](#performance-optimization-texture-mode)

---

## Overview

This application displays an interactive 3D globe showing global seismic (earthquake) risk data. Users can:
- **Rotate and zoom** the globe
- **See hexagonal markers** colored by risk level (white = low risk, red = high risk)
- **Click on countries** to view detailed seismic risk profiles

The globe automatically rotates and displays country boundaries. When you click a country, a panel appears showing that country's seismic risk profile image.

---

## Technology Stack

### Main Technologies

| Technology | Purpose | Why It's Used |
|------------|---------|---------------|
| **Next.js 16** | React framework | Handles routing, server-side rendering, and builds |
| **React 19** | UI library | Component-based interface building |
| **TypeScript 5** | Programming language | Adds type safety to JavaScript |
| **Three.js** | 3D graphics | Renders the 3D globe using WebGL |
| **react-globe.gl** | Globe component | Wraps Three.js in an easy-to-use React component |
| **Tailwind CSS 4** | Styling | Utility-first CSS for rapid styling |

### What Each Does

**Next.js** is like a "super-powered" React. It handles:
- Converting your code into a website
- Optimizing images and fonts
- Creating the development server

**Three.js** is a JavaScript library that makes 3D graphics possible in web browsers. It uses **WebGL** (a browser API for GPU-accelerated graphics).

**react-globe.gl** is a library that provides a pre-built globe component. Without it, you'd need hundreds of lines of Three.js code to create a globe.

---

## Project Structure

```
globe-app/
├── app/                      # Next.js App Router (pages)
│   ├── layout.tsx           # Root HTML structure
│   ├── page.tsx             # Main page (entry point)
│   ├── globals.css          # Global styles
│   └── favicon.ico          # Browser tab icon
│
├── components/              # React components
│   ├── Globe3D.tsx         # The 3D globe visualization
│   ├── Dashboard.tsx       # Layout manager (globe + profile panel)
│   └── CountryProfile.tsx  # Country detail panel
│
├── utils/                   # Helper functions
│   ├── colorMapping.ts     # Converts risk values to colors
│   └── countryMapping.ts   # Maps country names to image paths
│
├── public/                  # Static files (served directly)
│   ├── data/
│   │   ├── seismic-risk.geojson         # Original data (50MB)
│   │   └── seismic-risk-optimized.json  # Compressed data (7MB)
│   └── country-profiles/    # 192 country profile images
│
├── scripts/
│   └── optimize-data.js     # Data compression script
│
└── Configuration files...
```

---

## Core Concepts

### What is a Component?

A **component** is a reusable piece of UI. Think of it like a LEGO brick — you can combine multiple components to build your application.

```tsx
// A simple component
function Greeting() {
  return <h1>Hello, World!</h1>;
}
```

### What is State?

**State** is data that can change over time. When state changes, React automatically updates the UI.

```tsx
const [count, setCount] = useState(0);
// count = current value (starts at 0)
// setCount = function to update the value
```

### What is a Hook?

**Hooks** are special React functions that let you "hook into" React features. Common hooks:

| Hook | Purpose |
|------|---------|
| `useState` | Store and update data |
| `useEffect` | Run code when component loads or data changes |
| `useRef` | Keep a reference to something (like a DOM element) |
| `useCallback` | Optimize functions to prevent unnecessary re-creation |

---

## Component Breakdown

### 1. `app/page.tsx` — The Entry Point

This is where the application starts. It loads the seismic data and passes it to the Dashboard.

```tsx
'use client';  // Tells Next.js this runs in the browser, not the server

import { useEffect, useState } from 'react';
import Dashboard from "@/components/Dashboard";

// TypeScript Interface: Defines the shape of our data
interface HexagonData {
  lat: number;      // Latitude (e.g., 40.7128)
  lng: number;      // Longitude (e.g., -74.0060)
  losses: number;   // Estimated economic losses
  fatalities?: number;  // ? means optional
  buildings?: number;
}

export default function Home() {
  // State to store the loaded data (starts as empty array)
  const [hexagonData, setHexagonData] = useState<HexagonData[]>([]);

  // State to track if we're still loading
  const [isLoading, setIsLoading] = useState(true);

  // useEffect runs ONCE when the component first appears
  useEffect(() => {
    // Fetch the data file from the public folder
    fetch('/data/seismic-risk-optimized.json')
      .then(res => res.json())         // Parse JSON response
      .then((data: HexagonData[]) => {
        setHexagonData(data);          // Store the data
        setIsLoading(false);           // Done loading
      })
      .catch(err => {
        console.error('Error:', err);
        setIsLoading(false);
      });
  }, []);  // Empty array = run only once

  // Show loading screen while data loads
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading seismic risk data...</div>
      </div>
    );
  }

  // Once loaded, render the Dashboard with the data
  return <Dashboard hexagonData={hexagonData} />;
}
```

**Key Concepts:**
- `'use client'` — Required because we use browser-only features (fetch, useState)
- `useEffect` with empty `[]` — Runs once when component mounts
- `fetch()` — Browser API to load data from a URL
- Conditional rendering — Shows loading screen OR dashboard

---

### 2. `components/Dashboard.tsx` — Layout Orchestrator

The Dashboard manages the overall layout: full-screen globe with an overlay panel.

```tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import Globe3D from './Globe3D';
import CountryProfile from './CountryProfile';

interface DashboardProps {
  hexagonData?: HexagonData[];  // Data passed from page.tsx
}

export default function Dashboard({ hexagonData = [] }: DashboardProps) {
  // Track which country is currently selected (null = none)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Track the size of the profile panel
  const [panelSize, setPanelSize] = useState({ width: 400, height: 500 });

  // useRef: Keep track of values without triggering re-renders
  const isResizing = useRef(false);

  // Called when user clicks a country on the globe
  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  // Called when user closes the profile panel
  const handleCloseProfile = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Globe fills the entire screen (background) */}
      <div className="absolute inset-0">
        <Globe3D
          onCountryClick={handleCountryClick}
          hexagonData={hexagonData}
        />
      </div>

      {/* Profile panel only shows when a country is selected */}
      {selectedCountry && (
        <div
          className="absolute top-4 right-4 bg-white rounded-lg shadow-xl"
          style={{ width: panelSize.width, height: panelSize.height }}
        >
          <CountryProfile
            countryName={selectedCountry}
            onClose={handleCloseProfile}
          />
        </div>
      )}
    </div>
  );
}
```

**Key Concepts:**
- **Props** (`hexagonData`) — Data passed from parent to child
- **Conditional rendering** (`{selectedCountry && ...}`) — Only renders if condition is true
- **Callback functions** — Functions passed to children to handle events
- **CSS positioning** — `absolute` + `inset-0` makes globe fill the screen

---

### 3. `components/Globe3D.tsx` — The 3D Globe

This is the most complex component. It renders the interactive 3D globe using Three.js.

```tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getHexColorForLosses } from '@/utils/colorMapping';

// IMPORTANT: Dynamic import with ssr: false
// Three.js requires the browser's window object, which doesn't exist
// on the server. This tells Next.js to only load this on the client.
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
  hexagonData?: HexagonData[];
}

export default function Globe3D({ onCountryClick, hexagonData = [] }: Globe3DProps) {
  // useRef to access the globe's internal methods
  const globeEl = useRef<any>(null);

  // Store country boundary data (for click detection)
  const [countriesData, setCountriesData] = useState<CountryFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hexagon resolution (lower = faster, higher = more detailed)
  const [hexResolution, setHexResolution] = useState(2);

  // Load country boundaries when component mounts
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountriesData(data.features);
        setIsLoading(false);
      });
  }, []);

  // Called when the globe finishes loading
  const handleGlobeReady = useCallback(() => {
    if (globeEl.current) {
      // Access Three.js controls through the globe reference
      const controls = globeEl.current.controls();
      controls.autoRotate = true;       // Enable rotation
      controls.autoRotateSpeed = 0.5;   // Rotation speed
    }
  }, []);

  // Handle country polygon clicks
  const handlePolygonClick = (polygon: object) => {
    const feature = polygon as CountryFeature;
    if (feature?.properties?.NAME) {
      onCountryClick?.(feature.properties.NAME);
    }
  };

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeEl}

        // Earth texture (image wrapped around the sphere)
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"

        // Background stars
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        // Called when globe is ready
        onGlobeReady={handleGlobeReady}

        // === COUNTRY POLYGONS (for click detection) ===
        polygonsData={countriesData}
        polygonCapColor={() => 'rgba(0, 0, 0, 0)'}      // Transparent fill
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}     // Transparent sides
        polygonStrokeColor={() => 'rgba(100, 100, 100, 0.3)'}  // Subtle borders
        onPolygonClick={handlePolygonClick}

        // === HEXAGON LAYER (seismic risk visualization) ===
        hexBinPointsData={hexagonData}
        hexBinPointLat={(d) => d.lat}
        hexBinPointLng={(d) => d.lng}
        hexBinPointWeight={(d) => d.losses}
        hexBinResolution={hexResolution}
        hexMargin={0.2}
        hexAltitude={0.001}

        // Color based on total losses in each hexagon
        hexTopColor={(d) => getHexColorForLosses(d.sumWeight)}
        hexSideColor={(d) => getHexColorForLosses(d.sumWeight) + '80'}
      />
    </div>
  );
}
```

**Key Concepts:**

1. **Dynamic Import** (`dynamic(() => import(...), { ssr: false })`):
   - Three.js needs browser APIs (`window`, `document`)
   - Server-Side Rendering (SSR) runs on Node.js (no browser APIs)
   - `ssr: false` prevents the component from loading on the server

2. **Globe Props Explained:**

   | Prop | Type | Purpose |
   |------|------|---------|
   | `globeImageUrl` | string | Earth texture image |
   | `polygonsData` | array | Country boundary GeoJSON features |
   | `hexBinPointsData` | array | Data points to aggregate into hexagons |
   | `hexBinResolution` | number | Hexagon size (1-5, higher = smaller hexagons) |
   | `hexTopColor` | function | Returns color for each hexagon's top |

3. **Hexagon Binning:**
   - Data points (lat/lng) are grouped into hexagonal cells
   - `hexBinPointWeight` defines the value to sum per hexagon
   - `sumWeight` in the color function is the total of all points in that hexagon

---

### 4. `components/CountryProfile.tsx` — Detail Panel

Displays the selected country's seismic risk profile image.

```tsx
'use client';

import { useState } from 'react';
import { getCountryProfilePath } from '@/utils/countryMapping';

interface CountryProfileProps {
  countryName: string | null;
  onClose?: () => void;
}

export default function CountryProfile({ countryName, onClose }: CountryProfileProps) {
  // Track which country had an image loading error
  const [errorCountry, setErrorCountry] = useState<string | null>(null);

  // Check if the error is for the current country
  const imageError = errorCountry === countryName;

  // If no country selected, show placeholder
  if (!countryName) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Click on a country to view its profile</p>
      </div>
    );
  }

  // Get the image path using our utility function
  const profilePath = getCountryProfilePath(countryName);

  return (
    <div className="flex flex-col h-full">
      {/* Header with country name and close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">{countryName}</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Image content */}
      <div className="flex-1 overflow-auto p-4">
        {imageError ? (
          <p>Profile not found for {countryName}</p>
        ) : (
          <img
            src={profilePath}
            alt={`${countryName} Seismic Risk Profile`}
            onError={() => setErrorCountry(countryName)}
          />
        )}
      </div>
    </div>
  );
}
```

**Key Concepts:**
- **Error Handling** — `onError` callback catches failed image loads
- **Conditional UI** — Different content based on state
- **Flexbox Layout** — `flex flex-col` creates vertical layout

---

## Utility Functions

### `utils/colorMapping.ts` — Risk Level Colors

Converts seismic loss values into colors using a gradient scale from QGIS.

```tsx
// Define the structure of a risk level
export interface RiskLevel {
  min: number;    // Minimum loss value
  max: number;    // Maximum loss value
  color: string;  // RGB color string
  label: string;  // Human-readable label
}

// Color scale: low risk (white) to high risk (red)
export const riskColorScale: RiskLevel[] = [
  { min: 1000, max: 5000, color: 'rgb(240,248,255)', label: '1k - 5k' },
  { min: 5000, max: 10000, color: 'rgb(250,252,243)', label: '5k - 10k' },
  // ... more levels ...
  { min: 10000000, max: Infinity, color: 'rgb(255,69,0)', label: '10M+' },
];

// Main function: get color for a loss value
export function getColorForLosses(losses: number): string {
  // Very low risk = white
  if (losses < 1000) {
    return 'rgb(255,255,255)';
  }

  // Find the matching level
  for (const level of riskColorScale) {
    if (losses >= level.min && losses < level.max) {
      return level.color;
    }
  }

  // Above scale = highest risk color
  return riskColorScale[riskColorScale.length - 1].color;
}

// Convert RGB to Hex (required by react-globe.gl)
export function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return '#000000';

  const [, r, g, b] = match;
  return '#' + [r, g, b]
    .map(x => parseInt(x).toString(16).padStart(2, '0'))
    .join('');
}

// Convenience function: loss value → hex color
export function getHexColorForLosses(losses: number): string {
  return rgbToHex(getColorForLosses(losses));
}
```

**How the Color Logic Works:**

```
Loss Value → Check against scale → Return matching color

Example: losses = 75000
1. Is 75000 >= 1000 and < 5000? No
2. Is 75000 >= 5000 and < 10000? No
3. Is 75000 >= 50000 and < 100000? YES! → Return 'rgb(244,237,30)' (yellow)
```

---

### `utils/countryMapping.ts` — Country Name Handling

Maps country names to profile image file paths.

```tsx
// Normalize country names for filenames
export function normalizeCountryName(countryName: string): string {
  // "United States" → "United_States"
  let normalized = countryName.replace(/\s+/g, '_');

  // Handle special cases
  const specialCases: Record<string, string> = {
    'United_States_of_America': 'United_States',
    'USA': 'United_States',
    'UK': 'United_Kingdom',
    // ... more mappings ...
  };

  return specialCases[normalized] || normalized;
}

// Get the full path to a country's profile image
export function getCountryProfilePath(countryName: string): string {
  const normalized = normalizeCountryName(countryName);
  return `/country-profiles/country_profile_${normalized}.png`;
}
```

**Example:**
```
Input: "United States of America"
→ Normalize: "United_States_of_America"
→ Special case: "United_States"
→ Output: "/country-profiles/country_profile_United_States.png"
```

---

## Data Flow

Here's how data moves through the application:

```
┌─────────────────────────────────────────────────────────────────┐
│                        STARTUP                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ page.tsx                                                         │
│ ───────                                                          │
│ 1. Component mounts (appears on screen)                          │
│ 2. useEffect runs → fetch('/data/seismic-risk-optimized.json')  │
│ 3. Parse JSON → HexagonData[]                                    │
│ 4. setHexagonData(data) → triggers re-render                     │
│ 5. Render <Dashboard hexagonData={data} />                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard.tsx                                                    │
│ ─────────────                                                    │
│ 1. Receives hexagonData as prop                                  │
│ 2. Creates state: selectedCountry, panelSize                     │
│ 3. Renders Globe3D with data and click handler                   │
│ 4. Conditionally renders CountryProfile                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌───────────────────────┐    ┌───────────────────────┐
│ Globe3D.tsx           │    │ CountryProfile.tsx    │
│ ───────────           │    │ ──────────────────    │
│ - Loads country       │    │ - Receives country    │
│   boundaries (GeoJSON)│    │   name as prop        │
│ - Renders hexagons    │    │ - Maps to image path  │
│   from hexagonData    │    │ - Displays profile    │
│ - Handles clicks      │    │   image               │
│ - Calls onCountryClick│    └───────────────────────┘
└───────────────────────┘
```

### User Interaction Flow

```
User clicks Portugal on globe
        │
        ▼
Globe3D.handlePolygonClick({ properties: { NAME: "Portugal" }})
        │
        ▼
onCountryClick("Portugal")  // Callback to Dashboard
        │
        ▼
Dashboard.setSelectedCountry("Portugal")  // State update
        │
        ▼
React re-renders Dashboard
        │
        ▼
selectedCountry is now "Portugal", so CountryProfile renders
        │
        ▼
CountryProfile receives "Portugal"
        │
        ▼
getCountryProfilePath("Portugal") → "/country-profiles/country_profile_Portugal.png"
        │
        ▼
<img src="/country-profiles/country_profile_Portugal.png" /> displays
```

---

## How Three.js and react-globe.gl Work Together

### Three.js Basics

Three.js creates 3D graphics using three main concepts:

1. **Scene** — A container for all 3D objects
2. **Camera** — The viewpoint (what you see)
3. **Renderer** — Draws the scene to the screen

```
┌─────────────────────────────────────────┐
│                 Scene                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Globe  │  │ Hexagons│  │ Polygons│ │
│  │ (Sphere)│  │ (Meshes)│  │ (Meshes)│ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
                    │
                    ▼
              ┌─────────┐
              │ Camera  │ ← User controls (rotate, zoom)
              └─────────┘
                    │
                    ▼
              ┌─────────┐
              │Renderer │ → Canvas (what you see)
              └─────────┘
```

### What react-globe.gl Does

Instead of writing all the Three.js code yourself, react-globe.gl provides a declarative React component:

**Without react-globe.gl (pure Three.js):**
```javascript
// ~200+ lines of code to:
// - Create scene, camera, renderer
// - Create sphere geometry
// - Apply earth texture
// - Add lighting
// - Handle mouse interactions
// - Create hexagon meshes
// - Handle window resize
// ... etc
```

**With react-globe.gl:**
```jsx
<Globe
  globeImageUrl="earth-texture.jpg"
  hexBinPointsData={data}
  hexBinPointLat={(d) => d.lat}
  hexBinPointLng={(d) => d.lng}
/>
```

The library handles all the complex Three.js setup internally.

### The ref and controls()

```tsx
const globeEl = useRef<any>(null);

// Later, after globe is ready:
const controls = globeEl.current.controls();
controls.autoRotate = true;
```

- `useRef` creates a persistent reference
- `globeEl.current` gives access to the Globe component's instance
- `.controls()` returns the Three.js OrbitControls, which handle camera movement

---

## Key TypeScript Concepts Used

### Interfaces

Interfaces define the "shape" of objects:

```tsx
interface HexagonData {
  lat: number;
  lng: number;
  losses: number;
  fatalities?: number;  // ? = optional
}

// Now TypeScript knows exactly what a HexagonData object looks like
const point: HexagonData = {
  lat: 40.7128,
  lng: -74.006,
  losses: 50000
  // fatalities is optional, so we can omit it
};
```

### Generics

Generics let you create reusable types:

```tsx
// useState with a generic type
const [count, setCount] = useState<number>(0);
const [data, setData] = useState<HexagonData[]>([]);
const [name, setName] = useState<string | null>(null);
```

### Type Assertions

Sometimes you know more about a type than TypeScript does:

```tsx
const handleClick = (polygon: object) => {
  // We know this object is actually a CountryFeature
  const feature = polygon as CountryFeature;
  console.log(feature.properties.NAME);
};
```

### Record Type

Creates an object type with specific key/value types:

```tsx
const specialCases: Record<string, string> = {
  'USA': 'United_States',
  'UK': 'United_Kingdom'
};
// Keys must be strings, values must be strings
```

---

## React Patterns Explained

### 1. Conditional Rendering

Show different content based on conditions:

```tsx
// Pattern 1: && operator (show if true)
{selectedCountry && <CountryProfile />}

// Pattern 2: Ternary operator (if/else)
{isLoading ? <Loading /> : <Content />}

// Pattern 3: Early return
if (isLoading) {
  return <Loading />;
}
return <Content />;
```

### 2. Lifting State Up

When multiple components need the same state, put it in their shared parent:

```
     Dashboard (owns selectedCountry state)
        │
   ┌────┴────┐
   ▼         ▼
Globe3D   CountryProfile
(sets)      (reads)
```

### 3. Callback Props

Pass functions to children so they can communicate with parents:

```tsx
// Parent
const handleClick = (name: string) => setSelected(name);
<Child onCountryClick={handleClick} />

// Child
props.onCountryClick("France");  // Calls parent's function
```

### 4. Optional Chaining

Safely access properties that might not exist:

```tsx
// Without optional chaining (verbose)
if (feature && feature.properties && feature.properties.NAME) {
  console.log(feature.properties.NAME);
}

// With optional chaining (clean)
console.log(feature?.properties?.NAME);  // undefined if any part is null/undefined

// With callback
onCountryClick?.(countryName);  // Only calls if function exists
```

---

## Performance Optimization: Texture Mode

The Globe3D component supports two visualization modes for the seismic risk data:

### Hexagon Mode (Original)

```
JSON data (7MB) → Browser computes hexagons → Renders thousands of 3D meshes
                  (CPU intensive)              (many draw calls)
```

- **Pros**: Dynamic, can show tooltips on hover
- **Cons**: Slower loading, lower resolution limited by performance

### Texture Mode (Optimized)

```
Pre-rendered image → Browser loads texture → Single texture on globe sphere
(2-5MB PNG)          (fast)                  (1 draw call)
```

- **Pros**: Much faster, higher visual quality, lower CPU usage
- **Cons**: Static visualization (no hover interactivity on risk layer)

### How to Use Texture Mode

The component defaults to texture mode. To use it:

1. **Create the texture in QGIS** (see instructions below)
2. **Save the image** to `public/textures/seismic-risk-map.png`
3. **The app automatically uses it** if the file exists

If the texture file is not found, the component falls back to hexagon mode.

### Switching Modes Manually

```tsx
// Use texture mode (default)
<Globe3D visualizationMode="texture" />

// Force hexagon mode
<Globe3D visualizationMode="hexagons" hexagonData={data} />
```

### Creating the Texture in QGIS

#### Step 1: Set Up the Project

1. Open your seismic risk GeoJSON in QGIS
2. Set the project CRS to **EPSG:4326** (WGS 84)
3. Apply your color styling (graduated colors based on `losses` field)

#### Step 2: Configure the Export

1. Go to **Project → Import/Export → Export Map to Image**
2. Set the extent to full world coverage:
   - West: `-180`
   - East: `180`
   - South: `-90`
   - North: `90`

#### Step 3: Choose Resolution

| Quality | Dimensions | File Size | Recommended For |
|---------|------------|-----------|-----------------|
| Low | 2048 × 1024 | ~500KB | Mobile devices |
| Medium | 4096 × 2048 | ~2MB | Most use cases |
| High | 8192 × 4096 | ~8MB | High-DPI displays |

**Important**: Height must be exactly half of width for correct globe mapping.

#### Step 4: Export Settings

- **Format**: PNG (supports transparency) or JPG (smaller)
- **Background**: Transparent or ocean blue (`#1a1a2e`)
- **Save to**: `public/textures/seismic-risk-map.png`

### Why This Works

Globe textures use **equirectangular projection** — the same format as world maps that appear "stretched" at the poles. When wrapped around a sphere, they display correctly.

```
Flat texture (equirectangular):
┌──────────────────────────────────────┐
│  ▀▀▀▀▀▀▀▀▀ (poles stretched)        │
│    ┌───┐                             │
│    │   │ (continents)                │
│    └───┘                             │
│  ▄▄▄▄▄▄▄▄▄                           │
└──────────────────────────────────────┘

Wrapped on sphere:
        ___
      /     \
     |  ┌─┐  |  (looks correct!)
     |  └─┘  |
      \ ___ /
```

---

## Summary

The globe-app is a modern React application that visualizes seismic risk data on an interactive 3D globe. The key architectural decisions are:

1. **Component Separation** — Each component has one job
2. **State Management** — Uses React's built-in `useState` (no external library needed)
3. **Dynamic Imports** — Prevents Three.js from breaking server-side rendering
4. **Utility Functions** — Reusable logic extracted into separate files
5. **TypeScript** — Catches errors before runtime

The data flows from JSON file → page.tsx → Dashboard → Globe3D/CountryProfile, with user interactions flowing back up through callback functions.
