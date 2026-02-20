'use client';

import { useState, useRef, useCallback } from 'react';
import Globe3D from './Globe3D';
import CountryProfile from './CountryProfile';
import MetricTabs from './MetricTabs';
import RadarChart from './RadarChart';
import { DraggableCardBody, DraggableCardContainer } from './ui/draggable-card';
import { Magnet } from "lucide-react"

interface HexagonData {
  lat: number;
  lng: number;
  losses: number;
  fatalities?: number;
  buildings?: number;
}

interface DashboardProps {
  hexagonData?: HexagonData[];
}

type Metric = 'losses' | 'fatalities' | 'buildings';

export default function Dashboard({ hexagonData = [] }: DashboardProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<Metric>('losses');
  const [compareCountries, setCompareCountries] = useState<[string | null, string | null]>([null, null]);
  const [panelSize, setPanelSize] = useState({ width: 400, height: 500 });
  const cardRef = useRef<{ resetPosition: () => void }>(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
    setCompareCountries(prev => {
      if (prev[0] === countryName || prev[1] === countryName) return prev;
      return [prev[1], countryName];
    });
  };

  const handleCloseProfile = () => {
    setSelectedCountry(null);
  };

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width: panelSize.width, height: panelSize.height };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      // Lower-left corner: dragging left increases width, dragging down increases height
      const deltaX = startPos.current.x - e.clientX;
      const deltaY = e.clientY - startPos.current.y;

      const newWidth = Math.max(300, Math.min(800, startSize.current.width + deltaX));
      const newHeight = Math.max(300, Math.min(window.innerHeight - 64, startSize.current.height + deltaY));

      setPanelSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [panelSize]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Globe - Full Screen */}
      <div className="absolute inset-0">
        <Globe3D
          onCountryClick={handleCountryClick}
          metric={selectedMetric}
        />
      </div>

      {/* Country Profile - Overlay in upper right */}
      {selectedCountry && (
        <>
          <DraggableCardContainer className="absolute bottom-4 right-4 z-50">
            <DraggableCardBody ref={cardRef} className="w-[700px] h-[600px] p-0 min-h-0 bg-white dark:bg-neutral-900">
              <CountryProfile
                countryName={selectedCountry}
                onClose={handleCloseProfile}
              />
            </DraggableCardBody>
          </DraggableCardContainer>
          <button
            onClick={() => cardRef.current?.resetPosition()}
            className="absolute bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors animate-pulse"
            title="Snap card back to original position"
          >
            <Magnet className="w-5 h-5" />
          </button>
        </>
      )}

      <div className='absolute top-4 left-4 z-50'>
        <MetricTabs onMetricChange={setSelectedMetric} />
      </div>

      <div className='absolute bottom-4 left-4 z-50 bg-black/40 backdrop-blur-sm border border-white/10 p-4 rounded-lg'>
        <RadarChart country1={compareCountries[0]} country2={compareCountries[1]} />
      </div>
    </div>
  );
}
