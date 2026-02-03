/**
 * Utilidades de precio y moneda
 */

export function getPriceFormat(
  price: number | string,
  currency: string = 'EUR',
  locale: string = 'en'
): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  
  if (isNaN(numPrice)) return ''
  
  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    sv: 'sv-SE',
    ar: 'ar-SA',
  }

  return new Intl.NumberFormat(localeMap[locale] || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numPrice)
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF',
    SEK: 'kr',
    AED: 'د.إ',
    SAR: 'ر.س',
  }
  return symbols[currency] || currency
}

export function getCurrencyName(currency: string): string {
  const names: Record<string, string> = {
    EUR: 'Euro',
    USD: 'US Dollar',
    GBP: 'British Pound',
    CHF: 'Swiss Franc',
    SEK: 'Swedish Krona',
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
  }
  return names[currency] || currency
}
