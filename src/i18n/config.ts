/**
 * EXPLICACIÓN: Configuración de internacionalización (i18n)
 * 
 * En Vue/Nuxt usábamos vue-i18n. En React/Next.js usamos next-intl,
 * que es una librería popular y bien mantenida para i18n.
 * 
 * CONCEPTOS CLAVE:
 * 
 * 1. LOCALES: Los idiomas disponibles (es, en, fr, de, sv, ar)
 * 2. DEFAULT LOCALE: El idioma por defecto si no se detecta otro
 * 3. MESSAGES: Los archivos JSON con las traducciones
 * 
 * DIFERENCIAS CON VUE-I18N:
 * 
 * Vue:   $t('welcome_to')
 * React: t('welcome_to')
 * 
 * Vue:   $t('count_items', { count: 5 })
 * React: t('count_items', { count: 5 })
 * 
 * La sintaxis es muy similar, solo cambia el $ del principio.
 */

// Idiomas soportados (igual que en Nuxt)
export const locales = ['es', 'en', 'fr', 'de', 'sv', 'ar'] as const

// Tipo para los locales
export type Locale = (typeof locales)[number]

// Idioma por defecto
export const defaultLocale: Locale = 'en'

// Nombres de los idiomas para mostrar en UI
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  sv: 'Svenska',
  ar: 'العربية',
}

// Dirección del texto (para árabe que es RTL)
export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  es: 'ltr',
  en: 'ltr',
  fr: 'ltr',
  de: 'ltr',
  sv: 'ltr',
  ar: 'rtl',
}

/**
 * Detecta el idioma preferido del navegador
 * Similar a la lógica en el plugin i18n.js de Nuxt
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale

  const browserLang = navigator.language.toLowerCase()

  for (const locale of locales) {
    if (browserLang.includes(locale)) {
      return locale
    }
  }

  return defaultLocale
}
