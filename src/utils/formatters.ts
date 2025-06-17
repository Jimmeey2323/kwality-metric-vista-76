
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[₹,]/g, '')) : value;
  
  if (isNaN(numValue) || numValue === 0) return '₹0';
  
  const absValue = Math.abs(numValue);
  const sign = numValue < 0 ? '-' : '';
  
  if (absValue >= 10000000) { // 1 Crore
    return `${sign}₹${(absValue / 10000000).toFixed(1)}Cr`;
  } else if (absValue >= 100000) { // 1 Lakh
    return `${sign}₹${(absValue / 100000).toFixed(1)}L`;
  } else if (absValue >= 1000) { // 1 Thousand
    return `${sign}₹${(absValue / 1000).toFixed(1)}K`;
  } else {
    return `${sign}₹${Math.round(absValue).toLocaleString('en-IN')}`;
  }
};

export const formatPercentage = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[%]/g, '')) : value;
  if (isNaN(numValue)) return '0%';
  return `${numValue.toFixed(1)}%`;
};

export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[,]/g, '')) : value;
  if (isNaN(numValue)) return '0';
  
  const absValue = Math.abs(numValue);
  const sign = numValue < 0 ? '-' : '';
  
  if (absValue >= 10000000) { // 1 Crore
    return `${sign}${(absValue / 10000000).toFixed(1)}Cr`;
  } else if (absValue >= 100000) { // 1 Lakh
    return `${sign}${(absValue / 100000).toFixed(1)}L`;
  } else if (absValue >= 1000) { // 1 Thousand
    return `${sign}${(absValue / 1000).toFixed(1)}K`;
  } else {
    return `${sign}${Math.round(absValue).toLocaleString('en-IN')}`;
  }
};
