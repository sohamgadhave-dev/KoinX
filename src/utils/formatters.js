/**
 * Formats a number as currency with ₹ symbol
 * @param {number} value - The number to format
 * @param {boolean} showSign - Whether to show + or - prefix
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, showSign = false) {
  const absValue = Math.abs(value);
  const formatted = absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (showSign) {
    if (value > 0) return `+$${formatted}`;
    if (value < 0) return `-$${formatted}`;
    return `$${formatted}`;
  }

  if (value < 0) return `- $${formatted}`;
  return `$${formatted}`;
}

/**
 * Formats a holding amount with appropriate decimal places
 * @param {number} value - The holding amount
 * @param {string} coin - The coin symbol
 * @returns {string} Formatted holding string
 */
export function formatHolding(value, coin) {
  if (value === 0) return `0 ${coin}`;
  if (Math.abs(value) < 0.000001) {
    return `< 0.000001 ${coin}`;
  }
  if (Math.abs(value) >= 1000) {
    return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${coin}`;
  }
  // Show up to 6 significant digits
  const decimals = Math.max(2, Math.min(8, -Math.floor(Math.log10(Math.abs(value))) + 3));
  return `${value.toFixed(Math.min(decimals, 8))} ${coin}`;
}

/**
 * Formats price in currency
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  if (price >= 100000) {
    return `$ ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) {
    return `$ ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  }
  return `$${price.toFixed(8)}`;
}

/**
 * Formats price with K/M abbreviations
 * @param {number} price
 * @returns {string}
 */
export function formatAbbreviated(price) {
  const absPrice = Math.abs(price);
  if (absPrice >= 1e6) {
    const formatted = (absPrice / 1e6).toFixed(2) + 'M';
    return price < 0 ? `-$${formatted}` : `$${formatted}`;
  }
  if (absPrice >= 1e3) {
    const formatted = (absPrice / 1e3).toFixed(2) + 'K';
    return price < 0 ? `-$${formatted}` : `$${formatted}`;
  }
  return formatPrice(price);
}
