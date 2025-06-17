
import Papa from 'papaparse';

export interface MetricData {
  metric: string;           // Column 0: Metric type (e.g., "Gross Sales", "Net Sales")
  location: string;         // Column 1: Calculated Location
  category: string;         // Column 2: Cleaned Category  
  product: string;          // Column 3: Cleaned Product
  // 23 months from 2025-May to 2023-Jul (columns 4-26)
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
  '2023-dec': string;
  '2023-nov': string;
  '2023-oct': string;
  '2023-sep': string;
  '2023-aug': string;
  '2023-jul': string;
  total: string;            // Column 27: Grand Total
  no: string;              // Column 29: Row number
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
            metric: row[0]?.trim() || '',
            location: row[1]?.trim() || '',
            category: row[2]?.trim() || '',
            product: row[3]?.trim() || '',
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
            '2023-dec': row[21]?.trim() || '',
            '2023-nov': row[22]?.trim() || '',
            '2023-oct': row[23]?.trim() || '',
            '2023-sep': row[24]?.trim() || '',
            '2023-aug': row[25]?.trim() || '',
            '2023-jul': row[26]?.trim() || '',
            total: row[27]?.trim() || '',
            no: row[29]?.trim() || ''
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
      metric: values[0] || '',
      location: values[1] || '',
      category: values[2] || '',
      product: values[3] || '',
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
      '2023-dec': values[21] || '',
      '2023-nov': values[22] || '',
      '2023-oct': values[23] || '',
      '2023-sep': values[24] || '',
      '2023-aug': values[25] || '',
      '2023-jul': values[26] || '',
      total: values[27] || '',
      no: values[29] || ''
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
