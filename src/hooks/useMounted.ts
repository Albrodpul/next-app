/**
 * useMounted Hook
 * 
 * Este hook es el equivalente de onMounted en Vue.
 * 
 * En Vue, usamos lifecycle hooks:
 * onMounted(() => {
 *   console.log('Componente montado')
 *   initializeThirdPartyLibrary()
 * })
 * 
 * En React, usamos useEffect con array de dependencias vacío:
 * useEffect(() => {
 *   console.log('Componente montado')
 * }, [])
 * 
 * Este hook proporciona un boolean para saber si estamos montados,
 * útil para:
 * 1. Evitar actualizaciones de estado después del desmontaje
 * 2. Renderizado condicional que requiere el DOM
 * 3. Evitar errores de SSR
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Retorna true cuando el componente está montado
 * Útil para renderizado condicional que necesita el DOM
 */
export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

/**
 * Retorna una ref que indica si el componente está montado
 * Útil para verificar antes de actualizar estado en callbacks async
 * 
 * Ejemplo:
 * const isMountedRef = useIsMountedRef()
 * 
 * const fetchData = async () => {
 *   const data = await api.get('/data')
 *   // Verificar que aún estamos montados antes de actualizar estado
 *   if (isMountedRef.current) {
 *     setData(data)
 *   }
 * }
 */
export function useIsMountedRef(): React.MutableRefObject<boolean> {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Cleanup: marcar como desmontado
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}

/**
 * Ejecuta un callback solo cuando el componente está montado
 * Similar a onMounted de Vue
 * 
 * @param callback - Función a ejecutar cuando se monta
 */
export function useOnMounted(callback: () => void | (() => void)): void {
  useEffect(() => {
    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío = solo ejecutar al montar
}

/**
 * Ejecuta un callback cuando el componente se desmonta
 * Similar a onUnmounted de Vue
 * 
 * @param callback - Función a ejecutar cuando se desmonta
 */
export function useOnUnmounted(callback: () => void): void {
  useEffect(() => {
    return callback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Retorna una función para verificar si es seguro actualizar estado
 * Útil para callbacks asíncronos
 */
export function useSafeState<T>(
  initialState: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const isMountedRef = useIsMountedRef();

  const setSafeState = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (isMountedRef.current) {
        setState(value);
      }
    },
    [isMountedRef]
  );

  return [state, setSafeState];
}

export default useMounted;
