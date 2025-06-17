
"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Edit, Plus, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MembershipData {
  id: string;
  membershipName: string;
  membershipType: string;
  subRows?: MembershipData[];
  [key: string]: any;
}

interface Metric {
  id: string;
  name: string;
  category: string;
}

interface SummaryPoint {
  id: string;
  text: string;
}

interface NestedDataTableProps {
  data?: MembershipData[];
  className?: string;
}

const generateMonthColumns = () => {
  const columns = [];
  const currentDate = new Date(2025, 5, 1); // June 2025
  
  for (let i = 0; i < 18; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    columns.push({
      key: monthYear.replace(' ', '-').toLowerCase(),
      header: monthYear,
      year: date.getFullYear(),
      quarter: Math.floor(date.getMonth() / 3) + 1
    });
  }
  
  return columns;
};

const availableMetrics: Metric[] = [
  { id: "revenue", name: "Revenue", category: "Financial" },
  { id: "customers", name: "Active Customers", category: "Growth" },
  { id: "retention", name: "Retention Rate", category: "Engagement" },
  { id: "churn", name: "Churn Rate", category: "Risk" },
  { id: "ltv", name: "Lifetime Value", category: "Financial" },
  { id: "acquisition", name: "New Acquisitions", category: "Growth" }
];

const generateSampleData = (): MembershipData[] => {
  const months = generateMonthColumns();
  
  const generateMetricValues = () => {
    const values: any = {};
    availableMetrics.forEach(metric => {
      const metricValues: any = {};
      months.forEach(month => {
        metricValues[month.key] = (Math.random() * 1000 + 500).toFixed(0);
      });
      values[metric.id] = metricValues;
    });
    return values;
  };

  return [
    {
      id: "premium",
      membershipName: "Premium Membership",
      membershipType: "Paid",
      ...generateMetricValues(),
      subRows: [
        {
          id: "premium-annual",
          membershipName: "Premium Annual",
          membershipType: "Annual Plan",
          ...generateMetricValues()
        },
        {
          id: "premium-monthly",
          membershipName: "Premium Monthly", 
          membershipType: "Monthly Plan",
          ...generateMetricValues()
        }
      ]
    },
    {
      id: "basic",
      membershipName: "Basic Membership",
      membershipType: "Paid",
      ...generateMetricValues(),
      subRows: [
        {
          id: "basic-annual",
          membershipName: "Basic Annual",
          membershipType: "Annual Plan",
          ...generateMetricValues()
        },
        {
          id: "basic-monthly",
          membershipName: "Basic Monthly",
          membershipType: "Monthly Plan",
          ...generateMetricValues()
        }
      ]
    },
    {
      id: "free",
      membershipName: "Free Membership",
      membershipType: "Free",
      ...generateMetricValues(),
      subRows: [
        {
          id: "free-trial",
          membershipName: "Free Trial",
          membershipType: "Trial",
          ...generateMetricValues()
        },
        {
          id: "free-basic",
          membershipName: "Free Basic",
          membershipType: "Freemium",
          ...generateMetricValues()
        }
      ]
    }
  ];
};

const EditableSummary: React.FC<{ title: string }> = ({ title }) => {
  const [summaryPoints, setSummaryPoints] = React.useState<SummaryPoint[]>([
    { id: "1", text: "Revenue growth shows positive trend across all quarters" },
    { id: "2", text: "Customer acquisition costs have decreased by 15% YoY" },
    { id: "3", text: "Retail sales performance exceeded online sales in Q4" }
  ]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");

  const addPoint = () => {
    const newPoint: SummaryPoint = {
      id: Date.now().toString(),
      text: "New summary point"
    };
    setSummaryPoints([...summaryPoints, newPoint]);
    setEditingId(newPoint.id);
    setEditText(newPoint.text);
  };

  const startEdit = (point: SummaryPoint) => {
    setEditingId(point.id);
    setEditText(point.text);
  };

  const saveEdit = () => {
    setSummaryPoints(points => 
      points.map(p => p.id === editingId ? { ...p, text: editText } : p)
    );
    setEditingId(null);
    setEditText("");
  };

  const deletePoint = (id: string) => {
    setSummaryPoints(points => points.filter(p => p.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl border border-slate-200/50 shadow-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{title} Summary</h3>
          <p className="text-slate-600 text-sm mt-1">Key insights and analysis points</p>
        </div>
        <Button 
          onClick={addPoint} 
          size="sm" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Point
        </Button>
      </div>
      <ul className="space-y-4">
        {summaryPoints.map((point) => (
          <li key={point.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/80 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            {editingId === point.id ? (
              <div className="flex-1 flex gap-3">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  className="text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                  autoFocus
                />
                <Button 
                  onClick={saveEdit} 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between group">
                <span className="text-sm text-slate-700 font-medium leading-relaxed">{point.text}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200">
                  <Button
                    onClick={() => startEdit(point)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-blue-100 rounded-full"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    onClick={() => deletePoint(point.id)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const GrowthIndicator: React.FC<{ current: number; previous: number }> = ({ current, previous }) => {
  const growth = ((current - previous) / previous) * 100;
  const isPositive = growth > 0;
  const isNeutral = Math.abs(growth) < 0.1;

  if (isNeutral) {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="w-3 h-3" />
        <span className="text-xs">0%</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      <span className="text-xs">{Math.abs(growth).toFixed(1)}%</span>
    </div>
  );
};

const formatINRValue = (value: number): string => {
  if (value >= 10000000) { // 1 Crore
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) { // 1 Lakh
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) { // 1 Thousand
    return `₹${(value / 1000).toFixed(1)}K`;
  } else {
    return `₹${value.toFixed(0)}`;
  }
};

const NestedDataTable: React.FC<NestedDataTableProps> = ({ 
  data = generateSampleData(),
  className 
}) => {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = React.useState<string>("revenue");
  const monthColumns = generateMonthColumns();

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const calculateTotal = (columnKey: string) => {
    return data.reduce((sum, row) => {
      const metricData = row[selectedMetric];
      const value = parseFloat(metricData?.[columnKey] || 0);
      return sum + value;
    }, 0).toFixed(0);
  };

  const getMetricValue = (row: MembershipData, columnKey: string) => {
    return row[selectedMetric]?.[columnKey];
  };

  const getPreviousValue = (row: MembershipData, currentIndex: number) => {
    if (currentIndex >= monthColumns.length - 1) return null;
    const previousColumn = monthColumns[currentIndex + 1];
    return getMetricValue(row, previousColumn.key);
  };

  const groupColumnsByYear = () => {
    const grouped: { [year: number]: typeof monthColumns } = {};
    monthColumns.forEach(col => {
      if (!grouped[col.year]) grouped[col.year] = [];
      grouped[col.year].push(col);
    });
    return grouped;
  };

  const groupColumnsByQuarter = (yearColumns: typeof monthColumns) => {
    const grouped: { [quarter: number]: typeof monthColumns } = {};
    yearColumns.forEach(col => {
      if (!grouped[col.quarter]) grouped[col.quarter] = [];
      grouped[col.quarter].push(col);
    });
    return grouped;
  };

  const yearGroups = groupColumnsByYear();

  return (
    <div className={cn("w-full bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-xl border border-slate-200/50", className)}>
      {/* Metric Selector Tabs */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Performance Metrics
          </h2>
          <p className="text-slate-600 text-sm">Select a metric to analyze membership performance</p>
        </div>
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-xl p-1">
            {availableMetrics.map((metric) => (
              <TabsTrigger 
                key={metric.id} 
                value={metric.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-50 transition-all duration-300 rounded-lg"
              >
                <div className="text-center py-2">
                  <div className="font-semibold text-sm">{metric.name}</div>
                  <div className="text-xs opacity-75 mt-1">{metric.category}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-20">
            {/* Year Headers */}
            <TableRow className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600">
              <TableHead className="sticky left-0 z-30 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white border-r border-slate-600 w-80 font-bold text-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Metrics Overview
                </div>
              </TableHead>
              {Object.entries(yearGroups).map(([year, columns]) => (
                <TableHead 
                  key={year}
                  colSpan={columns.length}
                  className="text-center font-bold text-white border-r border-slate-600 text-lg tracking-wide"
                >
                  {year}
                </TableHead>
              ))}
            </TableRow>
            
            {/* Quarter Headers */}
            <TableRow className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b border-slate-500">
              <TableHead className="sticky left-0 z-30 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-slate-200 border-r border-slate-500"></TableHead>
              {Object.entries(yearGroups).map(([year, yearColumns]) => {
                const quarterGroups = groupColumnsByQuarter(yearColumns);
                return Object.entries(quarterGroups).map(([quarter, qColumns]) => (
                  <TableHead 
                    key={`${year}-Q${quarter}`}
                    colSpan={qColumns.length}
                    className="text-center font-bold text-slate-200 border-r border-slate-500 tracking-wider"
                  >
                    Q{quarter}
                  </TableHead>
                ));
              })}
            </TableRow>
            
            {/* Month Headers */}
            <TableRow className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 border-b border-slate-400">
              <TableHead className="sticky left-0 z-30 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 text-white border-r border-slate-400 font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Membership / Type
                </div>
              </TableHead>
              {monthColumns.map((column) => (
                <TableHead 
                  key={column.key}
                  className="text-center text-sm font-bold text-white min-w-[120px] border-r border-slate-400 px-4 tracking-wide"
                  style={{ height: '40px' }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {data.map((row) => (
              <React.Fragment key={row.id}>
                {/* Parent Row */}
                <TableRow 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer bg-white border-b border-slate-200/50 group transition-all duration-300 hover:shadow-lg"
                  onClick={() => toggleRow(row.id)}
                  style={{ height: '50px' }}
                >
                  <TableCell className="sticky left-0 z-10 bg-white group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-purple-50 border-r border-slate-200/50 font-medium py-4 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {row.subRows && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-100 rounded-full transition-all duration-200 hover:scale-110"
                        >
                          {expandedRows.has(row.id) ? (
                            <ChevronDown className="h-4 w-4 text-slate-700" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-700" />
                          )}
                        </Button>
                      )}
                      <div className="flex flex-col">
                        <div className="font-bold text-slate-900 text-base">{row.membershipName}</div>
                        <div className="text-sm text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full inline-block mt-1">{row.membershipType}</div>
                      </div>
                    </div>
                  </TableCell>
                  {monthColumns.map((column, index) => {
                    const currentValue = getMetricValue(row, column.key);
                    const previousValue = getPreviousValue(row, index);
                    
                    return (
                      <TableCell 
                        key={column.key}
                        className="text-center text-sm border-r border-slate-200/50 font-medium py-4 group-hover:bg-gradient-to-r group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-300"
                      >
                        <div className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/80 transition-all duration-200">
                          <span className="text-slate-900 font-bold text-base">
                            {currentValue ? formatINRValue(parseInt(currentValue)) : '-'}
                          </span>
                          {currentValue && previousValue && (
                            <GrowthIndicator 
                              current={parseFloat(currentValue)} 
                              previous={parseFloat(previousValue)} 
                            />
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
                
                {/* Sub Rows */}
                {expandedRows.has(row.id) && row.subRows?.map((subRow) => (
                  <TableRow 
                    key={subRow.id}
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-blue-200/50 transition-all duration-300 ease-in-out hover:shadow-md"
                    style={{ height: '45px' }}
                  >
                    <TableCell className="sticky left-0 z-10 bg-gradient-to-r from-slate-50/50 to-blue-50/30 hover:from-indigo-50 hover:to-blue-50 border-r border-blue-200/50 pl-16 py-3 transition-all duration-300">
                      <div className="flex flex-col border-l-4 border-gradient-to-b from-blue-400 to-purple-500 pl-4 py-1 rounded-r-lg bg-white/60 shadow-sm">
                        <div className="font-bold text-slate-800 text-sm">{subRow.membershipName}</div>
                        <div className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1 font-medium">{subRow.membershipType}</div>
                      </div>
                    </TableCell>
                    {monthColumns.map((column, index) => {
                      const currentValue = getMetricValue(subRow, column.key);
                      const previousValue = getPreviousValue(subRow, index);
                      
                      return (
                        <TableCell 
                          key={column.key}
                          className="text-center text-sm border-r border-blue-200/50 py-3 hover:bg-white/80 transition-all duration-200"
                        >
                          <div className="flex flex-col items-center gap-2 p-2 rounded-lg">
                            <span className="text-slate-800 font-bold">
                              {currentValue ? formatINRValue(parseInt(currentValue)) : '-'}
                            </span>
                            {currentValue && previousValue && (
                              <GrowthIndicator 
                                current={parseFloat(currentValue)} 
                                previous={parseFloat(previousValue)} 
                              />
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
            
            {/* Totals Row */}
            <TableRow className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 font-bold border-t-4 border-emerald-500 shadow-lg">
              <TableCell className="sticky left-0 z-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 border-r border-emerald-400 font-bold text-white py-4 text-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  TOTALS
                </div>
              </TableCell>
              {monthColumns.map((column) => (
                <TableCell 
                  key={column.key}
                  className="text-center font-bold border-r border-emerald-400 text-white py-4 text-base tracking-wide"
                >
                  <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                    {formatINRValue(parseInt(calculateTotal(column.key)))}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-8">
        <EditableSummary title={`${availableMetrics.find(m => m.id === selectedMetric)?.name || 'Metric'} Analysis`} />
      </div>
    </div>
  );
};

export { NestedDataTable };
