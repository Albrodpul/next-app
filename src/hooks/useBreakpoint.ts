'use client'

/**
 * EXPLICACIÓN: useBreakpoint - Hook para responsive design
 * 
 * Este hook es equivalente al composable useBreakpoints de VueUse.
 * Detecta el tamaño de la pantalla y proporciona helpers útiles.
 * 
 * DIFERENCIA VUE → REACT:
 * 
 * Vue (VueUse):
 *   const { width } = useBreakpoints()
 *   // width es un ref: width.value
 * 
 * React:
 *   const { width } = useBreakpoint()
 *   // width es un valor directo
 * 
 * USO:
 *   const { width, isMobile, isTablet, isDesktop } = useBreakpoint()
 *   
 *   if (isMobile) {
 *     // Renderizar versión móvil
 *   }
 */

import { useState, useEffect } from 'react'

interface BreakpointResult {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isSmall: boolean
  isMedium: boolean
  isLarge: boolean
}

// Breakpoints (igual que en Tailwind config)
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  mobile: 1100, // Breakpoint usado en el proyecto original
}

export function useBreakpoint(): BreakpointResult {
  // Estado inicial con valores del servidor (evita hydration mismatch)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  useEffect(() => {
    // Actualizar al montar (solo en cliente)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Handler para resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize)

    // Limpiar al desmontar
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width: dimensions.width,
    height: dimensions.height,
    // El proyecto original usa 1100px como breakpoint móvil
    isMobile: dimensions.width <= BREAKPOINTS.mobile,
    isTablet: dimensions.width > BREAKPOINTS.mobile && dimensions.width <= BREAKPOINTS.lg,
    isDesktop: dimensions.width > BREAKPOINTS.lg,
    // Helpers adicionales
    isSmall: dimensions.width <= BREAKPOINTS.sm,
    isMedium: dimensions.width > BREAKPOINTS.sm && dimensions.width <= BREAKPOINTS.md,
    isLarge: dimensions.width > BREAKPOINTS.md,
  }
}

export default useBreakpoint
