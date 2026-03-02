/**
 * Format a numeric amount as a currency string.
 * Defaults to EUR locale formatting. Falls back to USD if needed.
 *
 * @param {number} amount - The numeric value to format
 * @param {string} [currency='EUR'] - ISO 4217 currency code (e.g., 'EUR', 'USD')
 * @param {string} [locale='de-DE'] - BCP 47 locale string for formatting
 * @returns {string} Formatted currency string (e.g., "1.234,56 EUR" or "$1,234.56")
 */
export const formatCurrency = (amount, currency = 'EUR', locale = 'de-DE') => {
  if (amount == null || isNaN(amount)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(0);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
