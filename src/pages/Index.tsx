
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { parseCSV, groupDataByLocation, MetricData } from '@/utils/csvParser';
import LocationTab from '@/components/LocationTab';
import { Loader2, Building2, TrendingUp, BarChart3 } from 'lucide-react';

const Index = () => {
  const [data, setData] = useState<{ [key: string]: MetricData[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/Metrics.csv');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        const groupedData = groupDataByLocation(parsedData);
        
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 backdrop-blur-md bg-white/70 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-gray-700">Loading metrics data...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 backdrop-blur-md bg-white/70 border border-white/20 shadow-xl">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Studio Metrics Dashboard</h1>
                <p className="text-sm text-gray-600">Performance Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{locations.length} Locations</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue={locations[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 backdrop-blur-md bg-white/70 border border-white/20 shadow-lg">
            {locations.map(location => (
              <TabsTrigger 
                key={location} 
                value={location}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium transition-all duration-300"
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
      </div>

      {/* Footer */}
      <div className="bg-white/50 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 Studio Metrics Dashboard. Data updated in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
