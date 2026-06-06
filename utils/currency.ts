export type CurrencyCode = "BDT" | "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  CAD: "C$",
  AUD: "A$"
};

export function formatCurrency(amount: number, currencyCode: string = "BDT"): string {
  const code = currencyCode as CurrencyCode;
  const symbol = CURRENCY_SYMBOLS[code] || "৳";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code || 'BDT',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace(/[a-zA-Z]+/, symbol).trim();
}
