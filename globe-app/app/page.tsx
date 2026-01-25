'use client';
import { useEffect, useState } from 'react';
import Dashboard from "@/components/Dashboard";

interface HexagonData {
  lat: number;
  lng: number;
  losses: number;
  fatalities?: number;
  buildings?: number;
}

export default function Home() {
  const [hexagonData, setHexagonData] = useState<HexagonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use optimized data file (7MB instead of 50MB)
    fetch('/data/seismic-risk-optimized.json')
      .then(res => res.json())
      .then((data: HexagonData[]) => {
        // Optional: Sample data for even better performance
        // Uncomment the next line to use every 3rd point (reduces by 66%)
        // const sampled = data.filter((_, index) => index % 3 === 0);

        setHexagonData(data); // or use sampled
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="text-xl mb-4">Loading seismic risk data...</div>
          <div className="text-sm text-gray-400">This may take a moment</div>
        </div>
      </div>
    );
  }

  return <Dashboard hexagonData={hexagonData} />;
}