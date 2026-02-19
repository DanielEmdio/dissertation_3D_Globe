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

type Metric = 'losses' | 'fatalities' | 'buildings';

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
  hexagonData?: HexagonData[];
  metric?: Metric;
  /**
   * Visualization mode:
   * - 'texture': Use pre-rendered texture image (faster, higher quality)
   * - 'hexagons': Compute hexagons dynamically (original behavior)
   */
  visualizationMode?: 'texture' | 'hexagons';
}

// Configuration for visualization
const GLOBE_CONFIG = {
  earthTextureUrl: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  backgroundUrl: '//unpkg.com/three-globe/example/img/night-sky.png',
};

const getRiskTextureUrl = (metric: Metric) =>
  `/textures/seismic-risk-map-${metric}.png`;

export default function Globe3D({
  onCountryClick,
  hexagonData = [],
  metric = 'losses',
  visualizationMode = 'texture',
}: Globe3DProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [countriesData, setCountriesData] = useState<CountryFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hexResolution] = useState(4);
  const [textureAvailable, setTextureAvailable] = useState<boolean | null>(null);

  // Check if the pre-rendered texture exists (re-runs when metric changes)
  useEffect(() => {
    if (visualizationMode === 'texture') {
      setTextureAvailable(null);
      const img = new Image();
      const url = getRiskTextureUrl(metric);
      img.onload = () => setTextureAvailable(true);
      img.onerror = () => {
        console.warn('Seismic risk texture not found at:', url);
        console.warn('Falling back to hexagon visualization.');
        setTextureAvailable(false);
      };
      img.src = url;
    } else {
      const timeoutId = setTimeout(() => setTextureAvailable(false), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [visualizationMode, metric]);

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

  // Handle globe ready - setup auto-rotation
  const handleGlobeReady = useCallback(() => {
    console.log('Globe ready! Mode:', textureAvailable ? 'texture' : 'hexagons');

    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, [textureAvailable]);

  const handlePolygonClick = (polygon: object) => {
    const feature = polygon as CountryFeature;
    if (feature && feature.properties && feature.properties.NAME) {
      const countryName = feature.properties.NAME;
      console.log('Country clicked:', countryName);
      onCountryClick?.(countryName);
    }
  };

  // Wait for countries AND texture check to complete
  if (isLoading || textureAvailable === null) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading globe...</div>
      </div>
    );
  }

  // Determine which mode to use
  const useTexture = visualizationMode === 'texture' && textureAvailable;
  const globeImageUrl = useTexture
    ? getRiskTextureUrl(metric)
    : GLOBE_CONFIG.earthTextureUrl;

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeEl}
        globeImageUrl={globeImageUrl}
        backgroundImageUrl={GLOBE_CONFIG.backgroundUrl}
        onGlobeReady={handleGlobeReady}

        // Country polygons for click detection (invisible but clickable)
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

        // Hexagon layer - ONLY used when texture is not available
        hexBinPointsData={useTexture ? [] : hexagonData}
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
          return color + '80';
        }}
      />
    </div>
  );
}
