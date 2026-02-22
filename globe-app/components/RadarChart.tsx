import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { EyeClosed, Eye, Radar as RadarIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import { getNormalizedData, METRICS } from '@/lib/riskData';

interface RadarChartProps {
  country1?: string | null;
  country2?: string | null;
}

export default function SpecifiedDomainRadarChart({ country1, country2 }: RadarChartProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [chartData, setChartData] = useState<{ subject: string; A: number; B: number; fullMark: number }[]>([]);
  const [c1Missing, setC1Missing] = useState(false);
  const [c2Missing, setC2Missing] = useState(false);

  useEffect(() => {
    getNormalizedData().then(data => {
      const c1 = country1 ? data.get(country1) : null;
      const c2 = country2 ? data.get(country2) : null;

      setC1Missing(!!country1 && !c1);
      setC2Missing(!!country2 && !c2);

      setChartData(
        METRICS.map(m => ({
          subject:  m.label,
          A:        c1?.[m.key] ?? 0,
          B:        c2?.[m.key] ?? 0,
          fullMark: 100,
        }))
      );
    });
  }, [country1, country2]);

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="flex items-center justify-center backdrop-blur-sm w-2xs rounded-md text-gray-300 bg-black/40 hover:text-white transition-colors animate-pulse"
        title="Expand chart"
      >
        <RadarIcon className="w-8 h-8" />
      </button>
    );
  }

  const label1 = country1 ? (c1Missing ? `${country1} (no data)` : country1) : null;
  const label2 = country2 ? (c2Missing ? `${country2} (no data)` : country2) : null;

  return (
    <>
    <div>
      <h3 className="relative text-white text-m text-center">
        <span className="inline-flex items-center">
          <RadarIcon className="mr-2 mb-1" />
          {label1 && label2
            ? `${label1} vs ${label2}`
            : label1 ?? label2 ?? 'Select countries to compare'}
        </span>

        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="group absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md border border-gray-400 bg-black/40 hover:bg-black/70"
          title="Minimize chart"
        >
          <Eye className="text-gray-300 group-hover:hidden" />
          <EyeClosed className="hidden text-gray-300 group-hover:inline-block" />
        </button>
      </h3>
    </div>

    <RadarChart className='mx-auto' cx="50%" cy="50%" outerRadius="80%" width={500} height={300} data={chartData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
      {country1 && !c1Missing && <Radar name={country1} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />}
      {country2 && !c2Missing && <Radar name={country2} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />}
      <Tooltip
        cursor={{ stroke: '#4b5563', strokeWidth: 1 }}
        contentStyle={{ backgroundColor: '#020617', borderColor: '#4b5563' }}
        labelStyle={{ color: '#e5e7eb' }}
        itemStyle={{ color: '#e5e7eb' }}
      />
      <Legend wrapperStyle={{ color: '#d1d5db' }} />
    
    </RadarChart>
    </>
  );
};

