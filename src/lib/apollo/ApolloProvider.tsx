'use client'

/**
 * EXPLICACIÓN: ApolloProvider - Provider para usar Apollo en React
 * 
 * ¿QUÉ ES UN PROVIDER?
 * En React, un Provider es un componente que "provee" datos o funcionalidades
 * a todos sus componentes hijos sin necesidad de pasar props manualmente.
 * 
 * DIFERENCIA CON VUE:
 * 
 * Vue (Nuxt plugin):
 *   export default defineNuxtPlugin((nuxtApp) => {
 *     const apolloClient = createApolloClient()
 *     provideApolloClient(apolloClient)
 *     nuxtApp.vueApp.use(apolloClient)
 *   })
 * 
 * React (Provider):
 *   <ApolloProvider client={apolloClient}>
 *     <App />
 *   </ApolloProvider>
 * 
 * En Vue usamos `provide/inject`, en React usamos Context y Providers.
 * 
 * USO DE 'use client':
 * Esta directiva indica que este componente solo se ejecuta en el cliente.
 * Apollo Client necesita el navegador para funcionar correctamente.
 */

import { ApolloProvider as BaseApolloProvider } from '@apollo/client'
import { ReactNode, useMemo } from 'react'
import { getApolloClient } from './client'

interface ApolloProviderProps {
  children: ReactNode
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  // useMemo evita recrear el cliente en cada render
  // Similar a cómo Vue usa computed() para valores calculados
  const client = useMemo(() => getApolloClient(), [])

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
}
