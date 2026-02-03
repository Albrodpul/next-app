/**
 * useDebounce Hook
 * 
 * Este hook es equivalente al useDebounce de VueUse.
 * 
 * ¿Qué es debounce?
 * - Retrasa la ejecución hasta que el usuario deja de escribir/actuar
 * - Útil para búsquedas, validaciones, y llamadas API
 * 
 * En Vue:
 * const searchTerm = ref('')
 * const debouncedSearch = useDebounceFn((value) => {
 *   api.search(value)
 * }, 300)
 * watch(searchTerm, debouncedSearch)
 * 
 * En React:
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedTerm = useDebounce(searchTerm, 300)
 * useEffect(() => {
 *   api.search(debouncedTerm)
 * }, [debouncedTerm])
 * 
 * La diferencia clave es que en React el valor debounced es un estado
 * derivado que puedes usar directamente.
 */

import { useState, useEffect } from 'react';

/**
 * Retorna un valor debounced que solo se actualiza después de que
 * el valor original deja de cambiar por el delay especificado.
 * 
 * @param value - El valor a debounce
 * @param delay - Milisegundos a esperar (default: 300)
 * @returns El valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  // Estado interno para el valor debounced
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cada vez que el valor cambia, establecemos un timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: si el valor cambia antes de que termine el timer,
    // cancelamos el timer anterior (esto es el "debounce")
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-ejecutar cuando value o delay cambien

  return debouncedValue;
}

/**
 * Hook alternativo que retorna una función debounced
 * Más similar al patrón de VueUse
 * 
 * @param fn - La función a debounce
 * @param delay - Milisegundos a esperar
 * @returns Función debounced
 */
export function useDebounceFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      fn(...args);
    }, delay);

    setTimeoutId(id);
  };
}

export default useDebounce;
