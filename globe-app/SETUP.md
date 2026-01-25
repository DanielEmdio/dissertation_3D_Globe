# Global Seismic Risk Visualization - Setup Guide

This is your 3D globe web application for visualizing global seismic risk data with interactive country profiles.

## Project Structure

```
globe-app/
├── app/
│   ├── page.tsx              # Main page with Dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Globe3D.tsx           # 3D globe component with hexagons
│   ├── CountryProfile.tsx    # Country profile viewer
│   └── Dashboard.tsx         # Main dashboard layout
├── utils/
│   ├── colorMapping.ts       # QML color scheme converter
│   └── countryMapping.ts     # Country name to profile mapping
├── data/                     # Put your GeoJSON files here
└── public/
    └── country-profiles/     # 192 country profile images (✓ copied)
```

## What's Working

✅ Next.js project setup with TypeScript
✅ All required dependencies installed
✅ Color mapping from your QML file
✅ 3D Globe component with react-globe.gl
✅ Country clicking functionality
✅ Country profile image viewer
✅ Dashboard layout (globe + profile panel)
✅ All 192 country profile images copied

## Next Steps - IMPORTANT!

### 1. Convert Shapefile to GeoJSON

You need to convert your shapefile to GeoJSON format. You mentioned you know how to do this. Use QGIS or ogr2ogr:

**Using QGIS:**
1. Open `Archive/Global_Seismic_Risk_GEM.shp` in QGIS
2. Right-click the layer → Export → Save Features As
3. Format: GeoJSON
4. Save as: `globe-app/data/seismic-risk.geojson`

**Using ogr2ogr (command line):**
```bash
ogr2ogr -f GeoJSON globe-app/data/seismic-risk.geojson Archive/Global_Seismic_Risk_GEM.shp
```

### 2. Load the GeoJSON Data

Once you have the GeoJSON file, update `app/page.tsx`:

```typescript
// app/page.tsx
import Dashboard from "@/components/Dashboard";
import seismicData from "@/data/seismic-risk.geojson";

export default function Home() {
  // Transform GeoJSON to hexagon data format
  const hexagonData = seismicData.features.map((feature: any) => ({
    lat: feature.properties.lat,
    lng: feature.properties.lon,
    losses: feature.properties.losses,
    fatalities: feature.properties.fatalities,
    buildings: feature.properties.buildings,
  }));

  return <Dashboard hexagonData={hexagonData} />;
}
```

Or load it dynamically:

```typescript
'use client';
import { useEffect, useState } from 'react';
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [hexagonData, setHexagonData] = useState([]);

  useEffect(() => {
    fetch('/data/seismic-risk.geojson')
      .then(res => res.json())
      .then(data => {
        const formatted = data.features.map((feature: any) => ({
          lat: feature.properties.lat,
          lng: feature.properties.lon,
          losses: feature.properties.losses,
          fatalities: feature.properties.fatalities,
          buildings: feature.properties.buildings,
        }));
        setHexagonData(formatted);
      });
  }, []);

  return <Dashboard hexagonData={hexagonData} />;
}
```

### 3. Run the Development Server

```bash
cd globe-app
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Globe Rendering**: The `Globe3D` component uses react-globe.gl to render an interactive 3D Earth
2. **Hexagon Layer**: Your seismic risk data is displayed as colored hexagons on the globe surface
3. **Color Coding**: Colors are mapped from your QML file (white → yellow → orange → red based on loss values)
4. **Country Clicking**: Invisible country boundaries are overlaid for click detection
5. **Profile Display**: When you click a country, the right panel shows its seismic risk profile image

## Data Fields Expected

Your GeoJSON should have these properties for each feature:
- `lat` - Latitude
- `lon` - Longitude
- `losses` - Seismic risk losses (used for color coding)
- `fatalities` - Optional: Number of fatalities
- `buildings` - Optional: Number of buildings affected

## Customization

### Adjust Globe Appearance
Edit `components/Globe3D.tsx`:
- Change globe texture: modify `globeImageUrl`
- Adjust hexagon size: modify `hexPolygonResolution`
- Change rotation speed: modify `autoRotateSpeed`

### Modify Colors
Edit `utils/colorMapping.ts` to adjust the risk color scale

### Change Layout
Edit `components/Dashboard.tsx` to adjust the globe/profile panel ratio

## Troubleshooting

**Issue**: Country profiles not showing
**Fix**: Check that the country name matches the filename. Use browser DevTools to see the expected path.

**Issue**: Hexagons not appearing
**Fix**: Ensure your GeoJSON data has valid `lat`, `lon`, and `losses` properties.

**Issue**: Globe not rendering
**Fix**: Make sure you're using a modern browser. Check console for WebGL errors.

## Build for Production

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## Questions?

Check the code comments in each component file for more details on how things work!
