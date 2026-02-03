/**
 * useScroll Hook
 * 
 * Similar a useScroll de VueUse.
 * Proporciona información sobre el scroll de la página o un elemento.
 * 
 * En Vue:
 * const { y, arrivedState } = useScroll(window)
 * // y.value = posición actual del scroll
 * 
 * En React:
 * const { y, isAtTop, isAtBottom } = useScroll()
 * // y = posición actual, isAtTop/Bottom = booleans de estado
 * 
 * Útil para:
 * - Headers que cambian estilo al hacer scroll
 * - Infinite scroll
 * - Animaciones basadas en scroll
 * - Mostrar/ocultar botón "scroll to top"
 */

'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface ScrollState {
  x: number;
  y: number;
  isScrolling: boolean;
  isAtTop: boolean;
  isAtBottom: boolean;
  isAtLeft: boolean;
  isAtRight: boolean;
  direction: 'up' | 'down' | 'left' | 'right' | null;
}

interface UseScrollOptions {
  throttleMs?: number;
  offset?: number; // Tolerancia para detectar bordes
}

/**
 * Hook para trackear el scroll de la ventana
 * 
 * @param options - Opciones de configuración
 * @returns Estado del scroll
 */
export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { throttleMs = 0, offset = 50 } = options;
  
  const [scrollState, setScrollState] = useState<ScrollState>({
    x: 0,
    y: 0,
    isScrolling: false,
    isAtTop: true,
    isAtBottom: false,
    isAtLeft: true,
    isAtRight: false,
    direction: null,
  });

  const lastY = useRef(0);
  const lastX = useRef(0);
  const scrollingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollState = () => {
      const x = window.scrollX;
      const y = window.scrollY;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const maxX = document.documentElement.scrollWidth - window.innerWidth;

      // Determinar dirección
      let direction: ScrollState['direction'] = null;
      if (y > lastY.current) direction = 'down';
      else if (y < lastY.current) direction = 'up';
      else if (x > lastX.current) direction = 'right';
      else if (x < lastX.current) direction = 'left';

      lastY.current = y;
      lastX.current = x;

      setScrollState({
        x,
        y,
        isScrolling: true,
        isAtTop: y <= offset,
        isAtBottom: y >= maxY - offset,
        isAtLeft: x <= offset,
        isAtRight: x >= maxX - offset,
        direction,
      });

      // Detectar cuando el scroll termina
      if (scrollingTimeout.current) {
        clearTimeout(scrollingTimeout.current);
      }
      scrollingTimeout.current = setTimeout(() => {
        setScrollState((prev) => ({ ...prev, isScrolling: false }));
      }, 150);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        if (throttleMs > 0) {
          setTimeout(() => {
            window.requestAnimationFrame(updateScrollState);
            ticking = false;
          }, throttleMs);
        } else {
          window.requestAnimationFrame(updateScrollState);
        }
        ticking = true;
      }
    };

    // Estado inicial
    updateScrollState();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollingTimeout.current) {
        clearTimeout(scrollingTimeout.current);
      }
    };
  }, [throttleMs, offset]);

  return scrollState;
}

/**
 * Hook para trackear scroll de un elemento específico
 */
export function useElementScroll<T extends HTMLElement = HTMLElement>(
  options: UseScrollOptions = {}
): [RefObject<T>, ScrollState] {
  const ref = useRef<T>(null);
  const { offset = 50 } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    x: 0,
    y: 0,
    isScrolling: false,
    isAtTop: true,
    isAtBottom: false,
    isAtLeft: true,
    isAtRight: false,
    direction: null,
  });

  const lastY = useRef(0);
  const lastX = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const x = element.scrollLeft;
      const y = element.scrollTop;
      const maxY = element.scrollHeight - element.clientHeight;
      const maxX = element.scrollWidth - element.clientWidth;

      let direction: ScrollState['direction'] = null;
      if (y > lastY.current) direction = 'down';
      else if (y < lastY.current) direction = 'up';
      else if (x > lastX.current) direction = 'right';
      else if (x < lastX.current) direction = 'left';

      lastY.current = y;
      lastX.current = x;

      setScrollState({
        x,
        y,
        isScrolling: true,
        isAtTop: y <= offset,
        isAtBottom: y >= maxY - offset,
        isAtLeft: x <= offset,
        isAtRight: x >= maxX - offset,
        direction,
      });
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return [ref, scrollState];
}

/**
 * Hook simplificado que solo retorna la posición Y
 * Optimizado para casos donde solo necesitas la posición
 */
export function useScrollY(): number {
  const [y, setY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setY(window.scrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return y;
}

/**
 * Función helper para hacer scroll suave a una posición
 */
export function scrollTo(
  y: number,
  behavior: ScrollBehavior = 'smooth'
): void {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: y, behavior });
}

/**
 * Función helper para scroll al top
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  scrollTo(0, behavior);
}

export default useScroll;
