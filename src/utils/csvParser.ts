
export interface MetricData {
  location: string;
  category: string;
  package: string;
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  total: string;
  metric: string;
}

export const parseCSV = (csvText: string): MetricData[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      location: values[0] || '',
      category: values[1] || '',
      package: values[2] || '',
      jan: values[3] || '',
      feb: values[4] || '',
      mar: values[5] || '',
      apr: values[6] || '',
      may: values[7] || '',
      jun: values[8] || '',
      jul: values[9] || '',
      aug: values[10] || '',
      sep: values[11] || '',
      oct: values[12] || '',
      nov: values[13] || '',
      dec: values[14] || '',
      total: values[15] || '',
      metric: values[16] || ''
    };
  });
};

export const groupDataByLocation = (data: MetricData[]) => {
  const grouped: { [key: string]: MetricData[] } = {};
  
  data.forEach(item => {
    if (!grouped[item.location]) {
      grouped[item.location] = [];
    }
    grouped[item.location].push(item);
  });
  
  return grouped;
};

export const getUniqueMetrics = (data: MetricData[]): string[] => {
  const metrics = new Set(data.map(item => item.metric));
  return Array.from(metrics);
};
