
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
    if (!value || value === '') return <span className="text-gray-400">-</span>;
    
    const numValue = parseFloat(value);
    if (numValue === 0) return <span className="text-gray-400">₹0</span>;
    
    if (metricType.includes('Sales') || metricType.includes('Amount') || metricType.includes('VAT') || metricType.includes('Value')) {
      return formatCurrency(numValue);
    } else if (metricType.includes('Percentage')) {
      return formatPercentage(numValue);
    } else {
      return formatNumber(numValue);
    }
  };

  const calculateTotal = (field: keyof MetricData) => {
    return metricData.reduce((sum, item) => {
      const value = parseFloat(item[field] as string) || 0;
      return sum + value;
    }, 0);
  };

  const months = [
    { key: 'jan' as keyof MetricData, label: 'Jan', quarter: 'Q1' },
    { key: 'feb' as keyof MetricData, label: 'Feb', quarter: 'Q1' },
    { key: 'mar' as keyof MetricData, label: 'Mar', quarter: 'Q1' },
    { key: 'apr' as keyof MetricData, label: 'Apr', quarter: 'Q2' },
    { key: 'may' as keyof MetricData, label: 'May', quarter: 'Q2' },
    { key: 'jun' as keyof MetricData, label: 'Jun', quarter: 'Q2' },
    { key: 'jul' as keyof MetricData, label: 'Jul', quarter: 'Q3' },
    { key: 'aug' as keyof MetricData, label: 'Aug', quarter: 'Q3' },
    { key: 'sep' as keyof MetricData, label: 'Sep', quarter: 'Q3' },
    { key: 'oct' as keyof MetricData, label: 'Oct', quarter: 'Q4' },
    { key: 'nov' as keyof MetricData, label: 'Nov', quarter: 'Q4' },
    { key: 'dec' as keyof MetricData, label: 'Dec', quarter: 'Q4' }
  ];

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <Card className="mb-6 overflow-hidden backdrop-blur-md bg-white/70 border border-white/20 shadow-xl">
      <div className="p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-b border-white/20">
        <h3 className="text-lg font-semibold text-gray-800">{metric}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-white/20">
                Package
              </th>
              {quarters.map(quarter => (
                <th 
                  key={quarter} 
                  className="px-2 py-3 text-center text-sm font-semibold text-gray-700 border-r border-white/20"
                  colSpan={3}
                >
                  {quarter}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Total
              </th>
            </tr>
            <tr className="bg-gradient-to-r from-gray-25/80 to-gray-50/80">
              <th className="px-4 py-2 border-r border-white/20"></th>
              {quarters.map(quarter => 
                months
                  .filter(month => month.quarter === quarter)
                  .map(month => (
                    <th 
                      key={month.key} 
                      className="px-2 py-2 text-center text-xs font-medium text-gray-600 border-r border-white/10 min-w-[100px]"
                    >
                      {month.label}
                    </th>
                  ))
              )}
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {metricData.map((row, index) => (
              <tr 
                key={index} 
                className={`${index % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/40'} hover:bg-white/60 transition-all duration-200`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-800 border-r border-white/20">
                  {row.package}
                </td>
                {months.map(month => (
                  <td 
                    key={month.key} 
                    className="px-2 py-3 text-center text-sm text-gray-700 border-r border-white/10"
                  >
                    {formatValue(row[month.key] as string, metric)}
                  </td>
                ))}
                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  {formatValue(row.total, metric)}
                </td>
              </tr>
            ))}
            
            {/* Totals Row */}
            <tr className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 border-t-2 border-blue-200/50">
              <td className="px-4 py-3 text-sm font-bold text-gray-800 border-r border-white/20">
                TOTAL
              </td>
              {months.map(month => (
                <td 
                  key={month.key} 
                  className="px-2 py-3 text-center text-sm font-semibold text-gray-800 border-r border-white/10"
                >
                  {formatValue(calculateTotal(month.key).toString(), metric)}
                </td>
              ))}
              <td className="px-4 py-3 text-center text-sm font-bold text-gray-800">
                {formatValue(calculateTotal('total' as keyof MetricData).toString(), metric)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MetricsTable;
