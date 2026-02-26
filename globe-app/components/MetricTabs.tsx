'use client';

import { useState } from 'react';

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { BadgeEuro, User, Building2 } from "lucide-react"

type Metric = 'losses' | 'fatalities' | 'buildings';

interface ColorStop {
  color: string;
  label: string;
}

const COLOR_SCALES: Record<Metric, { stops: ColorStop[]; minLabel: string; maxLabel: string }> = {
  losses: {
    stops: [
      { color: 'rgb(240,248,255)', label: '$1K' },
      { color: 'rgb(250,252,243)', label: '$5K' },
      { color: 'rgb(139,210,206)', label: '$10K' },
      { color: 'rgb(213,230,53)',  label: '$25K' },
      { color: 'rgb(244,237,30)',  label: '$50K' },
      { color: 'rgb(246,219,30)',  label: '$100K' },
      { color: 'rgb(249,201,29)',  label: '$500K' },
      { color: 'rgb(249,168,14)',  label: '$1M' },
      { color: 'rgb(249,134,0)',   label: '$2M' },
      { color: 'rgb(255,97,3)',    label: '$5M' },
      { color: 'rgb(255,69,0)',    label: '$10M+' },
    ],
    minLabel: 'Low',
    maxLabel: 'High',
  },
  fatalities: {
    stops: [
      { color: 'rgb(239,239,239)', label: 'Very low' },
      { color: 'rgb(212,231,240)', label: '' },
      { color: 'rgb(168,207,225)', label: 'Low' },
      { color: 'rgb(118,179,207)', label: '' },
      { color: 'rgb(134,146,206)', label: 'Moderate' },
      { color: 'rgb(203,144,144)', label: '' },
      { color: 'rgb(253,97,91)',   label: 'High' },
      { color: 'rgb(249,43,54)',   label: '' },
      { color: 'rgb(176,8,29)',    label: 'Very high' },
      { color: 'rgb(119,1,15)',    label: '' },
      { color: 'rgb(72,0,10)',     label: 'Extreme' },
    ],
    minLabel: 'Very low',
    maxLabel: 'Extreme',
  },
  buildings: {
    stops: [
      { color: 'rgb(255,255,255)', label: '' },
      { color: 'rgb(215,227,238)', label: '' },
      { color: 'rgb(181,202,255)', label: '' },
      { color: 'rgb(143,179,255)', label: '' },
      { color: 'rgb(127,151,255)', label: '' },
      { color: 'rgb(171,207,99)',  label: '' },
      { color: 'rgb(232,245,158)', label: '' },
      { color: 'rgb(255,250,20)',  label: '' },
      { color: 'rgb(255,209,33)',  label: '' },
      { color: 'rgb(255,163,10)',  label: '' },
      { color: 'rgb(255,76,0)',    label: '' },
    ],
    minLabel: 'Few',
    maxLabel: 'Many',
  },
};

function ColorScaleLegend({ metric }: { metric: Metric }) {
  const scale = COLOR_SCALES[metric];
  const labeledStops = scale.stops.filter(s => s.label);

  return (
    <div className="mt-3">
      {/* Color bar */}
      <div className="flex h-4 w-full rounded overflow-hidden border border-white/10">
        {scale.stops.map((stop, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: stop.color }}
          />
        ))}
      </div>

      {/* Low / High end labels */}
      <div className="flex justify-between mt-1 text-xs text-white/40">
        <span>{scale.minLabel}</span>
        <span>{scale.maxLabel}</span>
      </div>

      {/* Named category labels (only for stops that have a label) */}
      {metric === 'losses' && (
        <div className="mt-2 flex flex-wrap gap-1">
          {scale.stops.filter(s => s.label).map((stop, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm border border-white/10 flex-shrink-0" style={{ backgroundColor: stop.color }} />
              <span className="text-[10px] text-white/50">{stop.label}</span>
            </div>
          ))}
        </div>
      )}

      {metric === 'fatalities' && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {labeledStops.map((stop, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm border border-white/10 flex-shrink-0" style={{ backgroundColor: stop.color }} />
              <span className="text-[10px] text-white/50">{stop.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MetricTabsProps {
  onMetricChange: (metric: Metric) => void;
}

export default function MetricTabs({ onMetricChange }: MetricTabsProps) {
  const [activeTab, setActiveTab] = useState<Metric>('losses');
  const [cardVisible, setCardVisible] = useState(true);

  const handleTabClick = (tab: Metric) => {
    if (tab === activeTab) {
      setCardVisible(v => !v);
    } else {
      setActiveTab(tab);
      setCardVisible(true);
      onMetricChange(tab);
    }
  };

  return (
    <Tabs value={activeTab}>
      <TabsList className="bg-black/40 backdrop-blur-sm border border-white/10">
        <TabsTrigger value="losses" onClick={() => handleTabClick('losses')} className="text-white/70 data-[state=active]:bg-white/15 data-[state=active]:text-white">
          <BadgeEuro className="mr-2 h-4 w-4" /> Losses
        </TabsTrigger>
        <TabsTrigger value="fatalities" onClick={() => handleTabClick('fatalities')} className="text-white/70 data-[state=active]:bg-white/15 data-[state=active]:text-white">
          <User className="mr-2 h-4 w-4" /> Fatalities
        </TabsTrigger>
        <TabsTrigger value="buildings" onClick={() => handleTabClick('buildings')} className="text-white/70 data-[state=active]:bg-white/15 data-[state=active]:text-white">
          <Building2 className="mr-2 h-4 w-4" /> Buildings
        </TabsTrigger>
      </TabsList>

      {cardVisible && (
        <>
          {activeTab === 'losses' && (
            <Card className="w-[300px] bg-black/40 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className='text-white'><BadgeEuro className="mr-2 mb-2" />Losses:</CardTitle>
                <CardDescription className='text-white/70'>Estimated annual average economic losses from earthquakes.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-white/50">
                {/* This metric reflects the modelled Annual Average Loss in monetary terms, capturing the long-term expected replacement and repair costs due to seismic events. */}
                <ColorScaleLegend metric="losses" />
              </CardContent>
            </Card>
          )}
          {activeTab === 'fatalities' && (
            <Card className="w-[300px] bg-black/40 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className='text-white'><User className="mr-2 mb-2" />Fatalities:</CardTitle>
                <CardDescription className='text-white/70'>Estimated number of fatalities due to earthquakes.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-white/50">
                {/* Values represent the seismic risk to life. */}
                <ColorScaleLegend metric="fatalities" />
              </CardContent>
            </Card>
          )}
          {activeTab === 'buildings' && (
            <Card className="w-[300px] bg-black/40 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className='text-white'><Building2 className="mr-2 mb-2" />Buildings:</CardTitle>
                <CardDescription className='text-white/70'>Estimated number of buildings.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-white/50">
                {/* This indicator approximates the number of buildings in a given area, highlighting structural exposure to seismic shaking and potential damage. */}
                <ColorScaleLegend metric="buildings" />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Tabs>
  );
}
