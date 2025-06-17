import React, { useState } from 'react';
import { MetricData, getUniqueMetrics } from '@/utils/csvParser';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, BarChart3, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
interface MetricsTableProps {
  data: MetricData[];
}
const MetricsTable: React.FC<MetricsTableProps> = ({
  data
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [viewMode, setViewMode] = useState<'chronological' | 'year-on-year' | 'quarter' | 'comparative'>('chronological');
  const availableMetrics = getUniqueMetrics(data);

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
      return <span className="text-gray-900 font-bold">{formatPercentage(numValue)}</span>;
    } else {
      return <span className="text-gray-900 font-bold">{formatNumber(numValue)}</span>;
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
      return <div className="flex items-center gap-1 text-gray-400 ml-1">
          <Minus className="w-3 h-3" />
          <span className="text-xs">0%</span>
        </div>;
    }
    return <div className={`flex items-center gap-1 ml-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span className="text-xs font-medium">{Math.abs(growth).toFixed(1)}%</span>
      </div>;
  };
  const metricData = data.filter(item => item.metric === selectedMetric);

  // All 23 months in descending order (2025-May to 2023-Jul)
  const allMonths = [{
    key: '2025-may' as keyof MetricData,
    label: 'May 25',
    quarter: 'Q2',
    year: 2025,
    month: 5
  }, {
    key: '2025-apr' as keyof MetricData,
    label: 'Apr 25',
    quarter: 'Q2',
    year: 2025,
    month: 4
  }, {
    key: '2025-mar' as keyof MetricData,
    label: 'Mar 25',
    quarter: 'Q1',
    year: 2025,
    month: 3
  }, {
    key: '2025-feb' as keyof MetricData,
    label: 'Feb 25',
    quarter: 'Q1',
    year: 2025,
    month: 2
  }, {
    key: '2025-jan' as keyof MetricData,
    label: 'Jan 25',
    quarter: 'Q1',
    year: 2025,
    month: 1
  }, {
    key: '2024-dec' as keyof MetricData,
    label: 'Dec 24',
    quarter: 'Q4',
    year: 2024,
    month: 12
  }, {
    key: '2024-nov' as keyof MetricData,
    label: 'Nov 24',
    quarter: 'Q4',
    year: 2024,
    month: 11
  }, {
    key: '2024-oct' as keyof MetricData,
    label: 'Oct 24',
    quarter: 'Q4',
    year: 2024,
    month: 10
  }, {
    key: '2024-sep' as keyof MetricData,
    label: 'Sep 24',
    quarter: 'Q3',
    year: 2024,
    month: 9
  }, {
    key: '2024-aug' as keyof MetricData,
    label: 'Aug 24',
    quarter: 'Q3',
    year: 2024,
    month: 8
  }, {
    key: '2024-jul' as keyof MetricData,
    label: 'Jul 24',
    quarter: 'Q3',
    year: 2024,
    month: 7
  }, {
    key: '2024-jun' as keyof MetricData,
    label: 'Jun 24',
    quarter: 'Q2',
    year: 2024,
    month: 6
  }, {
    key: '2024-may' as keyof MetricData,
    label: 'May 24',
    quarter: 'Q2',
    year: 2024,
    month: 5
  }, {
    key: '2024-apr' as keyof MetricData,
    label: 'Apr 24',
    quarter: 'Q2',
    year: 2024,
    month: 4
  }, {
    key: '2024-mar' as keyof MetricData,
    label: 'Mar 24',
    quarter: 'Q1',
    year: 2024,
    month: 3
  }, {
    key: '2024-feb' as keyof MetricData,
    label: 'Feb 24',
    quarter: 'Q1',
    year: 2024,
    month: 2
  }, {
    key: '2024-jan' as keyof MetricData,
    label: 'Jan 24',
    quarter: 'Q1',
    year: 2024,
    month: 1
  }, {
    key: '2023-dec' as keyof MetricData,
    label: 'Dec 23',
    quarter: 'Q4',
    year: 2023,
    month: 12
  }, {
    key: '2023-nov' as keyof MetricData,
    label: 'Nov 23',
    quarter: 'Q4',
    year: 2023,
    month: 11
  }, {
    key: '2023-oct' as keyof MetricData,
    label: 'Oct 23',
    quarter: 'Q4',
    year: 2023,
    month: 10
  }, {
    key: '2023-sep' as keyof MetricData,
    label: 'Sep 23',
    quarter: 'Q3',
    year: 2023,
    month: 9
  }, {
    key: '2023-aug' as keyof MetricData,
    label: 'Aug 23',
    quarter: 'Q3',
    year: 2023,
    month: 8
  }, {
    key: '2023-jul' as keyof MetricData,
    label: 'Jul 23',
    quarter: 'Q3',
    year: 2023,
    month: 7
  }];

  // Year-on-year view: group by month name, sort by year descending, then sort months May-Jan
  const getYearOnYearMonths = () => {
    const monthGroups: {
      [monthName: string]: typeof allMonths;
    } = {};
    allMonths.forEach(month => {
      const monthName = month.label.split(' ')[0]; // Extract month name (e.g., "May", "Apr")
      if (!monthGroups[monthName]) {
        monthGroups[monthName] = [];
      }
      monthGroups[monthName].push(month);
    });

    // Sort each month group by year descending
    Object.keys(monthGroups).forEach(monthName => {
      monthGroups[monthName].sort((a, b) => b.year - a.year);
    });

    // Return months in May-Jan order (May first, Jan last)
    const monthOrder = ['May', 'Apr', 'Mar', 'Feb', 'Jan', 'Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun'];
    return monthOrder.map(monthName => ({
      monthName,
      columns: monthGroups[monthName] || []
    })).filter(group => group.columns.length > 0);
  };

  // Quarter view: group by quarters
  const getQuarterGroups = () => {
    const quarterGroups: {
      [key: string]: typeof allMonths;
    } = {};
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

  // Group months by year (in descending order: 2025, 2024, 2023)
  const yearGroups = allMonths.reduce((acc, month) => {
    if (!acc[month.year]) acc[month.year] = [];
    acc[month.year].push(month);
    return acc;
  }, {} as Record<number, typeof allMonths>);

  // Sort years in descending order
  const sortedYears = Object.keys(yearGroups).map(Number).sort((a, b) => b - a);

  // Group data by category
  const groupedData = metricData.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MetricData[]>);

  // Calculate totals for each month
  const calculateMonthTotal = (monthKey: string) => {
    return metricData.reduce((sum, item) => {
      const value = parseFloat((item[monthKey as keyof MetricData] as string)?.replace(/[₹,]/g, '') || '0');
      return sum + value;
    }, 0);
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return metricData.reduce((sum, item) => {
      const value = parseFloat(item.total.replace(/[₹,]/g, '') || '0');
      return sum + value;
    }, 0);
  };
  if (availableMetrics.length === 0) {
    return <Card className="p-8 text-center">
        <p className="text-gray-500">No metrics data available</p>
      </Card>;
  }
  return <div className="space-y-6">
      {/* Metrics Selector */}
      <Card className="backdrop-blur-md bg-white/95 border border-slate-200/50 shadow-xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Performance Metrics</h2>
              <p className="text-slate-300 text-sm">Select a metric to analyze performance trends</p>
            </div>
          </div>
          
          <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
            <ScrollArea className="w-full">
              <TabsList className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 min-w-max">
                {availableMetrics.map(metric => <TabsTrigger key={metric} value={metric} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/10 transition-all duration-300 rounded-lg py-3 px-4 text-white font-semibold whitespace-nowrap flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">{metric}</span>
                    </div>
                  </TabsTrigger>)}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Tabs>

          {/* View Mode Toggle */}
          <div className="mt-4">
            <Tabs value={viewMode} onValueChange={value => setViewMode(value as 'chronological' | 'year-on-year' | 'quarter' | 'comparative')}>
              <ScrollArea className="w-full">
                <TabsList className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 min-w-max">
                  <TabsTrigger value="chronological" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600 data-[state=active]:text-white text-white font-semibold whitespace-nowrap flex-shrink-0">
                    Chronological View
                  </TabsTrigger>
                  <TabsTrigger value="year-on-year" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white text-white font-semibold whitespace-nowrap flex-shrink-0">
                    Year-on-Year View
                  </TabsTrigger>
                  <TabsTrigger value="quarter" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-white font-semibold whitespace-nowrap flex-shrink-0">
                    Quarter View
                  </TabsTrigger>
                  <TabsTrigger value="comparative" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white font-semibold whitespace-nowrap flex-shrink-0">
                    Comparative Analysis
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      {selectedMetric && <Card className="overflow-hidden backdrop-blur-md bg-white/90 border border-slate-200/50 shadow-2xl rounded-2xl">
          <div className="p-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b border-slate-500">
            <h3 className="text-xl font-bold text-white tracking-wide">{selectedMetric}</h3>
            <p className="text-slate-300 text-sm mt-1">
              {viewMode === 'chronological' && 'Chronological breakdown by category and product'}
              {viewMode === 'year-on-year' && 'Year-on-year comparison by month (May to Jan)'}
              {viewMode === 'quarter' && 'Quarterly performance analysis'}
              {viewMode === 'comparative' && 'Comparative analysis across periods'}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {viewMode === 'chronological' ? <>
                    {/* Year Headers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600">
                      <th className="px-6 py-4 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          Category / Product
                        </div>
                      </th>
                      {sortedYears.map(year => <th key={year} className="px-4 py-4 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={yearGroups[year].length}>
                          <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                            {year}
                          </div>
                        </th>)}
                      <th className="px-6 py-4 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-2 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Month Headers */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500">
                      <th className="px-6 py-3 border-r border-slate-300"></th>
                      {months.map(month => <th key={month.key} className="px-3 py-3 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                          <div className="bg-white/20 rounded-lg py-1 px-2">
                            {month.label}
                          </div>
                        </th>)}
                      <th className="px-6 py-3 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </> : viewMode === 'year-on-year' ? <>
                    {/* Year-on-Year Headers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600">
                      <th className="px-6 py-4 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                          Category / Product
                        </div>
                      </th>
                      {yearOnYearGroups.map(group => <th key={group.monthName} className="px-4 py-4 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={group.columns.length}>
                          <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                            {group.monthName}
                          </div>
                        </th>)}
                      <th className="px-6 py-4 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-2 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Year Sub-headers */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500">
                      <th className="px-6 py-3 border-r border-slate-300"></th>
                      {yearOnYearGroups.map(group => group.columns.map(month => <th key={month.key} className="px-3 py-3 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                            <div className="bg-white/20 rounded-lg py-1 px-2">
                              {month.year}
                            </div>
                          </th>))}
                      <th className="px-6 py-3 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </> : viewMode === 'quarter' ? <>
                    {/* Quarter Headers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600">
                      <th className="px-6 py-4 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          Category / Product
                        </div>
                      </th>
                      {quarterGroups.map(group => <th key={group.quarterKey} className="px-4 py-4 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={group.columns.length}>
                          <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                            {group.quarterKey}
                          </div>
                        </th>)}
                      <th className="px-6 py-4 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-2 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Month Sub-headers */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500">
                      <th className="px-6 py-3 border-r border-slate-300"></th>
                      {quarterGroups.map(group => group.columns.map(month => <th key={month.key} className="px-3 py-3 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                            <div className="bg-white/20 rounded-lg py-1 px-2">
                              {month.label}
                            </div>
                          </th>))}
                      <th className="px-6 py-3 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </> : <>
                    {/* Comparative Analysis Headers - showing best and worst performers */}
                    <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600">
                      <th className="px-6 py-4 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                          Category / Product
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={3}>
                        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                          Best 3 Months
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-lg font-bold text-white border-r border-slate-400" colSpan={3}>
                        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                          Recent 3 Months
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-lg font-bold text-white">
                        <div className="bg-emerald-500/80 rounded-lg p-2 backdrop-blur-sm">
                          Total
                        </div>
                      </th>
                    </tr>
                    
                    {/* Sub-headers for comparative */}
                    <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500">
                      <th className="px-6 py-3 border-r border-slate-300"></th>
                      {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => <th key={`${month.key}-${index}`} className="px-3 py-3 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]">
                          <div className="bg-white/20 rounded-lg py-1 px-2">
                            {month.label}
                          </div>
                        </th>)}
                      <th className="px-6 py-3 text-center text-sm font-bold text-white"></th>
                    </tr>
                  </>}
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([category, categoryData]) => <React.Fragment key={category}>
                    {/* Category Header Row */}
                    <tr className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 cursor-pointer hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 transition-all duration-300" onClick={() => toggleCategory(category)}>
                      <td className="px-6 py-4 text-lg font-bold text-slate-100 border-r border-slate-400">
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/20 rounded-full text-slate-100">
                            {expandedCategories.has(category) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          {category.toUpperCase()}
                        </div>
                      </td>
                      {viewMode === 'chronological' ? <>
                          {months.map((month, index) => {
                    const total = categoryData.reduce((sum, item) => {
                      const value = parseFloat((item[month.key] as string).replace(/[₹,]/g, '')) || 0;
                      return sum + value;
                    }, 0);
                    const previousMonth = index < months.length - 1 ? months[index + 1] : null;
                    const previousTotal = previousMonth ? categoryData.reduce((sum, item) => {
                      const value = parseFloat((item[previousMonth.key] as string).replace(/[₹,]/g, '')) || 0;
                      return sum + value;
                    }, 0) : 0;
                    return <td key={month.key} className="px-3 py-4 text-center text-sm font-bold text-slate-100 border-r border-slate-400">
                                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm flex flex-col items-center">
                                  {formatValue(total.toString(), selectedMetric)}
                                  {previousMonth && <GrowthIndicator current={total.toString()} previous={previousTotal.toString()} metricType={selectedMetric} />}
                                </div>
                              </td>;
                  })}
                        </> : viewMode === 'year-on-year' ? <>
                          {yearOnYearGroups.map(group => group.columns.map((month, index) => {
                    const total = categoryData.reduce((sum, item) => {
                      const value = parseFloat((item[month.key] as string).replace(/[₹,]/g, '')) || 0;
                      return sum + value;
                    }, 0);
                    const previousYearMonth = group.columns.find(m => m.year === month.year - 1);
                    const previousTotal = previousYearMonth ? categoryData.reduce((sum, item) => {
                      const value = parseFloat((item[previousYearMonth.key] as string).replace(/[₹,]/g, '')) || 0;
                      return sum + value;
                    }, 0) : 0;
                    return <td key={month.key} className="px-3 py-4 text-center text-sm font-bold text-slate-100 border-r border-slate-400">
                                  <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm flex flex-col items-center">
                                    {formatValue(total.toString(), selectedMetric)}
                                    {previousYearMonth && previousTotal > 0 && <GrowthIndicator current={total.toString()} previous={previousTotal.toString()} metricType={selectedMetric} />}
                                  </div>
                                </td>;
                  }))}
                        </> : viewMode === 'quarter' ? <>
                          {quarterGroups.map(group => group.columns.map(month => {
                    const total = categoryData.reduce((sum, item) => {
                      const value = parseFloat((item[month.key] as string).replace(/[₹,]/g, '')) || 0;
                      return sum + value;
                    }, 0);
                    return <td key={month.key} className="px-3 py-4 text-center text-sm font-bold text-slate-100 border-r border-slate-400">
                                  <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm flex flex-col items-center">
                                    {formatValue(total.toString(), selectedMetric)}
                                  </div>
                                </td>;
                  }))}
                        </> : <>
                          {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => {
                    const total = categoryData.reduce((sum, item) => {
                      const value = parseFloat((item[month.key] as string).replace(/[₹,]/g, '')) || 0;
                      return sum + value;
                    }, 0);
                    return <td key={`${month.key}-${index}`} className="px-3 py-4 text-center text-sm font-bold text-slate-100 border-r border-slate-400">
                                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm flex flex-col items-center">
                                  {formatValue(total.toString(), selectedMetric)}
                                </div>
                              </td>;
                  })}
                        </>}
                      <td className="px-6 py-4 text-center text-base font-bold text-slate-100">
                        <div className="bg-white/30 rounded-lg p-2 backdrop-blur-sm">
                          {(() => {
                      const total = categoryData.reduce((sum, item) => {
                        const value = parseFloat(item.total.replace(/[₹,]/g, '')) || 0;
                        return sum + value;
                      }, 0);
                      return formatValue(total.toString(), selectedMetric);
                    })()}
                        </div>
                      </td>
                    </tr>

                    {/* Product Rows (Collapsible) */}
                    {expandedCategories.has(category) && categoryData.map((row, index) => <tr key={`${category}-${index}`} className={`${index % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/40'} hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-purple-50/70 transition-all duration-300 hover:shadow-lg border-b border-slate-200/30`}>
                        <td className="px-6 py-4 text-sm border-r border-slate-200/50 pl-16">
                          <div className="flex flex-col border-l-4 border-blue-400/60 pl-4 py-1 rounded-r-lg bg-white/40 shadow-sm">
                            <div className="text-base font-semibold text-slate-700">{row.product}</div>
                            <div className="text-xs text-slate-500 bg-slate-100/60 px-2 py-1 rounded-full inline-block mt-1">{category}</div>
                          </div>
                        </td>
                        {viewMode === 'chronological' ? <>
                            {months.map((month, monthIndex) => {
                    const currentValue = row[month.key] as string;
                    const previousMonth = monthIndex < months.length - 1 ? months[monthIndex + 1] : null;
                    const previousValue = previousMonth ? row[previousMonth.key] as string : '';
                    return <td key={month.key} className="px-3 py-4 text-center text-sm border-r border-slate-200/50">
                                  <div className="p-2 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                    <span className="text-slate-600 font-medium">
                                      {formatValue(currentValue, selectedMetric)}
                                    </span>
                                    {previousMonth && <GrowthIndicator current={currentValue} previous={previousValue} metricType={selectedMetric} />}
                                  </div>
                                </td>;
                  })}
                          </> : viewMode === 'year-on-year' ? <>
                            {yearOnYearGroups.map(group => group.columns.map(month => {
                    const currentValue = row[month.key] as string;
                    const previousYearMonth = group.columns.find(m => m.year === month.year - 1);
                    const previousValue = previousYearMonth ? row[previousYearMonth.key] as string : '';
                    return <td key={month.key} className="px-3 py-4 text-center text-sm border-r border-slate-200/50">
                                    <div className="p-2 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                      <span className="text-slate-600 font-medium">
                                        {formatValue(currentValue, selectedMetric)}
                                      </span>
                                      {previousYearMonth && <GrowthIndicator current={currentValue} previous={previousValue} metricType={selectedMetric} />}
                                    </div>
                                  </td>;
                  }))}
                          </> : viewMode === 'quarter' ? <>
                            {quarterGroups.map(group => group.columns.map(month => {
                    const currentValue = row[month.key] as string;
                    return <td key={month.key} className="px-3 py-4 text-center text-sm border-r border-slate-200/50">
                                    <div className="p-2 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                      <span className="text-slate-600 font-medium">
                                        {formatValue(currentValue, selectedMetric)}
                                      </span>
                                    </div>
                                  </td>;
                  }))}
                          </> : <>
                            {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => {
                    const currentValue = row[month.key] as string;
                    return <td key={`${month.key}-${index}`} className="px-3 py-4 text-center text-sm border-r border-slate-200/50">
                                  <div className="p-2 rounded-lg hover:bg-white/60 transition-all duration-200 flex flex-col items-center">
                                    <span className="text-slate-600 font-medium">
                                      {formatValue(currentValue, selectedMetric)}
                                    </span>
                                  </div>
                                </td>;
                  })}
                          </>}
                        <td className="px-6 py-4 text-center text-base">
                          <div className="bg-emerald-50/60 rounded-lg p-2">
                            <span className="text-slate-600 font-semibold">
                              {formatValue(row.total, selectedMetric)}
                            </span>
                          </div>
                        </td>
                      </tr>)}
                  </React.Fragment>)}

                {/* Totals Row */}
                <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 font-bold border-t-4 border-emerald-500 shadow-lg">
                  <td className="px-6 py-4 text-lg font-bold text-white border-r border-emerald-400">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      TOTALS
                    </div>
                  </td>
                  {viewMode === 'chronological' ? <>
                      {months.map(month => <td key={month.key} className="px-3 py-4 text-center text-sm font-bold text-white border-r border-emerald-400">
                          <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                            {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                          </div>
                        </td>)}
                    </> : viewMode === 'year-on-year' ? <>
                      {yearOnYearGroups.map(group => group.columns.map(month => <td key={month.key} className="px-3 py-4 text-center text-sm font-bold text-white border-r border-emerald-400">
                            <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                              {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                            </div>
                          </td>))}
                    </> : viewMode === 'quarter' ? <>
                      {quarterGroups.map(group => group.columns.map(month => <td key={month.key} className="px-3 py-4 text-center text-sm font-bold text-white border-r border-emerald-400">
                            <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                              {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                            </div>
                          </td>))}
                    </> : <>
                      {[...months.slice(0, 3), ...months.slice(0, 3)].map((month, index) => <td key={`${month.key}-${index}`} className="px-3 py-4 text-center text-sm font-bold text-white border-r border-emerald-400">
                          <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                            {formatValue(calculateMonthTotal(month.key).toString(), selectedMetric)}
                          </div>
                        </td>)}
                    </>}
                  <td className="px-6 py-4 text-center text-base font-bold text-white">
                    <div className="bg-white/30 rounded-lg p-2 backdrop-blur-sm">
                      {formatValue(calculateGrandTotal().toString(), selectedMetric)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>}
    </div>;
};
export default MetricsTable;