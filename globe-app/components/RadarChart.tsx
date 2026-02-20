import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

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
        <h3 className="text-white text-m text-center">
          {country1 && country2
            ? `${country1} vs ${country2}`
            : country1 ?? country2 ?? 'Select countries to compare'}
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

