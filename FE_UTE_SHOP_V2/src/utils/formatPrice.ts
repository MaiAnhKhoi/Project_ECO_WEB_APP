/**
 * Format price to VND currency
 * @param price - Price in number
 * @returns Formatted price string in VND format
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format price without currency symbol (just number with dots)
 * @param price - Price in number
 * @returns Formatted price string without currency symbol
 */
export const formatPriceNumber = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

