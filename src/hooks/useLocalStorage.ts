/**
 * useLocalStorage Hook
 * 
 * Similar a useLocalStorage de VueUse o useStorage.
 * 
 * En Vue:
 * const user = useLocalStorage('user', { name: '', token: '' })
 * user.value.name = 'John' // Se guarda automáticamente
 * 
 * En React:
 * const [user, setUser] = useLocalStorage('user', { name: '', token: '' })
 * setUser({ ...user, name: 'John' }) // Hay que llamar al setter
 * 
 * Diferencias importantes:
 * 1. En Vue, useLocalStorage retorna un ref reactivo que sincroniza automáticamente
 * 2. En React, retornamos un estado y un setter como useState
 * 3. Debemos manejar SSR (server-side rendering) porque localStorage no existe en el servidor
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para persistir estado en localStorage
 * 
 * @param key - La clave para localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns Tuple [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Estado para almacenar el valor
  // Usamos una función lazy initializer para evitar leer localStorage en cada render
  const [storedValue, setStoredValue] = useState<T>(() => {
    // En SSR, localStorage no existe
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Efecto para sincronizar con localStorage cuando el valor cambia
  // Separamos esto del estado para manejar SSR correctamente
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Función para actualizar el valor
  // useCallback evita re-crear la función en cada render
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        // Si value es una función, la ejecutamos con el valor anterior
        // Esto permite usar el patrón: setValue(prev => ({ ...prev, name: 'John' }))
        const valueToStore = value instanceof Function ? value(prev) : value;
        return valueToStore;
      });
    },
    []
  );

  // Función para eliminar el valor de localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook para escuchar cambios de localStorage desde otras pestañas
 * 
 * Útil cuando quieres sincronizar estado entre pestañas del navegador
 */
export function useLocalStorageListener<T>(
  key: string,
  callback: (newValue: T | null) => void
): void {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          callback(newValue);
        } catch {
          callback(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, callback]);
}

export default useLocalStorage;
