
import React, { useState } from 'react';
import { MetricData } from '@/utils/csvParser';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MetricsTableProps {
  data: MetricData[];
  metric: string;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ data, metric }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const metricData = data.filter(item => item.metric === metric);
  
  if (metricData.length === 0) return null;

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
    
    if (metricType.toLowerCase().includes('sales') || 
        metricType.toLowerCase().includes('amount') || 
        metricType.toLowerCase().includes('vat') || 
        metricType.toLowerCase().includes('value') ||
        metricType.toLowerCase().includes('discount amount')) {
      return <span className={`font-bold ${numValue < 0 ? 'text-red-600' : 'text-gray-900'}`}>{formatCurrency(numValue)}</span>;
    } else if (metricType.toLowerCase().includes('percentage')) {
      return <span className="text-gray-900 font-bold">{formatPercentage(numValue)}</span>;
    } else {
      return <span className="text-gray-900 font-bold">{formatNumber(numValue)}</span>;
    }
  };

  // All 23 months in descending order (2025-May to 2023-Jul)
  const months = [
    { key: '2025-may' as keyof MetricData, label: 'May 25', quarter: 'Q2', year: 2025 },
    { key: '2025-apr' as keyof MetricData, label: 'Apr 25', quarter: 'Q2', year: 2025 },
    { key: '2025-mar' as keyof MetricData, label: 'Mar 25', quarter: 'Q1', year: 2025 },
    { key: '2025-feb' as keyof MetricData, label: 'Feb 25', quarter: 'Q1', year: 2025 },
    { key: '2025-jan' as keyof MetricData, label: 'Jan 25', quarter: 'Q1', year: 2025 },
    { key: '2024-dec' as keyof MetricData, label: 'Dec 24', quarter: 'Q4', year: 2024 },
    { key: '2024-nov' as keyof MetricData, label: 'Nov 24', quarter: 'Q4', year: 2024 },
    { key: '2024-oct' as keyof MetricData, label: 'Oct 24', quarter: 'Q4', year: 2024 },
    { key: '2024-sep' as keyof MetricData, label: 'Sep 24', quarter: 'Q3', year: 2024 },
    { key: '2024-aug' as keyof MetricData, label: 'Aug 24', quarter: 'Q3', year: 2024 },
    { key: '2024-jul' as keyof MetricData, label: 'Jul 24', quarter: 'Q3', year: 2024 },
    { key: '2024-jun' as keyof MetricData, label: 'Jun 24', quarter: 'Q2', year: 2024 },
    { key: '2024-may' as keyof MetricData, label: 'May 24', quarter: 'Q2', year: 2024 },
    { key: '2024-apr' as keyof MetricData, label: 'Apr 24', quarter: 'Q2', year: 2024 },
    { key: '2024-mar' as keyof MetricData, label: 'Mar 24', quarter: 'Q1', year: 2024 },
    { key: '2024-feb' as keyof MetricData, label: 'Feb 24', quarter: 'Q1', year: 2024 },
    { key: '2024-jan' as keyof MetricData, label: 'Jan 24', quarter: 'Q1', year: 2024 },
    { key: '2023-dec' as keyof MetricData, label: 'Dec 23', quarter: 'Q4', year: 2023 },
    { key: '2023-nov' as keyof MetricData, label: 'Nov 23', quarter: 'Q4', year: 2023 },
    { key: '2023-oct' as keyof MetricData, label: 'Oct 23', quarter: 'Q4', year: 2023 },
    { key: '2023-sep' as keyof MetricData, label: 'Sep 23', quarter: 'Q3', year: 2023 },
    { key: '2023-aug' as keyof MetricData, label: 'Aug 23', quarter: 'Q3', year: 2023 },
    { key: '2023-jul' as keyof MetricData, label: 'Jul 23', quarter: 'Q3', year: 2023 }
  ];

  // Group months by year for header display
  const yearGroups = months.reduce((acc, month) => {
    if (!acc[month.year]) acc[month.year] = [];
    acc[month.year].push(month);
    return acc;
  }, {} as Record<number, typeof months>);

  // Group data by category
  const groupedData = metricData.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MetricData[]>);

  return (
    <Card className="mb-8 overflow-hidden backdrop-blur-md bg-white/90 border border-slate-200/50 shadow-2xl rounded-2xl">
      <div className="p-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600">
        <h3 className="text-2xl font-bold text-white tracking-wide">{metric}</h3>
        <p className="text-slate-300 text-sm mt-1">Performance metrics breakdown by category and product</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {/* Year Headers */}
            <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600">
              <th className="px-6 py-4 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  Category / Product
                </div>
              </th>
              {Object.entries(yearGroups).map(([year, yearMonths]) => (
                <th 
                  key={year} 
                  className="px-4 py-4 text-center text-lg font-bold text-white border-r border-slate-400"
                  colSpan={yearMonths.length}
                >
                  <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                    {year}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-center text-lg font-bold text-white">
                <div className="bg-emerald-500/80 rounded-lg p-2 backdrop-blur-sm">
                  Total
                </div>
              </th>
            </tr>
            
            {/* Month Headers */}
            <tr className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500">
              <th className="px-6 py-3 border-r border-slate-300"></th>
              {months.map(month => (
                <th 
                  key={month.key} 
                  className="px-3 py-3 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]"
                >
                  <div className="bg-white/20 rounded-lg py-1 px-2">
                    {month.label}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-center text-sm font-bold text-white"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([category, categoryData]) => (
              <React.Fragment key={category}>
                {/* Category Header Row */}
                <tr 
                  className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 cursor-pointer hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 transition-all duration-300"
                  onClick={() => toggleCategory(category)}
                >
                  <td className="px-6 py-4 text-lg font-bold text-white border-r border-slate-400">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-white/20 rounded-full text-white"
                      >
                        {expandedCategories.has(category) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      {category.toUpperCase()}
                    </div>
                  </td>
                  {months.map(month => {
                    const total = categoryData.reduce((sum, item) => {
                      const value = parseFloat((item[month.key] as string).replace(/[₹,]/g, '')) || 0;
                      return sum + value;
                    }, 0);
                    return (
                      <td 
                        key={month.key} 
                        className="px-3 py-4 text-center text-sm font-bold text-white border-r border-slate-400"
                      >
                        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                          {formatValue(total.toString(), metric)}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-center text-base font-bold text-white">
                    <div className="bg-white/30 rounded-lg p-2 backdrop-blur-sm">
                      {(() => {
                        const total = categoryData.reduce((sum, item) => {
                          const value = parseFloat(item.total.replace(/[₹,]/g, '')) || 0;
                          return sum + value;
                        }, 0);
                        return formatValue(total.toString(), metric);
                      })()}
                    </div>
                  </td>
                </tr>

                {/* Product Rows (Collapsible) */}
                {expandedCategories.has(category) && categoryData.map((row, index) => (
                  <tr 
                    key={`${category}-${index}`} 
                    className={`${index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg border-b border-slate-200/50`}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 border-r border-slate-200/50 pl-16">
                      <div className="flex flex-col border-l-4 border-blue-400 pl-4 py-1 rounded-r-lg bg-white/60 shadow-sm">
                        <div className="text-base font-bold">{row.product}</div>
                        <div className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full inline-block mt-1">{category}</div>
                      </div>
                    </td>
                    {months.map(month => (
                      <td 
                        key={month.key} 
                        className="px-3 py-4 text-center text-sm border-r border-slate-200/50"
                      >
                        <div className="p-2 rounded-lg hover:bg-white/80 transition-all duration-200">
                          {formatValue(row[month.key] as string, metric)}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center text-base font-bold text-slate-900">
                      <div className="bg-emerald-50 rounded-lg p-2">
                        {formatValue(row.total, metric)}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MetricsTable;
