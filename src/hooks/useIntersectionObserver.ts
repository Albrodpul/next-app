/**
 * useIntersectionObserver Hook
 * 
 * Similar a useIntersectionObserver de VueUse.
 * Detecta cuando un elemento entra o sale del viewport.
 * 
 * En Vue:
 * const target = ref(null)
 * const { isIntersecting } = useIntersectionObserver(target)
 * 
 * En React:
 * const ref = useRef(null)
 * const { isIntersecting } = useIntersectionObserver(ref)
 * 
 * Útil para:
 * - Lazy loading de imágenes/componentes
 * - Animaciones al entrar en viewport
 * - Infinite scroll
 * - Analytics de visibilidad
 */

'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionState {
  isIntersecting: boolean;
  intersectionRatio: number;
  entry: IntersectionObserverEntry | null;
}

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean; // Si es true, deja de observar cuando es visible
}

/**
 * Hook que observa cuando un elemento entra/sale del viewport
 * 
 * @param elementRef - Ref del elemento a observar
 * @param options - Opciones del IntersectionObserver
 * @returns Estado de intersección
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>,
  options: UseIntersectionObserverOptions = {}
): IntersectionState {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const [state, setState] = useState<IntersectionState>({
    isIntersecting: false,
    intersectionRatio: 0,
    entry: null,
  });

  // Ref para trackear si ya fue visible (para freezeOnceVisible)
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Si ya está congelado, no hacer nada
    if (frozen.current && freezeOnceVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        setState({
          isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          entry,
        });

        // Congelar si la opción está activa y el elemento es visible
        if (isIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, root, rootMargin, threshold, freezeOnceVisible]);

  return state;
}

/**
 * Hook que retorna una ref y automáticamente la observa
 * Más conveniente cuando no necesitas la ref para otra cosa
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const { isIntersecting } = useIntersectionObserver(ref, options);

  return [ref, isIntersecting];
}

/**
 * Hook para lazy loading de componentes
 * Retorna true una vez que el elemento ha sido visible
 */
export function useVisibleOnce<T extends HTMLElement = HTMLElement>(): [
  RefObject<T>,
  boolean
] {
  return useInView<T>({ freezeOnceVisible: true });
}

/**
 * Hook para animaciones de entrada
 * Retorna clases CSS basadas en visibilidad
 */
export function useRevealAnimation<T extends HTMLElement = HTMLElement>(
  options: {
    hiddenClass?: string;
    visibleClass?: string;
    threshold?: number;
  } = {}
): [RefObject<T>, string] {
  const {
    hiddenClass = 'opacity-0 translate-y-4',
    visibleClass = 'opacity-100 translate-y-0',
    threshold = 0.1,
  } = options;

  const [ref, isVisible] = useInView<T>({
    threshold,
    freezeOnceVisible: true,
  });

  const className = isVisible ? visibleClass : hiddenClass;

  return [ref, className];
}

export default useIntersectionObserver;
