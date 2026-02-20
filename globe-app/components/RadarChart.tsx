import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import {EyeClosed, Eye, Radar as RadarIcon} from "lucide-react";

// #region Sample data
const data = [
  {
    subject: 'Total number of buildings',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Total replacement cost',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Population',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'AAL economic',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'AAL fatalities',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'AAL buildings',
    A: 65,
    B: 85,
    fullMark: 150,
  },
  {
    subject: 'AAL displaced',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

// #endregion
interface RadarChartProps {
  country1?: string | null;
  country2?: string | null;
}

export default function SpecifiedDomainRadarChart({ country1, country2 }: RadarChartProps) {
  return (
    <>  
    <div>
      <h3 className="relative text-white text-m text-center">
        <span className="inline-flex items-center">
          <RadarIcon className="mr-2 mb-1" />
          {country1 && country2
          ? `${country1} vs ${country2}`
          : country1 ?? country2 ?? 'Select countries to compare'}
        </span>

        <button
          type="button"
          className="group absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md border border-gray-400 bg-black/40 hover:bg-black/70"
        >
          <Eye className="text-gray-300 group-hover:hidden" />
          <EyeClosed className="hidden text-gray-300 group-hover:inline-block" />
        </button>
      </h3>
    </div>

    <RadarChart className='mx-auto' cx="50%" cy="50%" outerRadius="80%" width={500} height={300} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 150]} />
      {country1 && <Radar name={country1} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />}
      {country2 && <Radar name={country2} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />}
      <Legend />
    </RadarChart>
    </>
  );
};

