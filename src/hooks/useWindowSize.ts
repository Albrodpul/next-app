/**
 * useWindowSize Hook
 * 
 * Similar a useWindowSize de VueUse.
 * Proporciona las dimensiones actuales de la ventana con actualizaciones reactivas.
 * 
 * En Vue:
 * const { width, height } = useWindowSize()
 * // width y height son refs reactivos
 * 
 * En React:
 * const { width, height } = useWindowSize()
 * // Se actualiza el componente cuando cambian
 * 
 * Importante: Este hook causa re-renders en cada resize.
 * Para optimizar, considera usar useBreakpoint si solo necesitas
 * detectar puntos de quiebre específicos.
 */

'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Retorna las dimensiones actuales de la ventana
 * 
 * @param debounceMs - Opcional: debounce en milisegundos (default: 0)
 * @returns { width, height }
 */
export function useWindowSize(debounceMs: number = 0): WindowSize {
  // Estado inicial: undefined para SSR, luego se actualiza
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Establecer el tamaño inicial
    handleResize();

    // Escuchar cambios
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Aplicar debounce si se especifica
  const debouncedSize = useDebounce(windowSize, debounceMs);
  
  return debounceMs > 0 ? debouncedSize : windowSize;
}

/**
 * Hook optimizado que solo se actualiza en puntos de quiebre específicos
 * Evita re-renders innecesarios
 */
export function useWindowSizeThrottled(
  breakpoints: number[] = [640, 768, 1024, 1280]
): WindowSize & { breakpointIndex: number } {
  const { width, height } = useWindowSize(100);

  // Calcular el índice del breakpoint actual
  const breakpointIndex = breakpoints.filter((bp) => width >= bp).length;

  return { width, height, breakpointIndex };
}

/**
 * Hook que retorna si la ventana es más pequeña que un ancho específico
 * Útil para lógica condicional móvil
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const { width } = useWindowSize();
  return width > 0 && width < breakpoint;
}

/**
 * Hook que retorna orientación del dispositivo
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const { width, height } = useWindowSize();
  return height > width ? 'portrait' : 'landscape';
}

export default useWindowSize;
