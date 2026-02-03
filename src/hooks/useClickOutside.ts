/**
 * useClickOutside Hook
 * 
 * Detecta clicks fuera de un elemento, útil para cerrar dropdowns, modales, etc.
 * Similar a onClickOutside de VueUse.
 * 
 * En Vue:
 * const target = ref(null)
 * onClickOutside(target, () => {
 *   isOpen.value = false
 * })
 * 
 * En React:
 * const ref = useRef(null)
 * useClickOutside(ref, () => {
 *   setIsOpen(false)
 * })
 */

'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook que detecta clicks fuera de un elemento
 * 
 * @param callback - Función a ejecutar cuando se hace click fuera
 * @param enabled - Opcional: si el listener está activo (default: true)
 * @returns Ref para asignar al elemento
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Si el click fue dentro del elemento, no hacer nada
      if (ref.current && !ref.current.contains(target)) {
        callback(event);
      }
    };

    // Usamos mousedown y touchstart para detectar antes del click completo
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback, enabled]);

  return ref;
}

/**
 * Versión alternativa que acepta una ref existente
 * Útil cuando ya tienes una ref por otras razones
 */
export function useClickOutsideRef<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (ref.current && !ref.current.contains(target)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ref, callback, enabled]);
}

/**
 * Hook para detectar clicks fuera de múltiples elementos
 * Útil para dropdowns con portales
 */
export function useClickOutsideMultiple(
  refs: RefObject<HTMLElement>[],
  callback: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Verificar si el click fue dentro de ALGUNO de los elementos
      const clickedInside = refs.some(
        (ref) => ref.current && ref.current.contains(target)
      );
      
      if (!clickedInside) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [refs, callback, enabled]);
}

export default useClickOutside;
