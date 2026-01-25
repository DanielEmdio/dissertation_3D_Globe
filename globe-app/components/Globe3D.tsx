'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getHexColorForLosses } from '@/utils/colorMapping';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface HexagonData {
  lat: number;
  lng: number;
  losses: number;
  fatalities?: number;
  buildings?: number;
}

interface CountryFeature {
  type: string;
  properties: {
    NAME: string;
    [key: string]: unknown;
  };
  geometry: unknown;
}

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
  hexagonData?: HexagonData[];
}

// Zoom thresholds for resolution changes
const ZOOM_THRESHOLD = 0.5; // Altitude below which we use high resolution

export default function Globe3D({ onCountryClick, hexagonData = [] }: Globe3DProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [countriesData, setCountriesData] = useState<CountryFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hexResolution, setHexResolution] = useState(2); // Default: lower resolution
  const [globeReady, setGlobeReady] = useState(false);

  // Load country boundaries for click detection
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setCountriesData(data.features);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading countries:', err);
        setIsLoading(false);
      });
  }, []);

  // Handle globe ready - setup auto-rotation and zoom listener
  const handleGlobeReady = useCallback(() => {
    console.log('Globe is ready!');
    setGlobeReady(true);

    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, []);

  // Setup zoom listener after globe is ready
  // useEffect(() => {
  //   if (!globeReady || !globeEl.current) return;

  //   const controls = globeEl.current.controls();

  //   const handleZoomChange = () => {
  //     if (!globeEl.current) return;

  //     const pov = globeEl.current.pointOfView();
  //     const altitude = pov.altitude;

  //     console.log('Current altitude:', altitude);

  //     // Update resolution based on zoom level
  //     if (altitude < ZOOM_THRESHOLD) {
  //       setHexResolution(3); // High resolution when zoomed in
  //     } else {
  //       setHexResolution(2); // Low resolution when zoomed out
  //     }
  //   };

  //   controls.addEventListener('change', handleZoomChange);
  //   console.log('Zoom listener added');

  //   return () => {
  //     controls.removeEventListener('change', handleZoomChange);
  //   };
  // }, [globeReady]);

  const handlePolygonClick = (polygon: object) => {
    const feature = polygon as CountryFeature;
    if (feature && feature.properties && feature.properties.NAME) {
      const countryName = feature.properties.NAME;
      console.log('Country clicked:', countryName);
      onCountryClick?.(countryName);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading globe...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        onGlobeReady={handleGlobeReady}

        // Country polygons for click detection (invisible)
        polygonsData={countriesData}
        polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={() => 'rgba(100, 100, 100, 0.3)'}
        polygonLabel={(obj: object) => {
          const feature = obj as CountryFeature;
          return `
            <div class="bg-black/80 text-white px-3 py-2 rounded-md text-sm">
              <b>${feature.properties.NAME}</b>
            </div>
          `;
        }}
        onPolygonClick={handlePolygonClick}

        // Hexagon layer for seismic risk visualization
        // Resolution changes dynamically based on zoom level
        hexBinPointsData={hexagonData}
        hexBinPointLat={(obj: object) => (obj as HexagonData).lat}
        hexBinPointLng={(obj: object) => (obj as HexagonData).lng}
        hexBinPointWeight={(obj: object) => (obj as HexagonData).losses}
        hexBinResolution={hexResolution}
        hexMargin={0.2}
        hexAltitude={0.001}
        hexTopColor={(d: object) => {
          const hex = d as { sumWeight: number };
          return getHexColorForLosses(hex.sumWeight);
        }}
        hexSideColor={(d: object) => {
          const hex = d as { sumWeight: number };
          const color = getHexColorForLosses(hex.sumWeight);
          return color + '80'; // Add transparency
        }}
      />
    </div>
  );
}
