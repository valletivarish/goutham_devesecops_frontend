/**
 * Format a date value into a human-readable string (e.g., "Mar 2, 2026").
 *
 * @param {string|Date} date - The date to format
 * @param {string} [locale='en-US'] - BCP 47 locale string
 * @returns {string} Formatted date string, or empty string if invalid
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';

  const parsed = date instanceof Date ? date : new Date(date);

  if (isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(parsed);
};

/**
 * Check whether the given value is a valid date.
 *
 * @param {string|Date} date - The value to validate
 * @returns {boolean} True if the value can be parsed as a valid date
 */
export const isValidDate = (date) => {
  if (!date) return false;

  const parsed = date instanceof Date ? date : new Date(date);
  return !isNaN(parsed.getTime());
};

/**
 * Check whether the given date is in the future relative to now.
 *
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is after the current date/time
 */
export const isFutureDate = (date) => {
  if (!date) return false;

  const parsed = date instanceof Date ? date : new Date(date);

  if (isNaN(parsed.getTime())) return false;

  return parsed.getTime() > Date.now();
};
