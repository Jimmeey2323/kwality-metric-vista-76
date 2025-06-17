import React, { useState } from 'react';
import { MetricData, getUniqueMetrics } from '@/utils/csvParser';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, BarChart3, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FloatingNoteTaker from '@/components/FloatingNoteTaker';

interface MetricsTableProps {
  data: MetricData[];
}

const MetricsTable: React.FC<MetricsTableProps> = ({
  data
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [viewMode, setViewMode] = useState<'chronological' | 'year-on-year' | 'quarter' | 'comparative'>('chronological');
  const [isPinnedNoteTaker, setIsPinnedNoteTaker] = useState<boolean>(false);
  
  const availableMetrics = getUniqueMetrics(data);

  // Metrics that should show averages instead of sums in grouped rows
  const averageMetrics = ['AUV', 'ATV', 'ASV', 'UPT'];

  // Set default metric if not selected
  React.useEffect(() => {
    if (!selectedMetric && availableMetrics.length > 0) {
      setSelectedMetric(availableMetrics[0]);
    }
  }, [availableMetrics, selectedMetric]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const formatValue = (value: string, metricType: string) => {
    if (!value || value === '' || value === '0') {
      return <span className="text-gray-400 font-medium">-</span>;
    }
    const numValue = parseFloat(value.replace(/[₹,]/g, ''));
    if (isNaN(numValue) || numValue === 0) {
      return <span className="text-gray-400 font-medium">-</span>;
    }
    if (metricType.toLowerCase().includes('sales') || metricType.toLowerCase().includes('amount') || metricType.toLowerCase().includes('vat') || metricType.toLowerCase().includes('value') || metricType.toLowerCase().includes('discount amount')) {
      return <span className="">{formatCurrency(numValue)}</span>;
    } else if (metricType.toLowerCase().includes('percentage')) {
      return <span className="font-bold">{formatPercentage(numValue)}</span>;
    } else {
      return <span className="font-bold">{formatNumber(numValue)}</span>;
    }
  };

  const GrowthIndicator: React.FC<{
    current: string;
    previous: string;
    metricType: string;
  }> = ({
    current,
    previous,
    metricType
  }) => {
    const currentValue = parseFloat(current?.replace(/[₹,]/g, '') || '0');
    const previousValue = parseFloat(previous?.replace(/[₹,]/g, '') || '0');
    
    if (!current || !previous || currentValue === 0 || previousValue === 0) {
      return null;
    }
    
    const growth = (currentValue - previousValue) / previousValue * 100;
    const isPositive = growth > 0;
    const isNeutral = Math.abs(growth) < 0.1;
    
    if (isNeutral) {
      return (
        <div className="flex items-center gap-1 text-gray-400 ml-1">
          <Minus className="w-3 h-3" />
          <span className="text-xs">0%</span>
        </div>
      );
    }
    
    return (
      <div className={`flex items-center gap-1 ml-1 ${isPositive ? 'text-green-600' : 'text-red-700'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span className="text-xs font-medium">{Math.abs(growth).toFixed(1)}%</span>
      </div>
    );
  };

  // Filter data to only show rows for the selected metric
  const metricData = data.filter(item => item.metric === selectedMetric);

  // All 18 months in descending order (2025-Jun to 2024-Jan)
  const allMonths = [
    { key: '2025-jun' as keyof MetricData, label: 'Jun 25', quarter: 'Q2', year: 2025, month: 6 },
    { key: '2025-may' as keyof MetricData, label: 'May 25', quarter: 'Q2', year: 2025, month: 5 },
    { key: '2025-apr' as keyof MetricData, label: 'Apr 25', quarter: 'Q2', year: 2025, month: 4 },
    { key: '2025-mar' as keyof MetricData, label: 'Mar 25', quarter: 'Q1', year: 2025, month: 3 },
    { key: '2025-feb' as keyof MetricData, label: 'Feb 25', quarter: 'Q1', year: 2025, month: 2 },
    { key: '2025-jan' as keyof MetricData, label: 'Jan 25', quarter: 'Q1', year: 2025, month: 1 },
    { key: '2024-dec' as keyof MetricData, label: 'Dec 24', quarter: 'Q4', year: 2024, month: 12 },
    { key: '2024-nov' as keyof MetricData, label: 'Nov 24', quarter: 'Q4', year: 2024, month: 11 },
    { key: '2024-oct' as keyof MetricData, label: 'Oct 24', quarter: 'Q4', year: 2024, month: 10 },
    { key: '2024-sep' as keyof MetricData, label: 'Sep 24', quarter: 'Q3', year: 2024, month: 9 },
    { key: '2024-aug' as keyof MetricData, label: 'Aug 24', quarter: 'Q3', year: 2024, month: 8 },
    { key: '2024-jul' as keyof MetricData, label: 'Jul 24', quarter: 'Q3', year: 2024, month: 7 },
    { key: '2024-jun' as keyof MetricData, label: 'Jun 24', quarter: 'Q2', year: 2024, month: 6 },
    { key: '2024-may' as keyof MetricData, label: 'May 24', quarter: 'Q2', year: 2024, month: 5 },
    { key: '2024-apr' as keyof MetricData, label: 'Apr 24', quarter: 'Q2', year: 2024, month: 4 },
    { key: '2024-mar' as keyof MetricData, label: 'Mar 24', quarter: 'Q1', year: 2024, month: 3 },
    { key: '2024-feb' as keyof MetricData, label: 'Feb 24', quarter: 'Q1', year: 2024, month: 2 },
    { key: '2024-jan' as keyof MetricData, label: 'Jan 24', quarter: 'Q1', year: 2024, month: 1 }
  ];

  // Year-on-year view: group by month name, sort by year descending, then sort months Jun-Jan
  const getYearOnYearMonths = () => {
    const monthGroups: { [monthName: string]: typeof allMonths } = {};
    allMonths.forEach(month => {
      const monthName = month.label.split(' ')[0]; // Extract month name (e.g., "Jun", "May")
      if (!monthGroups[monthName]) {
        monthGroups[monthName] = [];
      }
      monthGroups[monthName].push(month);
    });

    // Sort each month group by year descending
    Object.keys(monthGroups).forEach(monthName => {
      monthGroups[monthName].sort((a, b) => b.year - a.year);
    });

    // Return months in Jun-Jan order (Jun first, Jan last)
    const monthOrder = ['Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan', 'Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul'];
    return monthOrder.map(monthName => ({
      monthName,
      columns: monthGroups[monthName] || []
    })).filter(group => group.columns.length > 0);
  };

  // Quarter view: group by quarters
  const getQuarterGroups = () => {
    const quarterGroups: { [key: string]: typeof allMonths } = {};
    allMonths.forEach(month => {
      const quarterKey = `${month.year}-Q${month.quarter}`;
      if (!quarterGroups[quarterKey]) {
        quarterGroups[quarterKey] = [];
      }
      quarterGroups[quarterKey].push(month);
    });
    return Object.entries(quarterGroups).map(([quarterKey, months]) => ({
      quarterKey,
      columns: months.sort((a, b) => b.month - a.month) // Sort months within quarter descending
    })).sort((a, b) => b.quarterKey.localeCompare(a.quarterKey)); // Sort quarters descending
  };

  const months = viewMode === 'chronological' ? allMonths : allMonths;
  const yearOnYearGroups = getYearOnYearMonths();
  const quarterGroups = getQuarterGroups();

  // Group months by year (in descending order: 2025, 2024)
  const yearGroups = allMonths.reduce((acc, month) => {
    if (!acc[month.year]) acc[month.year] = [];
    acc[month.year].push(month);
    return acc;
  }, {} as Record<number, typeof allMonths>);

  // Sort years in descending order
  const sortedYears = Object.keys(yearGroups).map(Number).sort((a, b) => b - a);

  // Group data by first visit location (category)
  const groupedData = metricData.reduce((acc, item) => {
    const category = item.firstVisitLocation || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MetricData[]>);

  // Modified calculation functions to handle averages for specific metrics
  const calculateMonthTotal = (monthKey: string) => {
    const shouldUseAverage = averageMetrics.includes(selectedMetric);
    
    if (shouldUseAverage) {
      const values = metricData.map(item => {
        const value = parseFloat((item[monthKey as keyof MetricData] as string)?.replace(/[₹,]/g, '') || '0');
        return value;
      }).filter(value => value > 0); // Only include non-zero values for average
      
      return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    } else {
      return metricData.reduce((sum, item) => {
        const value = parseFloat((item[monthKey as keyof MetricData] as string)?.replace(/[₹,]/g, '') || '0');
        return sum + value;
      }, 0);
    }
  };

  const calculateGrandTotal = () => {
    const shouldUseAverage = averageMetrics.includes(selectedMetric);
    
    if (shouldUseAverage) {
      const values = metricData.map(item => {
        const value = parseFloat(item.grandTotal.replace(/[₹,]/g, '') || '0');
        return value;
      }).filter(value => value > 0); // Only include non-zero values for average
      
      return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    } else {
      return metricData.reduce((sum, item) => {
        const value = parseFloat(item.grandTotal.replace(/[₹,]/g, '') || '0');
        return sum + value;
      }, 0);
    }
  };

  // Modified category calculation for averages
  const calculateCategoryValue = (categoryData: MetricData[], monthKey: string) => {
    const shouldUseAverage = averageMetrics.includes(selectedMetric);
    
    if (shouldUseAverage) {
      const values = categoryData.map(item => {
        const value = parseFloat((item[monthKey as keyof MetricData] as string).replace(/[₹,]/g, '') || 0);
        return value;
      }).filter(value => value > 0); // Only include non-zero values for average
      
      return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    } else {
      return categoryData.reduce((sum, item) => {
        const value = parseFloat((item[monthKey as keyof MetricData] as string).replace(/[₹,]/g, '') || 0);
        return sum + value;
      }, 0);
    }
  };

  const calculateCategoryTotal = (categoryData: MetricData[]) => {
    const shouldUseAverage = averageMetrics.includes(selectedMetric);
    
    if (shouldUseAverage) {
      const values = categoryData.map(item => {
        const value = parseFloat(item.grandTotal.replace(/[₹,]/g, '') || 0);
        return value;
      }).filter(value => value > 0); // Only include non-zero values for average
      
      return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    } else {
      return categoryData.reduce((sum, item) => {
        const value = parseFloat(item.grandTotal.replace(/[₹,]/g, '') || 0);
        return sum + value;
      }, 0);
    }
  };

  if (availableMetrics.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No metrics data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Metrics Selector */}
      <Card className="backdrop-blur-md bg-white/95 border border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden">
        <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-teal-600/10"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 rounded-2xl shadow-2xl">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-wide">
                  Performance Metrics
                </h2>
                <p className="text-slate-300 text-sm mt-2 font-medium">Select a metric to analyze performance trends and insights</p>
              </div>
            </div>
            
            <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
              <ScrollArea className="w-full">
                <TabsList className="flex bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 backdrop-blur-md border border-slate-600/50 rounded-2xl p-2 min-w-max shadow-2xl">
                  {availableMetrics.map(metric => (
                    <TabsTrigger 
                      key={metric} 
                      value={metric} 
                      className="relative group data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-2xl hover:bg-gradient-to-br hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-500 rounded-xl py-4 px-6 text-slate-300 font-bold whitespace-nowrap flex-shrink-0 border border-transparent data-[state=active]:border-white/20"
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 rounded-lg bg-white/10 group-data-[state=active]:bg-white/20 transition-all duration-300">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold tracking-wide">{metric}</div>
                          <div className="text-xs opacity-75 mt-1 font-medium">Analysis</div>
                        </div>
                      </div>
                      {/* Active indicator */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-500"></div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>

            {/* Enhanced View Mode Toggle */}
            <div className="mt-6">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'chronological' | 'year-on-year' | 'quarter' | 'comparative')}>
                <ScrollArea className="w-full">
                  <TabsList className="flex bg-gradient-to-r from-slate-700/40 via-slate-600/40 to-slate-700/40 backdrop-blur-md border border-slate-500/50 rounded-xl p-1 min-w-max shadow-xl">
                    <TabsTrigger value="chronological" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 font-bold whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300">
                      Chronological View
                    </TabsTrigger>
                    <TabsTrigger value="year-on-year" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 font-bold whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300">
                      Year-on-Year View
                    </TabsTrigger>
                    <TabsTrigger value="quarter" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 font-bold whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300">
                      Quarter View
                    </TabsTrigger>
                    <TabsTrigger value="comparative" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 font-bold whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300">
                      Comparative Analysis
                    </TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      {selectedMetric && (
        <Card className="overflow-hidden backdrop-blur-md bg-white/90 border border-slate-200/50 shadow-2xl rounded-2xl">
          <div className="p-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b border-slate-500">
            <h3 className="text-xl font-bold text-white tracking-wide">
              {selectedMetric}
              {averageMetrics.includes(selectedMetric) && (
                <span className="ml-2 text-sm bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                  Showing Averages
                </span>
              )}
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              {viewMode === 'chronological' && 'Chronological breakdown by location and trainer'}
              {viewMode === 'year-on-year' && 'Year-on-year comparison by month (Jun to Jan)'}
              {viewMode === 'quarter' && 'Quarterly performance analysis'}
              {viewMode === 'comparative' && 'Comparative analysis across periods'}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {viewMode === 'chronological' ? (
                  <>
                    {/* Year Headers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600" style={{ height: '25px' }}>
                      <th className="px-6 py-1 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          Location / Trainer
                        </div>
                      </th>
                      {sortedYears.map(year => (
                        <th key={year} className="px-4 py-1 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={yearGroups[year].length}>
                          <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                            {year}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-1 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-1 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Month Headers */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 bg-zinc-900" style={{ height: '25px' }}>
                      <th className="px-6 py-1 border-r border-slate-300"></th>
                      {months.map(month => (
                        <th key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                          <div className="bg-white/20 rounded-lg py-1 px-2">
                            {month.label}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-1 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </>
                ) : viewMode === 'year-on-year' ? (
                  <>
                    {/* Year-on-Year Headers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600" style={{ height: '25px' }}>
                      <th className="px-6 py-1 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                          Location / Trainer
                        </div>
                      </th>
                      {yearOnYearGroups.map(group => (
                        <th key={group.monthName} className="px-4 py-1 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={group.columns.length}>
                          <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                            {group.monthName}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-1 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-1 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Year Sub-headers */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500" style={{ height: '25px' }}>
                      <th className="px-6 py-1 border-r border-slate-300"></th>
                      {yearOnYearGroups.map(group => 
                        group.columns.map(month => (
                          <th key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                            <div className="bg-white/20 rounded-lg py-1 px-2">
                              {month.year}
                            </div>
                          </th>
                        ))
                      )}
                      <th className="px-6 py-1 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </>
                ) : viewMode === 'quarter' ? (
                  <>
                    {/* Quarter Headers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600" style={{ height: '25px' }}>
                      <th className="px-6 py-1 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          Location / Trainer
                        </div>
                      </th>
                      {quarterGroups.map(group => (
                        <th key={group.quarterKey} className="px-4 py-1 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={group.columns.length}>
                          <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                            {group.quarterKey}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-1 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-1 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Month Sub-headers */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500" style={{ height: '25px' }}>
                      <th className="px-6 py-1 border-r border-slate-300"></th>
                      {quarterGroups.map(group => 
                        group.columns.map(month => (
                          <th key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                            <div className="bg-white/20 rounded-lg py-1 px-2">
                              {month.label}
                            </div>
                          </th>
                        ))
                      )}
                      <th className="px-6 py-1 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </>
                ) : (
                  <>
                    {/* Comparative Analysis Headers - showing best and worst performers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600" style={{ height: '25px' }}>
                      <th className="px-6 py-1 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                          Location / Trainer
                        </div>
                      </th>
                      <th className="px-4 py-1 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={3}>
                        <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                          Best 3 Months
                        </div>
                      </th>
                      <th className="px-4 py-1 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={3}>
                        <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                          Recent 3 Months
                        </div>
                      </th>
                      <th className="px-6 py-1 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-1 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Sub-headers for comparative */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500" style={{ height: '25px' }}>
                      <th className="px-6 py-1 border-r border-slate-300"></th>
                      {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => (
                        <th key={`${month.key}-${index}`} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                          <div className="bg-white/20 rounded-lg py-1 px-2">
                            {month.label}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-1 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </>
                )}
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([category, categoryData]) => (
                  <React.Fragment key={category}>
                    {/* Category Header Row */}
                    <tr 
                      className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 cursor-pointer hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 transition-all duration-300" 
                      onClick={() => toggleCategory(category)}
                      style={{ height: '25px' }}
                    >
                      <td className="px-6 py-1 text-lg font-bold text-white border-r border-slate-400">
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/20 rounded-full text-white">
                            {expandedCategories.has(category) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          {category.toUpperCase()}
                        </div>
                      </td>
                      {viewMode === 'chronological' ? (
                        <>
                          {months.map((month, index) => {
                            const total = calculateCategoryValue(categoryData, month.key);
                            const previousMonth = index < months.length - 1 ? months[index + 1] : null;
                            const previousTotal = previousMonth ? calculateCategoryValue(categoryData, previousMonth.key) : 0;
                            return (
                              <td key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-400">
                                <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm flex flex-col items-center">
                                  {formatValue(total.toString(), selectedMetric)}
                                  {previousMonth && <GrowthIndicator current={total.toString()} previous={previousTotal.toString()} metricType={selectedMetric} />}
                                </div>
                              </td>
                            );
                          })}
                        </>
                      ) : viewMode === 'year-on-year' ? (
                        <>
                          {yearOnYearGroups.map(group => 
                            group.columns.map((month, index) => {
                              const total = calculateCategoryValue(categoryData, month.key);
                              const previousYearMonth = group.columns.find(m => m.year === month.year - 1);
                              const previousTotal = previousYearMonth ? calculateCategoryValue(categoryData, previousYearMonth.key) : 0;
                              return (
                                <td key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-400">
                                  <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm flex flex-col items-center">
                                    {formatValue(total.toString(), selectedMetric)}
                                    {previousYearMonth && previousTotal > 0 && <GrowthIndicator current={total.toString()} previous={previousTotal.toString()} metricType={selectedMetric} />}
                                  </div>
                                </td>
                              );
                            })
                          )}
                        </>
                      ) : viewMode === 'quarter' ? (
                        <>
                          {quarterGroups.map(group => 
                            group.columns.map(month => {
                              const total = calculateCategoryValue(categoryData, month.key);
                              return (
                                <td key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-400">
                                  <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm flex flex-col items-center">
                                    {formatValue(total.toString(), selectedMetric)}
                                  </div>
                                </td>
                              );
                            })
                          )}
                        </>
                      ) : (
                        <>
                          {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => {
                            const total = calculateCategoryValue(categoryData, month.key);
                            return (
                              <td key={`${month.key}-${index}`} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-slate-400">
                                <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm flex flex-col items-center">
                                  {formatValue(total.toString(), selectedMetric)}
                                </div>
                              </td>
                            );
                          })}
                        </>
                      )}
                      <td className="px-6 py-1 text-center text-base font-bold text-white">
                        <div className="bg-white/30 rounded-lg p-1 backdrop-blur-sm">
                          {formatValue(calculateCategoryTotal(categoryData).toString(), selectedMetric)}
                        </div>
                      </td>
                    </tr>

                    {/* Trainer Rows (Collapsible) */}
                    {expandedCategories.has(category) && categoryData.map((row, index) => (
                      <tr 
                        key={`${category}-${index}`} 
                        className={`${index % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/40'} hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-purple-50/70 transition-all duration-300 hover:shadow-lg border-b border-slate-200/30`}
                        style={{ height: '25px' }}
                      >
                        <td className="px-6 py-1 text-sm border-r border-slate-200/50 pl-16">
                          <div className="flex flex-col border-l-4 border-blue-400/60 pl-4 rounded-r-lg bg-white/40 shadow-sm">
                            <div className="text-sm font-semibold text-black">{row.trainerName}</div>
                            <div className="text-xs text-gray-600 bg-slate-100/60 px-2 rounded-full inline-block">{row.isNew}</div>
                          </div>
                        </td>
                        {viewMode === 'chronological' ? (
                          <>
                            {months.map((month, monthIndex) => {
                              const currentValue = row[month.key] as string;
                              const previousMonth = monthIndex < months.length - 1 ? months[monthIndex + 1] : null;
                              const previousValue = previousMonth ? row[previousMonth.key] as string : '';
                              return (
                                <td key={month.key} className="px-3 py-1 text-center text-sm border-r border-slate-200/50">
                                  <div className="p-1 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                    <span className="text-black font-medium">
                                      {formatValue(currentValue, selectedMetric)}
                                    </span>
                                    {previousMonth && <GrowthIndicator current={currentValue} previous={previousValue} metricType={selectedMetric} />}
                                  </div>
                                </td>
                              );
                            })}
                          </>
                        ) : viewMode === 'year-on-year' ? (
                          <>
                            {yearOnYearGroups.map(group => 
                              group.columns.map(month => {
                                const currentValue = row[month.key] as string;
                                const previousYearMonth = group.columns.find(m => m.year === month.year - 1);
                                const previousValue = previousYearMonth ? row[previousYearMonth.key] as string : '';
                                return (
                                  <td key={month.key} className="px-3 py-1 text-center text-sm border-r border-slate-200/50">
                                    <div className="p-1 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                      <span className="text-black font-medium">
                                        {formatValue(currentValue, selectedMetric)}
                                      </span>
                                      {previousYearMonth && <GrowthIndicator current={currentValue} previous={previousValue} metricType={selectedMetric} />}
                                    </div>
                                  </td>
                                );
                              })
                            )}
                          </>
                        ) : viewMode === 'quarter' ? (
                          <>
                            {quarterGroups.map(group => 
                              group.columns.map(month => {
                                const currentValue = row[month.key] as string;
                                return (
                                  <td key={month.key} className="px-3 py-1 text-center text-sm border-r border-slate-200/50">
                                    <div className="p-1 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                      <span className="text-black font-medium">
                                        {formatValue(currentValue, selectedMetric)}
                                      </span>
                                    </div>
                                  </td>
                                );
                              })
                            )}
                          </>
                        ) : (
                          <>
                            {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => {
                              const currentValue = row[month.key] as string;
                              return (
                                <td key={`${month.key}-${index}`} className="px-3 py-1 text-center text-sm border-r border-slate-200/50">
                                  <div className="p-1 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                    <span className="text-black font-medium">
                                      {formatValue(currentValue, selectedMetric)}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </>
                        )}
                        <td className="px-6 py-1 text-center text-base">
                          <div className="bg-emerald-50/60 rounded-lg p-1">
                            <span className="text-black font-semibold">
                              {formatValue(row.grandTotal, selectedMetric)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                {/* Totals Row */}
                <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 font-bold border-t-4 border-emerald-500 shadow-lg" style={{ height: '25px' }}>
                  <td className="px-6 py-1 text-lg font-bold text-white border-r border-emerald-400">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      {averageMetrics.includes(selectedMetric) ? 'AVERAGES' : 'TOTALS'}
                    </div>
                  </td>
                  {viewMode === 'chronological' ? (
                    <>
                      {months.map(month => (
                        <td key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-emerald-400">
                          <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                            {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                          </div>
                        </td>
                      ))}
                    </>
                  ) : viewMode === 'year-on-year' ? (
                    <>
                      {yearOnYearGroups.map(group => 
                        group.columns.map(month => (
                          <td key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-emerald-400">
                            <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                              {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                            </div>
                          </td>
                        ))
                      )}
                    </>
                  ) : viewMode === 'quarter' ? (
                    <>
                      {quarterGroups.map(group => 
                        group.columns.map(month => (
                          <td key={month.key} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-emerald-400">
                            <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                              {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                            </div>
                          </td>
                        ))
                      )}
                    </>
                  ) : (
                    <>
                      {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => (
                        <td key={`${month.key}-${index}`} className="px-3 py-1 text-center text-sm font-bold text-white border-r border-emerald-400">
                          <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                            {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                          </div>
                        </td>
                      ))}
                    </>
                  )}
                  <td className="px-6 py-1 text-center text-base font-bold text-white">
                    <div className="bg-white/30 rounded-lg p-1 backdrop-blur-sm">
                      {formatValue(calculateGrandTotal().toString(), selectedMetric)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Floating Note Taker - Collapsed by default */}
      {!isPinnedNoteTaker && (
        <div className="fixed bottom-4 right-4 z-40">
          <FloatingNoteTaker
            storageKey={`notes-${selectedMetric}`}
            title={`${selectedMetric} Notes`}
            isPinned={false}
            onPinToggle={setIsPinnedNoteTaker}
          />
        </div>
      )}

      {/* Pinned Note Taker */}
      {isPinnedNoteTaker && selectedMetric && (
        <FloatingNoteTaker
          storageKey={`notes-${selectedMetric}`}
          title={`${selectedMetric} Notes`}
          isPinned={true}
          onPinToggle={setIsPinnedNoteTaker}
        />
      )}
    </div>
  );
};

export default MetricsTable;
