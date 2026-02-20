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
                <CardDescription className='text-white/70'>View your key metrics and recent project activity. Track progress across all your active projects.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-white/50">
                You have 12 active projects and 3 pending tasks.
              </CardContent>
            </Card>
          )}
          {activeTab === 'fatalities' && (
            <Card className="w-[300px] bg-black/40 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className='text-white'><User className="mr-2 mb-2" />Fatalities:</CardTitle>
                <CardDescription className='text-white/70'>View your key metrics and recent project activity. Track progress across all your active projects.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-white/50">
                You have 12 active projects and 3 pending tasks.
              </CardContent>
            </Card>
          )}
          {activeTab === 'buildings' && (
            <Card className="w-[300px] bg-black/40 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className='text-white'><Building2 className="mr-2 mb-2" />Buildings:</CardTitle>
                <CardDescription className='text-white/70'>View your key metrics and recent project activity. Track progress across all your active projects.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-white/50">
                You have 12 active projects and 3 pending tasks.
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Tabs>
  );
}
