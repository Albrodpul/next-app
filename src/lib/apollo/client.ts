/**
 * EXPLICACIÓN: Cliente Apollo para GraphQL
 * 
 * Este archivo configura el cliente Apollo para comunicarse con el backend GraphQL.
 * 
 * ¿QUÉ ES APOLLO CLIENT?
 * Apollo Client es una librería para hacer consultas GraphQL desde el frontend.
 * Permite:
 * - Hacer queries (obtener datos)
 * - Hacer mutations (modificar datos)
 * - Manejar caché automáticamente
 * - Gestionar estados de carga y error
 * 
 * DIFERENCIAS ENTRE VUE Y REACT:
 * 
 * Vue (con @vue/apollo-composable):
 *   const { result, loading, error } = useQuery(GET_USERS)
 * 
 * React (con @apollo/client):
 *   const { data, loading, error } = useQuery(GET_USERS)
 * 
 * La API es muy similar. La diferencia principal es:
 * - Vue: result.value contiene los datos (ref reactivo)
 * - React: data contiene los datos directamente
 * 
 * ESTRUCTURA DEL ARCHIVO:
 * 1. Configuración de links (cadena de procesamiento de requests)
 * 2. Manejo de tokens de autenticación
 * 3. Refresh automático de tokens expirados
 * 4. Caché en memoria
 */

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  from,
  fromPromise,
  Observable,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import Cookies from 'js-cookie'

// Constantes para las cookies (igual que en Vue)
const TOKEN_COOKIE = 'apollo-token'
const REFRESH_TOKEN_COOKIE = 'apollo-token-refresh'
const COOKIE_EXPIRY_DAYS = 365 * 20 // 20 años, como en el original

// Variables para controlar el refresh de tokens
let isRefreshing = false
let pendingRequests: Function[] = []

/**
 * Resuelve las peticiones pendientes después de refrescar el token
 */
const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback())
  pendingRequests = []
}

/**
 * Obtiene el token de las cookies
 */
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE)
}

/**
 * Obtiene el refresh token de las cookies
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_COOKIE)
}

/**
 * Guarda los tokens en las cookies
 */
export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(TOKEN_COOKIE, accessToken, { expires: COOKIE_EXPIRY_DAYS })
  Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, { expires: COOKIE_EXPIRY_DAYS })
}

/**
 * Elimina los tokens de las cookies
 */
export const removeTokens = () => {
  Cookies.remove(TOKEN_COOKIE)
  Cookies.remove(REFRESH_TOKEN_COOKIE)
}

/**
 * Refresca el token de acceso usando el refresh token
 */
const refreshToken = async (): Promise<{
  access_token: string
  refresh_token: string
} | null> => {
  const refresh = getRefreshToken()
  if (!refresh) return null

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_HTTP_ENDPOINT || 'http://localhost:4000/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation RefreshToken($refresh_token: String!) {
              refreshToken(refresh_token: $refresh_token) {
                access_token
                refresh_token
              }
            }
          `,
          variables: {
            refresh_token: refresh,
          },
        }),
      }
    )

    const result = await response.json()
    
    if (result.data?.refreshToken) {
      return result.data.refreshToken
    }
    
    return null
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

/**
 * Crea el cliente Apollo
 * 
 * LINKS EN APOLLO:
 * Los "links" son como middleware que procesan cada petición.
 * Se ejecutan en orden: authLink -> errorLink -> httpLink
 * 
 * authLink: Añade el token de autenticación a los headers
 * errorLink: Maneja errores (incluyendo refresh de token)
 * httpLink: Hace la petición HTTP real
 */
export function createApolloClient() {
  // Link HTTP base - hace las peticiones al servidor GraphQL
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HTTP_ENDPOINT || 'http://localhost:4000/graphql',
    credentials: 'same-origin',
  })

  // Link de autenticación - añade el token a cada petición
  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    
    return {
      headers: {
        ...headers,
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
      },
    }
  })

  // Link de errores - maneja errores de autenticación y refresca tokens
  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // Detectar errores de autenticación
        const isAuthError =
          err.message.includes('Unauthenticated') ||
          err.message.includes('The token has expired') ||
          (err as any).reason?.includes('authentication_error')

        if (isAuthError) {
          // Si ya estamos refrescando, encolar la petición
          if (isRefreshing) {
            return new Observable((observer) => {
              pendingRequests.push(() => {
                const token = getToken()
                if (token) {
                  operation.setContext(({ headers = {} }) => ({
                    headers: {
                      ...headers,
                      Authorization: `Bearer ${token}`,
                    },
                  }))
                }
                forward(operation).subscribe(observer)
              })
            })
          }

          isRefreshing = true

          // Intentar refrescar el token
          return fromPromise(
            refreshToken()
              .catch(() => {
                // Si falla el refresh, limpiar y redirigir a login
                pendingRequests = []
                isRefreshing = false
                removeTokens()
                
                // En el cliente, redirigir a login
                if (typeof window !== 'undefined') {
                  window.location.href = '/login'
                }
                
                return null
              })
              .then((tokens) => {
                if (tokens) {
                  setTokens(tokens.access_token, tokens.refresh_token)

                  // Actualizar el header de la operación actual
                  operation.setContext(({ headers = {} }) => ({
                    headers: {
                      ...headers,
                      Authorization: `Bearer ${tokens.access_token}`,
                    },
                  }))
                }

                isRefreshing = false
                resolvePendingRequests()
                return tokens
              })
          ).flatMap(() => forward(operation))
        }
      }
    }
  })

  // Crear el cliente con la cadena de links
  const client = new ApolloClient({
    // Combinar los links en orden
    link: from([authLink, errorLink, httpLink]),
    
    // Caché en memoria - Apollo guarda los resultados para no repetir peticiones
    cache: new InMemoryCache({
      // Configuración de tipado para la caché
      typePolicies: {
        Query: {
          fields: {
            // Aquí puedes configurar cómo se cachean campos específicos
          },
        },
      },
    }),
    
    // Configuración por defecto
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network', // Usar caché pero también pedir al servidor
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only', // Siempre pedir al servidor
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  })

  return client
}

// Cliente singleton para usar en toda la app
let apolloClient: ApolloClient<any> | null = null

/**
 * Obtiene o crea el cliente Apollo
 * Usa un patrón singleton para no crear múltiples instancias
 */
export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient()
  }
  return apolloClient
}
