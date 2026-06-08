export const keyAliases: Record<string, string[]> = {
  'Date': ['date', 'time', 'timestamp', 'orderdate', 'createdat', 'day'],
  'Product_Name': ['product', 'productname', 'item', 'itemname', 'name', 'article', 'title'],
  'Units_Sold': ['units', 'unitssold', 'quantity', 'qty', 'count', 'amount'],
  'Revenue_BDT': ['revenue', 'revenuebdt', 'sales', 'totalsales', 'total', 'value', 'amountbdt', 'earning'],
  'Unit_Price': ['price', 'unitprice', 'costperunit'],
  'Cost_Price': ['cost', 'costprice', 'cogs', 'buyprice'],
  'Category': ['category', 'type', 'class', 'group', 'department'],
  'Location': ['location', 'region', 'city', 'branch', 'store', 'area']
};

export function normalizeCsvData(parsedData: any[]) {
  return parsedData.map(row => {
    const newRow: any = {};
    for (const key in row) {
      if (row[key] === undefined || row[key] === null) continue;
      
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      let mappedKey = key; // default to original
      
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
