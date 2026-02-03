/**
 * EXPLICACIÓN: Layout principal de Next.js (app/layout.tsx)
 * 
 * Este archivo es equivalente a app.vue + layouts/default.vue en Nuxt.
 * Es el "contenedor" de toda la aplicación.
 * 
 * ESTRUCTURA DE NEXT.JS APP ROUTER:
 * 
 * En Next.js 14 con App Router, cada carpeta en `app/` es una ruta:
 * - app/page.tsx         → /
 * - app/about/page.tsx   → /about
 * - app/layout.tsx       → Layout que envuelve todas las páginas
 * 
 * EQUIVALENCIA NUXT → NEXT.JS:
 * 
 * Nuxt:
 *   app.vue (root) → layouts/default.vue → pages/xxx.vue
 * 
 * Next.js:
 *   app/layout.tsx (root) → app/xxx/page.tsx
 * 
 * PROVIDERS:
 * Los "providers" son componentes que envuelven la aplicación para
 * proporcionar funcionalidades globales:
 * - ApolloProvider: Cliente GraphQL
 * - AuthProvider: Estado de autenticación
 * - NextIntlClientProvider: Traducciones
 */

import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ApolloProvider } from '@/lib/apollo'
import { AuthProvider } from '@/contexts/AuthContext'
import { Providers } from './providers'
import '@/styles/globals.scss'

// Metadatos de la página (equivalente a app.head en nuxt.config.ts)
export const metadata: Metadata = {
  title: 'Paradise a La Carte | Travel redefined',
  description: 'Travel Redefined. Everything you need for limitless travel, in one place.',
  keywords: ['travel', 'experiences', 'luxury', 'concierge', 'exclusive experiences', 'membership'],
  authors: [{ name: 'Paradise a La Carte' }],
  openGraph: {
    type: 'website',
    title: 'Paradise a La Carte',
    description: 'Travel Redefined. Everything you need for limitless travel, in one place.',
    url: process.env.NEXT_PUBLIC_WEB_URL,
    images: [
      {
        url: 'https://media.licdn.com/dms/image/v2/D4D0BAQFoUcu0TfJUVg/company-logo_200_200/company-logo_200_200/0/1704966942092/paradise_a_la_carte_logo',
        width: 200,
        height: 200,
        alt: 'Paradise a La Carte',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paradise a La Carte',
    description: 'Travel Redefined. Everything you need for limitless travel, in one place.',
    site: '@CarteParadise',
    creator: '@CarteParadise',
  },
  icons: {
    icon: '/favicon-dark.svg',
  },
}

/**
 * Layout raíz de la aplicación
 * 
 * Este es un Server Component por defecto en Next.js 14.
 * Los Server Components se renderizan en el servidor y envían HTML puro.
 * 
 * Como necesitamos providers que usan estado del cliente (ApolloProvider, AuthProvider),
 * los movemos a un componente separado 'Providers' marcado con 'use client'.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener los mensajes de traducción en el servidor
  const messages = await getMessages()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnects para optimización (igual que en Nuxt) */}
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://apis.google.com" crossOrigin="" />
        <link rel="preconnect" href="https://consent.cookiebot.com" crossOrigin="" />
      </head>
      <body>
        {/* 
          NextIntlClientProvider proporciona las traducciones
          Similar a como vue-i18n las proporciona en Nuxt
        */}
        <NextIntlClientProvider messages={messages}>
          {/* 
            Providers envuelve la app con Apollo y Auth
            Es un Client Component para poder usar hooks de estado
          */}
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
