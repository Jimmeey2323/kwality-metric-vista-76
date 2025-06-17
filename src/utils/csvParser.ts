
import Papa from 'papaparse';

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
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const data = result.data as string[][];
          const parsedData: MetricData[] = data.slice(1).map(row => ({
            location: row[0]?.trim() || '',
            category: row[1]?.trim() || '',
            package: row[2]?.trim() || '',
            jan: row[3]?.trim() || '',
            feb: row[4]?.trim() || '',
            mar: row[5]?.trim() || '',
            apr: row[6]?.trim() || '',
            may: row[7]?.trim() || '',
            jun: row[8]?.trim() || '',
            jul: row[9]?.trim() || '',
            aug: row[10]?.trim() || '',
            sep: row[11]?.trim() || '',
            oct: row[12]?.trim() || '',
            nov: row[13]?.trim() || '',
            dec: row[14]?.trim() || '',
            total: row[15]?.trim() || '',
            metric: row[16]?.trim() || ''
          }));
          
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Synchronous version for compatibility
export const parseCSVSync = (csvText: string): MetricData[] => {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map(line => {
    // Handle CSV parsing with proper quote handling
    const values = line.split(',').map(val => val.trim().replace(/^"|"$/g, ''));
    
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
