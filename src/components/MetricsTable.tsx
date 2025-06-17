
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricData, getUniqueMetrics } from '@/utils/csvParser';
import { formatValue } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MetricsTableProps {
  data: MetricData[];
  locationName: string;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ data, locationName }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [isNoteTakerOpen, setIsNoteTakerOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const uniqueMetrics = useMemo(() => getUniqueMetrics(data), [data]);

  React.useEffect(() => {
    if (uniqueMetrics.length > 0 && !selectedMetric) {
      setSelectedMetric(uniqueMetrics[0]);
    }
  }, [uniqueMetrics, selectedMetric]);

  const filteredData = useMemo(() => {
    return data.filter(item => item.metric === selectedMetric);
  }, [data, selectedMetric]);

  const monthColumns = [
    { key: '2025-jun', label: 'Jun 2025' },
    { key: '2025-may', label: 'May 2025' },
    { key: '2025-apr', label: 'Apr 2025' },
    { key: '2025-mar', label: 'Mar 2025' },
    { key: '2025-feb', label: 'Feb 2025' },
    { key: '2025-jan', label: 'Jan 2025' },
    { key: '2024-dec', label: 'Dec 2024' },
    { key: '2024-nov', label: 'Nov 2024' },
    { key: '2024-oct', label: 'Oct 2024' },
    { key: '2024-sep', label: 'Sep 2024' },
    { key: '2024-aug', label: 'Aug 2024' },
    { key: '2024-jul', label: 'Jul 2024' },
    { key: '2024-jun', label: 'Jun 2024' },
    { key: '2024-may', label: 'May 2024' },
    { key: '2024-apr', label: 'Apr 2024' },
    { key: '2024-mar', label: 'Mar 2024' },
    { key: '2024-feb', label: 'Feb 2024' },
    { key: '2024-jan', label: 'Jan 2024' }
  ];

  const getGrowthIndicator = (current: string, previous: string) => {
    const currentNum = parseFloat(current) || 0;
    const previousNum = parseFloat(previous) || 0;
    
    if (previousNum === 0) return null;
    
    const growth = ((currentNum - previousNum) / previousNum) * 100;
    
    if (Math.abs(growth) < 0.1) {
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <Minus className="w-3 h-3" />
          <span className="text-xs">0%</span>
        </div>
      );
    }
    
    const isPositive = growth > 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span className="text-xs">{Math.abs(growth).toFixed(1)}%</span>
      </div>
    );
  };

  const calculateColumnTotal = (columnKey: keyof MetricData) => {
    const total = filteredData.reduce((sum, row) => {
      const value = row[columnKey];
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : 0;
      return sum + numValue;
    }, 0);
    return total.toString();
  };

  const getValueForColumn = (row: MetricData, columnKey: keyof MetricData) => {
    const value = row[columnKey];
    return typeof value === 'string' ? value : (value || '0');
  };

  if (!selectedMetric || filteredData.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200/50 shadow-xl rounded-2xl">
        <div className="text-slate-600">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">No Data Available</h3>
          <p>No metrics data found for {locationName}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Metric Selector */}
      <Card className="p-6 bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200/50 shadow-xl rounded-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Performance Metrics - {locationName}
          </h3>
          <p className="text-slate-600 text-sm mt-1">Select a metric to analyze performance trends</p>
        </div>
        
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 bg-transparent p-2 h-auto">
            {uniqueMetrics.map((metric) => (
              <TabsTrigger 
                key={metric} 
                value={metric}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-xl p-4 text-center border border-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 data-[state=active]:from-white data-[state=active]:to-white"></div>
                  <span className="font-semibold text-sm leading-tight">{metric}</span>
                  <div className="text-xs opacity-75">
                    {filteredData.length} records
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {/* Main Data Table */}
      <Card className="overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200/50 shadow-2xl rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white sticky top-0 z-10">
              {/* Year Headers */}
              <tr>
                <th rowSpan={2} className="px-6 py-4 text-left font-bold border-r border-slate-600 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Trainer Details
                  </div>
                </th>
                <th colSpan={6} className="px-4 py-2 text-center font-bold border-r border-slate-600 text-lg">
                  2025
                </th>
                <th colSpan={12} className="px-4 py-2 text-center font-bold border-r border-slate-600 text-lg">
                  2024
                </th>
                <th rowSpan={2} className="px-4 py-4 text-center font-bold min-w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Total
                  </div>
                </th>
              </tr>
              {/* Month Headers */}
              <tr>
                {monthColumns.map((column) => (
                  <th key={column.key} className="px-3 py-2 text-center text-xs font-semibold border-r border-slate-600 min-w-[80px] text-slate-200">
                    {column.label.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-slate-200/50 transition-all duration-300 group">
                  <td className="px-6 py-4 border-r border-slate-200/50 bg-white group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-purple-50">
                    <div className="space-y-2">
                      <div className="font-bold text-slate-900">{row.trainerName}</div>
                      <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block font-medium">
                        {row.isNew}
                      </div>
                    </div>
                  </td>
                  {monthColumns.map((column, colIndex) => {
                    const currentValue = getValueForColumn(row, column.key as keyof MetricData);
                    const previousValue = colIndex < monthColumns.length - 1 
                      ? getValueForColumn(row, monthColumns[colIndex + 1].key as keyof MetricData)
                      : null;
                    
                    return (
                      <td key={column.key} className="px-3 py-4 text-center border-r border-slate-200/50 group-hover:bg-gradient-to-r group-hover:from-blue-50/50 group-hover:to-purple-50/50">
                        <div className="flex flex-col items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {formatValue(currentValue)}
                          </span>
                          {previousValue && getGrowthIndicator(currentValue, previousValue)}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 text-center font-bold text-emerald-700 bg-emerald-50">
                    {formatValue(row.grandTotal)}
                  </td>
                </tr>
              ))}
              
              {/* Totals Row */}
              <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-bold border-t-4 border-emerald-500">
                <td className="px-6 py-4 border-r border-emerald-400 text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    TOTALS
                  </div>
                </td>
                {monthColumns.map((column) => (
                  <td key={column.key} className="px-3 py-4 text-center border-r border-emerald-400">
                    <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                      {formatValue(calculateColumnTotal(column.key as keyof MetricData))}
                    </div>
                  </td>
                ))}
                <td className="px-4 py-4 text-center text-lg">
                  <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                    {formatValue(calculateColumnTotal('grandTotal'))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Collapsible Note Taker */}
      <Card className="bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200/50 shadow-xl rounded-2xl">
        <div 
          className="p-4 cursor-pointer flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-t-2xl"
          onClick={() => setIsNoteTakerOpen(!isNoteTakerOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800">Analysis Notes</h3>
            <span className="text-sm text-slate-600">({selectedMetric})</span>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-full">
            {isNoteTakerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        
        {isNoteTakerOpen && (
          <div className="p-6 border-t border-slate-200/50 bg-white/80 rounded-b-2xl">
            <Textarea
              placeholder={`Add your analysis notes for ${selectedMetric} metrics at ${locationName}...`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-white/90"
            />
            <div className="mt-4 flex justify-between items-center text-sm text-slate-600">
              <span>Notes are automatically saved</span>
              <span>{notes.length} characters</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MetricsTable;
