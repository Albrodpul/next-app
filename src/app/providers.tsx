'use client'

/**
 * EXPLICACIÓN: Providers - Componente cliente para envolver la app
 * 
 * ¿POR QUÉ UN ARCHIVO SEPARADO?
 * En Next.js 14 con App Router, los componentes son Server Components por defecto.
 * Pero Apollo y Auth necesitan estado del cliente (useState, useEffect).
 * 
 * La solución es crear un componente cliente ('use client') que envuelva
 * la aplicación con todos los providers necesarios.
 * 
 * EQUIVALENCIA CON VUE:
 * Esto es similar a los plugins de Nuxt que se ejecutan en el cliente:
 * - plugins/apollo-client.js
 * - plugins/event-bus.js
 * - etc.
 * 
 * ORDEN DE LOS PROVIDERS:
 * El orden importa. Los providers internos pueden acceder a los externos.
 * ApolloProvider > AuthProvider > children
 * 
 * AuthProvider puede usar Apollo porque está dentro de ApolloProvider.
 */

import { ReactNode } from 'react'
import { ApolloProvider } from '@/lib/apollo'
import { AuthProvider } from '@/contexts/AuthContext'
import { EventBusProvider } from '@/contexts/EventBusContext'
import { Toaster } from 'react-hot-toast'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider>
      <AuthProvider>
        <EventBusProvider>
          {/* 
            Toaster es el componente de notificaciones
            Similar a ElNotification en Element Plus
          */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--brand-off-black)',
                color: 'var(--brand-white)',
                fontFamily: 'graphic-regular, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: 'var(--validation-positive)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--validation-error)',
                  secondary: 'white',
                },
              },
            }}
          />
          {children}
        </EventBusProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}
