/**
 * usePrevious Hook
 * 
 * Guarda el valor anterior de un estado o prop.
 * No existe equivalente directo en Vue porque los watchers
 * reciben automáticamente (newValue, oldValue).
 * 
 * En Vue (dentro de un watcher):
 * watch(count, (newCount, oldCount) => {
 *   console.log(`Cambió de ${oldCount} a ${newCount}`)
 * })
 * 
 * En React:
 * const count = useState(0)
 * const prevCount = usePrevious(count)
 * useEffect(() => {
 *   console.log(`Cambió de ${prevCount} a ${count}`)
 * }, [count])
 * 
 * Útil para:
 * - Comparar valores antes y después
 * - Animaciones de transición
 * - Detectar dirección de cambio
 */

'use client';

import { useRef, useEffect } from 'react';

/**
 * Retorna el valor anterior de una variable
 * 
 * @param value - El valor actual a trackear
 * @returns El valor anterior (undefined en el primer render)
 */
export function usePrevious<T>(value: T): T | undefined {
  // useRef persiste el valor entre renders sin causar re-render
  const ref = useRef<T | undefined>(undefined);

  // useEffect se ejecuta DESPUÉS del render
  // Por eso cuando retornamos ref.current, aún tiene el valor anterior
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // En el render actual, ref.current aún tiene el valor del render anterior
  return ref.current;
}

/**
 * Versión que permite especificar un valor inicial
 * Útil cuando undefined no es un valor válido
 */
export function usePreviousWithInitial<T>(value: T, initialValue: T): T {
  const ref = useRef<T>(initialValue);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook que retorna si el valor cambió desde el render anterior
 */
export function useHasChanged<T>(value: T): boolean {
  const prev = usePrevious(value);
  return prev !== undefined && prev !== value;
}

/**
 * Hook que detecta la dirección de cambio de un número
 */
export function useChangeDirection(
  value: number
): 'up' | 'down' | 'same' | 'initial' {
  const prev = usePrevious(value);

  if (prev === undefined) return 'initial';
  if (value > prev) return 'up';
  if (value < prev) return 'down';
  return 'same';
}

export default usePrevious;
