
import React from 'react';
import { MetricData } from '@/utils/csvParser';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';
import { Card } from '@/components/ui/card';

interface MetricsTableProps {
  data: MetricData[];
  metric: string;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ data, metric }) => {
  const metricData = data.filter(item => item.metric === metric);
  
  if (metricData.length === 0) return null;

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

  // Sort months in descending order (Dec to Jan)
  const months = [
    { key: 'dec' as keyof MetricData, label: 'Dec', quarter: 'Q4' },
    { key: 'nov' as keyof MetricData, label: 'Nov', quarter: 'Q4' },
    { key: 'oct' as keyof MetricData, label: 'Oct', quarter: 'Q4' },
    { key: 'sep' as keyof MetricData, label: 'Sep', quarter: 'Q3' },
    { key: 'aug' as keyof MetricData, label: 'Aug', quarter: 'Q3' },
    { key: 'jul' as keyof MetricData, label: 'Jul', quarter: 'Q3' },
    { key: 'jun' as keyof MetricData, label: 'Jun', quarter: 'Q2' },
    { key: 'may' as keyof MetricData, label: 'May', quarter: 'Q2' },
    { key: 'apr' as keyof MetricData, label: 'Apr', quarter: 'Q2' },
    { key: 'mar' as keyof MetricData, label: 'Mar', quarter: 'Q1' },
    { key: 'feb' as keyof MetricData, label: 'Feb', quarter: 'Q1' },
    { key: 'jan' as keyof MetricData, label: 'Jan', quarter: 'Q1' }
  ];

  const quarters = ['Q4', 'Q3', 'Q2', 'Q1'];

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
      
      {Object.entries(groupedData).map(([category, categoryData]) => (
        <div key={category} className="mb-6 last:mb-0">
          <div className="p-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b border-slate-500">
            <h4 className="text-lg font-bold text-white tracking-wide">{category}</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {/* Quarter Headers */}
                <tr className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600">
                  <th className="px-6 py-4 text-left text-lg font-bold text-white border-r border-slate-400 min-w-[300px]">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      Product
                    </div>
                  </th>
                  {quarters.map(quarter => (
                    <th 
                      key={quarter} 
                      className="px-4 py-4 text-center text-lg font-bold text-white border-r border-slate-400"
                      colSpan={3}
                    >
                      <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                        {quarter}
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
                  {quarters.map(quarter => 
                    months
                      .filter(month => month.quarter === quarter)
                      .map(month => (
                        <th 
                          key={month.key} 
                          className="px-3 py-3 text-center text-sm font-bold text-white border-r border-slate-300 min-w-[120px]"
                        >
                          <div className="bg-white/20 rounded-lg py-1 px-2">
                            {month.label}
                          </div>
                        </th>
                      ))
                  )}
                  <th className="px-6 py-3 text-center text-sm font-bold text-white"></th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`${index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg border-b border-slate-200/50`}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 border-r border-slate-200/50">
                      <div className="flex flex-col">
                        <div className="text-base font-bold">{row.package}</div>
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
                
                {/* Category Totals Row */}
                <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 border-t-4 border-emerald-500 shadow-lg">
                  <td className="px-6 py-4 text-base font-bold text-white border-r border-emerald-400">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      {category.toUpperCase()} TOTAL
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
                        className="px-3 py-4 text-center text-sm font-bold text-white border-r border-emerald-400"
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
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default MetricsTable;
