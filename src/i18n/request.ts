/**
 * EXPLICACIÓN: request.ts - Configuración de next-intl para el servidor
 * 
 * Este archivo configura cómo next-intl carga las traducciones.
 * Se ejecuta en el servidor para cada petición.
 * 
 * FLUJO:
 * 1. El usuario hace una petición
 * 2. Se detecta/lee el idioma de las cookies
 * 3. Se carga el archivo de mensajes correspondiente
 * 4. Los mensajes están disponibles en toda la app
 */

import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { defaultLocale, locales, type Locale } from './config'

export default getRequestConfig(async () => {
  // Intentar obtener el locale de las cookies
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined

  // Usar el locale de la cookie o el default
  const locale = localeCookie && locales.includes(localeCookie) 
    ? localeCookie 
    : defaultLocale

  // Cargar los mensajes del idioma seleccionado
  // Los archivos están en src/i18n/messages/
  const messages = (await import(`./messages/${locale}.json`)).default

  return {
    locale,
    messages,
    // Configuración de formato de fechas y números
    timeZone: 'Europe/Madrid',
    now: new Date(),
  }
})
