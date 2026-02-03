/**
 * useMediaQuery Hook
 * 
 * Similar a useMediaQuery de VueUse.
 * Permite ejecutar media queries de CSS en JavaScript.
 * 
 * En Vue:
 * const isWideScreen = useMediaQuery('(min-width: 1024px)')
 * // isWideScreen es un ref boolean
 * 
 * En React:
 * const isWideScreen = useMediaQuery('(min-width: 1024px)')
 * // Retorna boolean que actualiza el componente
 * 
 * Útil para:
 * - Renderizado condicional basado en viewport
 * - Cargar diferentes componentes según el dispositivo
 * - Preferencias del sistema (dark mode, reduced motion, etc.)
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Hook que evalúa un media query y retorna si coincide
 * 
 * @param query - Media query CSS (ej: '(min-width: 768px)')
 * @returns boolean indicando si el query coincide
 */
export function useMediaQuery(query: string): boolean {
  // Estado inicial: false para SSR, se actualiza en el cliente
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Crear el MediaQueryList
    const mediaQuery = window.matchMedia(query);

    // Función para actualizar el estado
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Establecer el valor inicial
    setMatches(mediaQuery.matches);

    // Escuchar cambios
    // Usamos addEventListener para compatibilidad moderna
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook preconfigurado para detectar preferencia de dark mode del sistema
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook para detectar preferencia de reducir animaciones
 * Importante para accesibilidad
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook para detectar si es un dispositivo táctil
 * Nota: no es 100% confiable, pero útil como heurística
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

/**
 * Hook para detectar si es modo de alto contraste
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)');
}

/**
 * Media queries comunes predefinidos
 */
export const mediaQueries = {
  mobile: '(max-width: 639px)',
  tablet: '(min-width: 640px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  largeDesktop: '(min-width: 1280px)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: high)',
} as const;

export default useMediaQuery;
