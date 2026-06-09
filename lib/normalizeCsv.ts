export const keyAliases: Record<string, string[]> = {
  'Date': ['date', 'time', 'timestamp', 'orderdate', 'createdat', 'day'],
  'Product_ID': ['id', 'productid', 'itemid', 'sku'],
  'Product_Name': ['product', 'productname', 'item', 'itemname', 'name', 'article', 'title'],
  'Units_Sold': ['units', 'unitssold', 'quantity', 'qty', 'count', 'amount'],
  'Revenue_BDT': ['revenue', 'revenuebdt', 'sales', 'totalsales', 'total', 'value', 'amountbdt', 'earning'],
  'Unit_Price': ['price', 'unitprice', 'costperunit'],
  'Cost_Price': ['cost', 'costprice', 'cogs', 'buyprice'],
  'Category': ['category', 'type', 'class', 'group', 'department'],
  'Location': ['location', 'region', 'city', 'branch', 'store', 'area'],
  'Sales_Channel': ['channel', 'saleschannel', 'platform', 'source', 'medium'],
  'Current_Stock': ['stock', 'currentstock', 'inventory', 'stocklevel', 'qtyonhand'],
  'Customer_Segment': ['segment', 'customersegment', 'audience', 'target', 'demographic']
};

export function normalizeCsvData(parsedData: any[]) {
  // Filter out completely blank rows that Google Sheets might export
  const validData = parsedData.filter(row => {
    return Object.values(row).some(val => val !== null && val !== undefined && val !== '');
  });

  return validData.map(row => {
    const newRow: any = {};
    for (const key in row) {
      if (row[key] === undefined || row[key] === null || key.trim() === '') continue;
      
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      // Replace spaces and dashes with underscores for unmatched columns
      let mappedKey = key.trim().replace(/[\s-]+/g, '_'); 
      
      for (const [canonical, aliases] of Object.entries(keyAliases)) {
        if (aliases.includes(normalizedKey)) {
          mappedKey = canonical;
          break;
        }
      }
      // Only set if not already set, or if we map to a new key
      if (newRow[mappedKey] === undefined) {
        newRow[mappedKey] = row[key];
      }
    }
    return newRow;
  });
}
