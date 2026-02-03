'use client'

/**
 * EXPLICACIÓN: AuthContext - Contexto de autenticación
 * 
 * ¿QUÉ ES UN CONTEXTO EN REACT?
 * El Context API de React permite compartir datos entre componentes
 * sin tener que pasar props manualmente en cada nivel.
 * 
 * Es similar a Vuex/Pinia en Vue, pero más simple.
 * 
 * EQUIVALENCIA VUE → REACT:
 * 
 * Vue (useState de Nuxt):
 *   const user = useState('auth/user', () => null)
 *   // Acceso: user.value
 * 
 * React (Context + useState):
 *   const [user, setUser] = useState(null)
 *   // Acceso: user (sin .value)
 * 
 * FLUJO DE AUTENTICACIÓN:
 * 1. El usuario hace login
 * 2. Se guardan los tokens en cookies
 * 3. Se obtienen los datos del usuario (query ME)
 * 4. Se guarda el usuario en el contexto
 * 5. Todos los componentes tienen acceso al usuario
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { getToken, setTokens, removeTokens } from '@/lib/apollo'
import type { User, UserRole, AuthState, LoginCredentials, AuthTokens } from '@/types/auth'

// Query para obtener el usuario actual (igual que en Vue)
const ME_QUERY = gql`
  query Me {
    me {
      uuid
      first_name
      last_name
      email
      language
      password_changed_at
      is_expired_verification_code
      avatar
      currency
      customer {
        uuid
      }
      passenger {
        uuid
      }
      current_membership {
        uuid
        name
      }
      payment_provider
      measurement_system
      temperature_system
      date_format
      time_format
      phone
      phone_country
      donatella_web_provider
      payments_web_provider
      created_at
      roles {
        name
      }
    }
  }
`

// Mutation para login
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`

// Mutation para logout
const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

// Tipo del contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// Crear el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props del Provider
interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider - Componente que provee el contexto de autenticación
 * 
 * Envuelve toda la aplicación para que cualquier componente
 * pueda acceder al usuario y las funciones de autenticación.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Estado local del usuario
  const [user, setUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mutations de Apollo
  const [loginMutation] = useMutation(LOGIN_MUTATION)
  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  /**
   * Obtiene los datos del usuario si hay token
   * Similar al middleware set-auth.global.ts de Nuxt
   */
  const fetchUser = useCallback(async () => {
    const token = getToken()
    
    if (!token) {
      setUser(null)
      setRoles([])
      setIsLoading(false)
      return
    }

    try {
      // Importar el cliente Apollo para hacer la query
      const { getApolloClient } = await import('@/lib/apollo')
      const client = getApolloClient()
      
      const { data } = await client.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
      })

      if (data?.me) {
        setUser({
          uuid: data.me.uuid,
          first_name: data.me.first_name,
          last_name: data.me.last_name,
          email: data.me.email,
          language: data.me.language,
          password_changed_at: data.me.password_changed_at,
          is_expired_verification_code: data.me.is_expired_verification_code,
          avatar: data.me.avatar,
          currency: data.me.currency,
          customer: data.me.customer,
          passenger: data.me.passenger,
          current_membership: data.me.current_membership,
          payment_provider: data.me.payment_provider,
          measurement_system: data.me.measurement_system,
          temperature_system: data.me.temperature_system,
          date_format: data.me.date_format,
          time_format: data.me.time_format,
          phone: data.me.phone,
          phone_country: data.me.phone_country,
          donatella_web_provider: data.me.donatella_web_provider,
          payments_web_provider: data.me.payments_web_provider,
          created_at: data.me.created_at,
        })
        setRoles(data.me.roles?.map((r: any) => ({ name: r.name })) || [])
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      // Si hay error de autenticación, limpiar tokens
      removeTokens()
      setUser(null)
      setRoles([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar usuario al montar el componente
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  /**
   * Función de login
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    
    try {
      const { data } = await loginMutation({
        variables: credentials,
      })

      if (data?.login) {
        setTokens(data.login.access_token, data.login.refresh_token)
        await fetchUser()
      }
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Función de logout
   */
  const logout = async () => {
    try {
      await logoutMutation()
    } catch (error) {
      // Ignorar errores de logout
    } finally {
      removeTokens()
      setUser(null)
      setRoles([])
      
      // Redirigir a home
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  /**
   * Refrescar datos del usuario
   */
  const refreshUser = async () => {
    await fetchUser()
  }

  // Valor del contexto que estará disponible para los componentes hijos
  const value: AuthContextType = {
    user,
    roles,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook para usar el contexto de autenticación
 * 
 * EQUIVALENCIA VUE → REACT:
 * 
 * Vue:
 *   const user = getAuthUser()
 *   const isLogged = user?.value?.uuid
 * 
 * React:
 *   const { user, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
