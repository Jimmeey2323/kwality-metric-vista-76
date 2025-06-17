import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { parseCSV, groupDataByLocation, MetricData } from '@/utils/csvParser';
import LocationTab from '@/components/LocationTab';
import FloatingNoteTaker from '@/components/FloatingNoteTaker';
import { Loader2, Building2, TrendingUp, BarChart3 } from 'lucide-react';

const Index = () => {
  const [data, setData] = useState<{ [key: string]: MetricData[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFloatingNotePinned, setIsFloatingNotePinned] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/Metrics.csv');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const csvText = await response.text();
        console.log('CSV loaded, first 500 chars:', csvText.substring(0, 500));
        
        // Use the async parseCSV function
        const parsedData = await parseCSV(csvText);
        console.log('Parsed data sample:', parsedData.slice(0, 3));
        
        const groupedData = groupDataByLocation(parsedData);
        console.log('Grouped data keys:', Object.keys(groupedData));
        
        setData(groupedData);
      } catch (err) {
        setError('Failed to load metrics data');
        console.error('Error loading CSV:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center">
        <Card className="p-8 backdrop-blur-md bg-white/80 border border-slate-200/50 shadow-2xl rounded-2xl">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-xl font-bold text-slate-800">Loading metrics data...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center">
        <Card className="p-8 backdrop-blur-md bg-white/80 border border-slate-200/50 shadow-2xl rounded-2xl">
          <div className="text-center">
            <div className="text-red-500 text-3xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Error Loading Data</h2>
            <p className="text-slate-600 text-lg">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const locations = Object.keys(data);
  const locationDisplayNames = {
    'Kwality House Kemps Corner': 'Kwality House, Kemps Corner',
    'Supreme HQ Bandra': 'Supreme HQ, Bandra',
    'Kenkere House': 'Kenkere House'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-md border-b border-slate-600 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">Studio Metrics Dashboard</h1>
                <p className="text-slate-300 text-sm">Advanced Performance Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-slate-300 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Building2 className="h-5 w-5" />
                <span className="font-semibold">{locations.length} Locations</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <Tabs defaultValue={locations[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-10 backdrop-blur-md bg-white/80 border border-slate-200/50 shadow-2xl rounded-2xl p-2">
            {locations.map(location => (
              <TabsTrigger 
                key={location} 
                value={location}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl font-bold text-lg transition-all duration-300 hover:scale-105 rounded-xl py-4"
              >
                {locationDisplayNames[location as keyof typeof locationDisplayNames] || location}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {locations.map(location => (
            <TabsContent key={location} value={location} className="mt-0">
              <LocationTab 
                data={data[location]} 
                locationName={locationDisplayNames[location as keyof typeof locationDisplayNames] || location}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Pinned Note Taker */}
        <FloatingNoteTaker
          storageKey="dashboard-notes-pinned"
          title="Dashboard Notes"
          isPinned={isFloatingNotePinned}
          onPinToggle={setIsFloatingNotePinned}
          className="mt-8"
        />
      </div>

      {/* Floating Note Taker */}
      <FloatingNoteTaker
        storageKey="dashboard-notes-floating"
        title="Quick Notes"
        isPinned={false}
      />

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-md border-t border-slate-600 mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
          <div className="text-center text-slate-300">
            <p className="font-semibold">© 2024 Studio Metrics Dashboard. Data updated in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
