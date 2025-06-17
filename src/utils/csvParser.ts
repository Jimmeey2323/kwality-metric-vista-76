
import Papa from 'papaparse';

export interface MetricData {
  firstVisitLocation: string;    // Column 0: First Visit Location
  trainerName: string;          // Column 1: Trainer Name
  isNew: string;               // Column 2: Is New
  // 18 months from 2025-Jun to 2024-Jan (columns 3-20)
  '2025-jun': string;
  '2025-may': string;
  '2025-apr': string;
  '2025-mar': string;
  '2025-feb': string;
  '2025-jan': string;
  '2024-dec': string;
  '2024-nov': string;
  '2024-oct': string;
  '2024-sep': string;
  '2024-aug': string;
  '2024-jul': string;
  '2024-jun': string;
  '2024-may': string;
  '2024-apr': string;
  '2024-mar': string;
  '2024-feb': string;
  '2024-jan': string;
  grandTotal: string;          // Column 21: Grand Total
  metric: string;              // Column 22: Metric
}

export const parseCSV = (csvText: string): Promise<MetricData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const data = result.data as string[][];
          // Skip header row
          const parsedData: MetricData[] = data.slice(1).map(row => ({
            firstVisitLocation: row[0]?.trim() || '',
            trainerName: row[1]?.trim() || '',
            isNew: row[2]?.trim() || '',
            '2025-jun': row[3]?.trim() || '',
            '2025-may': row[4]?.trim() || '',
            '2025-apr': row[5]?.trim() || '',
            '2025-mar': row[6]?.trim() || '',
            '2025-feb': row[7]?.trim() || '',
            '2025-jan': row[8]?.trim() || '',
            '2024-dec': row[9]?.trim() || '',
            '2024-nov': row[10]?.trim() || '',
            '2024-oct': row[11]?.trim() || '',
            '2024-sep': row[12]?.trim() || '',
            '2024-aug': row[13]?.trim() || '',
            '2024-jul': row[14]?.trim() || '',
            '2024-jun': row[15]?.trim() || '',
            '2024-may': row[16]?.trim() || '',
            '2024-apr': row[17]?.trim() || '',
            '2024-mar': row[18]?.trim() || '',
            '2024-feb': row[19]?.trim() || '',
            '2024-jan': row[20]?.trim() || '',
            grandTotal: row[21]?.trim() || '',
            metric: row[22]?.trim() || ''
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
      firstVisitLocation: values[0] || '',
      trainerName: values[1] || '',
      isNew: values[2] || '',
      '2025-jun': values[3] || '',
      '2025-may': values[4] || '',
      '2025-apr': values[5] || '',
      '2025-mar': values[6] || '',
      '2025-feb': values[7] || '',
      '2025-jan': values[8] || '',
      '2024-dec': values[9] || '',
      '2024-nov': values[10] || '',
      '2024-oct': values[11] || '',
      '2024-sep': values[12] || '',
      '2024-aug': values[13] || '',
      '2024-jul': values[14] || '',
      '2024-jun': values[15] || '',
      '2024-may': values[16] || '',
      '2024-apr': values[17] || '',
      '2024-mar': values[18] || '',
      '2024-feb': values[19] || '',
      '2024-jan': values[20] || '',
      grandTotal: values[21] || '',
      metric: values[22] || ''
    };
  });
};

export const groupDataByLocation = (data: MetricData[]) => {
  const grouped: { [key: string]: MetricData[] } = {};
  
  data.forEach(item => {
    if (!grouped[item.firstVisitLocation]) {
      grouped[item.firstVisitLocation] = [];
    }
    grouped[item.firstVisitLocation].push(item);
  });
  
  return grouped;
};

export const getUniqueMetrics = (data: MetricData[]): string[] => {
  const metrics = new Set(data.map(item => item.metric));
  return Array.from(metrics);
};
