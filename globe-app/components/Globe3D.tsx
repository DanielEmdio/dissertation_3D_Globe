'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from './LoadingScreen';


// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

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
  metric?: Metric;
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
  metric = 'losses',
}: Globe3DProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const [countriesData, setCountriesData] = useState<CountryFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [textureAvailable, setTextureAvailable] = useState<boolean | null>(null);

  // Pre-load click sound
  useEffect(() => {
    const sfx = new Audio('/sounds/universfield-interface-124464.mp3');
    sfx.playbackRate = 2;
    sfx.volume = 0.8;
    clickSoundRef.current = sfx;
    return () => { sfx.src = ''; };
  }, []);

  // Check if the pre-rendered texture exists (re-runs when metric changes)
  useEffect(() => {
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
  }, [metric]);

  // Load country boundaries for click detection
  useEffect(() => {
    fetch('/data/countries_bounderies.geojson')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.url}`);
        return res.json();
      })
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
    console.log('Globe ready! Texture:', textureAvailable ? 'available' : 'unavailable (fallback)');

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
      if (clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play().catch(() => {});
      }
      onCountryClick?.(countryName);
    }
  };

  // Start background music once the globe is ready
  useEffect(() => {
    if (isLoading || textureAvailable === null) return;

    // Play loading-complete sound
    // const loadSound = new Audio('/sounds/snorcon.mp3');
    // loadSound.volume = 0.8;
    // loadSound.play().catch(() => {});

    const audio = new Audio('/sounds/647591__collectionofmemories__lo-fi-loop.wav');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    audio.play().catch(() => {
      // Autoplay blocked — play on first user interaction
      const resume = () => {
        audio.play();
        window.removeEventListener('pointerdown', resume);
      };
      window.addEventListener('pointerdown', resume);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isLoading, textureAvailable]);

  // Wait for countries AND texture check to complete
  if (isLoading || textureAvailable === null) {
    return <LoadingScreen />;
  }

  const globeImageUrl = textureAvailable
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

      />
    </div>
  );
}
