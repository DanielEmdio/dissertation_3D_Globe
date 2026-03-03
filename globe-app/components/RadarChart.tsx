import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { EyeClosed, Eye, Radar as RadarIcon } from "lucide-react";
import { useState, useEffect, useRef } from 'react';
import { getRawData, METRICS } from '@/lib/riskData';

const RADAR_COLORS = ["#82ca9d", "#8884d8", "#ff6b6b", "#ffd93d", "#6bcfff", "#ff9f43"];

type ChartRow = {
  subject:  string;
  A:        number;
  B:        number;
  A_raw:    number | null;
  B_raw:    number | null;
  fullMark: number;
};

function formatRaw(value: number | null): string {
  if (value === null) return 'N/A';
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000)     return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000)         return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)             return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-slate-600 bg-slate-900 p-3 text-sm shadow-lg">
      <p className="mb-2 font-medium text-gray-200">{label}</p>
      {payload.map((entry: any, i: number) => {
        const rawKey = entry.dataKey === 'A' ? 'A_raw' : 'B_raw';
        const raw    = entry.payload[rawKey] as number | null;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="font-medium" style={{ color: entry.color }}>{entry.name}:</span>
            <span className="text-gray-100">{formatRaw(raw)}</span>
            {/* <span className="text-gray-500">({entry.value}/100)</span> */}
          </div>
        );
      })}
    </div>
  );
}

interface RadarChartProps {
  country1?: string | null;
  country2?: string | null;
}

export default function SpecifiedDomainRadarChart({ country1, country2 }: RadarChartProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [c1Missing, setC1Missing] = useState(false);
  const [c2Missing, setC2Missing] = useState(false);
  const [colorCycle, setColorCycle] = useState(0);
  const prevC1Ref = useRef<string | null | undefined>(country1 ?? null);
  const prevC2Ref = useRef<string | null | undefined>(country2 ?? null);

  // Advance the color cycle only when an already-set country is replaced
  useEffect(() => {
    const wasC1Set = prevC1Ref.current != null;
    const wasC2Set = prevC2Ref.current != null;
    const c1Cycled = wasC1Set && country1 !== prevC1Ref.current && country1 != null;
    const c2Cycled = wasC2Set && country2 !== prevC2Ref.current && country2 != null;
    prevC1Ref.current = country1;
    prevC2Ref.current = country2;
    if (c1Cycled || c2Cycled) setColorCycle(n => n + 1);
    // console.log('Country change detected:', { country1, country2, c1Cycled, c2Cycled, colorCycle });
  }, [country1, country2]);

  useEffect(() => {
    getRawData().then(raw => {
      const c1raw = country1 ? raw.get(country1) : null;
      const c2raw = country2 ? raw.get(country2) : null;

      setC1Missing(!!country1 && !c1raw);
      setC2Missing(!!country2 && !c2raw);

      setChartData(
        METRICS.map(m => {
          const a = c1raw?.[m.key] ?? null;
          const b = c2raw?.[m.key] ?? null;
          const max = Math.max(a ?? 0, b ?? 0);
          return {
            subject:  m.label,
            A:        max > 0 ? Math.round(((a ?? 0) / max) * 100) : 0,
            B:        max > 0 ? Math.round(((b ?? 0) / max) * 100) : 0,
            A_raw:    a,
            B_raw:    b,
            fullMark: 100,
          };
        })
      );
    });
  }, [country1, country2]);

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="flex items-center justify-center gap-2 backdrop-blur-sm w-full rounded-md text-gray-300 bg-black/40 hover:text-white transition-colors animate-pulse"
        title="Expand chart"
      >
        <RadarIcon className="w-8 h-8" />
        <p className='font-bold'>Radarchart</p>
      </button>
    );
  }

  const label1 = country1 ? (c1Missing ? `${country1} (no data)` : country1) : null;
  const label2 = country2 ? (c2Missing ? `${country2} (no data)` : country2) : null;

  const colorB = RADAR_COLORS[colorCycle % RADAR_COLORS.length];
  const colorA = RADAR_COLORS[(colorCycle - 1 + RADAR_COLORS.length) % RADAR_COLORS.length];

  return (
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
    

      <RadarChart className='mx-auto' cx="50%" cy="50%" outerRadius="80%" width={450} height={300} data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
        {/* <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} /> */}
        {country1 && !c1Missing && <Radar name={country1} dataKey="A" stroke={colorA} fill={colorA} fillOpacity={0.6} />}
        {country2 && !c2Missing && <Radar name={country2} dataKey="B" stroke={colorB} fill={colorB} fillOpacity={0.6} />}
        <Tooltip content={<CustomTooltip />}/>
        <Legend wrapperStyle={{ color: '#d1d5db' }} />
      
      </RadarChart>
    </div>
  );
};

