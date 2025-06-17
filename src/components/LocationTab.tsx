
import React from 'react';
import { MetricData, getUniqueMetrics } from '@/utils/csvParser';
import MetricsTable from './MetricsTable';

interface LocationTabProps {
  data: MetricData[];
  locationName: string;
}

const LocationTab: React.FC<LocationTabProps> = ({ data, locationName }) => {
  const metrics = getUniqueMetrics(data);
  
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{locationName}</h2>
        <p className="text-gray-600">Performance Metrics Dashboard</p>
      </div>
      
      {metrics.map(metric => (
        <MetricsTable 
          key={metric} 
          data={data} 
          metric={metric} 
        />
      ))}
    </div>
  );
};

export default LocationTab;
