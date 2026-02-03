/**
 * EXPLICACIÓN: Middleware de Next.js
 * 
 * Este archivo se ejecuta ANTES de cada petición en el servidor.
 * Es equivalente a los middlewares de Nuxt (auth.ts, guest.ts).
 * 
 * DIFERENCIAS CON NUXT:
 * 
 * Nuxt:
 *   - Los middlewares se definen por página con `definePageMeta({ middleware: 'auth' })`
 *   - Se ejecutan en el cliente por defecto (SSR: false en tu config)
 * 
 * Next.js:
 *   - El middleware se ejecuta en el servidor (Edge Runtime)
 *   - Se usa un único archivo que maneja todas las rutas con `matcher`
 * 
 * FLUJO:
 * 1. Usuario intenta acceder a /account
 * 2. Middleware verifica si hay token en las cookies
 * 3. Si no hay token → redirige a /login
 * 4. Si hay token → permite el acceso
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = [
  '/account',
  '/my-membership',
  '/your-itineraries',
  '/your-purchases',
  '/reservations',
  '/nft-wallet',
]

// Rutas solo para invitados (usuarios no autenticados)
const guestOnlyRoutes = [
  '/login',
  '/register',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Obtener el token de las cookies
  const token = request.cookies.get('apollo-token')?.value
  const isAuthenticated = !!token

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Verificar rutas solo para invitados
  const isGuestOnlyRoute = guestOnlyRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Si la ruta es protegida y no hay token, redirigir a login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    
    // Guardar la URL original para redirigir después del login
    loginUrl.searchParams.set('redirect', pathname)
    
    return NextResponse.redirect(loginUrl)
  }

  // Si es ruta de invitados y hay token, redirigir a home
  if (isGuestOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continuar normalmente
  return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|logos|images|videos).*)',
  ],
}
