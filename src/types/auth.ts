/**
 * EXPLICACIÓN: Tipos de usuario y autenticación
 * 
 * TypeScript nos permite definir la "forma" de nuestros datos.
 * Esto ayuda a:
 * - Autocompletado en el editor
 * - Detectar errores antes de ejecutar el código
 * - Documentar la estructura de los datos
 */

export interface User {
  uuid: string
  first_name: string
  last_name: string
  email: string
  language?: string
  password_changed_at?: string | null
  is_expired_verification_code?: boolean
  avatar?: string | null
  currency?: string
  customer?: any | null
  passenger?: any | null
  current_membership?: any | null
  payment_provider?: string
  measurement_system?: string | null
  temperature_system?: string | null
  date_format?: string | null
  time_format?: string | null
  phone?: string | null
  phone_country?: string | null
  donatella_web_provider?: string | null
  payments_web_provider?: string | null
  created_at?: string | null
}

export interface UserRole {
  name: string
}

export interface AuthState {
  user: User | null
  roles: UserRole[]
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  phone_country?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}
