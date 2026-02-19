'use client';

import { useState, useRef, useCallback } from 'react';
import Globe3D from './Globe3D';
import CountryProfile from './CountryProfile';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BadgeEuro, User, Building2} from "lucide-react"


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
  const [panelSize, setPanelSize] = useState({ width: 400, height: 500 });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
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
        <div
          className="absolute top-4 right-4 bg-white rounded-lg shadow-xl overflow-hidden"
          style={{ width: `${panelSize.width}px`, height: `${panelSize.height}px`, zIndex: 1000 }}
        >
          <CountryProfile
            countryName={selectedCountry}
            onClose={handleCloseProfile}
          />
          {/* Resize handle - lower left corner */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, #9ca3af 50%)',
              borderBottomLeftRadius: '0.5rem',
            }}
          />
        </div>
      )}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-50'>
        <Tabs defaultValue="losses" onValueChange={(v) => setSelectedMetric(v as Metric)}>
          <TabsList className="bg-black/40 backdrop-blur-sm border border-white/10">

            <TabsTrigger value="losses" className="text-white/70 data-[state=active]:bg-white/15 data-[state=active]:text-white"> 
              <BadgeEuro className="mr-2 h-4 w-4" /> Losses
            </TabsTrigger>

            <TabsTrigger value="fatalities" className="text-white/70 data-[state=active]:bg-white/15 data-[state=active]:text-white"> 
              <User className="mr-2 h-4 w-4" /> Fatalities
            </TabsTrigger>

            <TabsTrigger value="buildings" className="text-white/70 data-[state=active]:bg-white/15 data-[state=active]:text-white"> 
              <Building2 className="mr-2 h-4 w-4" /> Buildings
            </TabsTrigger>
            
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
