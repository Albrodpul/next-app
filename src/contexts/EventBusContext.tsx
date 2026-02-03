'use client'

/**
 * EXPLICACIÓN: EventBusContext - Sistema de eventos global
 * 
 * En Vue/Nuxt usabas `mitt` para crear un event bus:
 *   this.$eventBus.$emit('showLoginDialog', { ... })
 *   this.$eventBus.$on('showLoginDialog', handler)
 * 
 * En React, recreamos esta funcionalidad con un Context.
 * 
 * ¿POR QUÉ UN EVENT BUS?
 * Permite que componentes no relacionados se comuniquen entre sí.
 * Por ejemplo: El Header puede emitir un evento que el Layout escucha
 * para mostrar un diálogo de login.
 * 
 * ALTERNATIVAS EN REACT:
 * - Context API (lo que usamos aquí)
 * - Zustand (librería de estado más potente)
 * - Redux (más complejo, para apps grandes)
 * 
 * USO:
 * 
 * Emitir evento:
 *   const { emit } = useEventBus()
 *   emit('showLoginDialog', { url: '/account' })
 * 
 * Escuchar evento:
 *   const { on } = useEventBus()
 *   useEffect(() => {
 *     return on('showLoginDialog', (data) => {
 *       // hacer algo
 *     })
 *   }, [on])
 */

import React, { createContext, useContext, useCallback, useRef, ReactNode } from 'react'

// Tipos de eventos disponibles (puedes agregar más)
interface EventMap {
  showLoginDialog: { url?: string; model?: any; model_uuid?: string; model_type?: string }
  showRegisterDialog: void
  showMembershipDialog: string
  showDonatellaDialog: void
  showAssistanceDialog: void
  closeSearch: void
  showSearchInput: boolean
  darkBackgroundScrolled: boolean
  'toggle-dark-mode': boolean
}

// Tipo para los handlers de eventos
type EventHandler<T> = (data: T) => void

// Tipo para el store de handlers - usando Record genérico para evitar problemas de tipado
type EventHandlers = Record<string, Set<EventHandler<unknown>>>

// Tipo del contexto
interface EventBusContextType {
  emit: <K extends keyof EventMap>(event: K, data?: EventMap[K]) => void
  on: <K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>) => () => void
  off: <K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>) => void
}

const EventBusContext = createContext<EventBusContextType | undefined>(undefined)

interface EventBusProviderProps {
  children: ReactNode
}

export function EventBusProvider({ children }: EventBusProviderProps) {
  // useRef para mantener los handlers entre renders sin causar re-renders
  const handlers = useRef<EventHandlers>({})

  /**
   * Emitir un evento
   * Similar a: this.$eventBus.$emit('showLoginDialog', data)
   */
  const emit = useCallback(<K extends keyof EventMap>(event: K, data?: EventMap[K]) => {
    const eventHandlers = handlers.current[event]
    if (eventHandlers) {
      eventHandlers.forEach((handler) => handler(data as EventMap[K]))
    }
  }, [])

  /**
   * Suscribirse a un evento
   * Similar a: this.$eventBus.$on('showLoginDialog', handler)
   * 
   * Retorna una función para desuscribirse (importante para limpieza)
   */
  const on = useCallback(<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ) => {
    if (!handlers.current[event]) {
      handlers.current[event] = new Set()
    }
    handlers.current[event]!.add(handler as any)

    // Retornar función de limpieza
    return () => {
      handlers.current[event]?.delete(handler as any)
    }
  }, [])

  /**
   * Desuscribirse de un evento
   */
  const off = useCallback(<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ) => {
    handlers.current[event]?.delete(handler as any)
  }, [])

  const value: EventBusContextType = {
    emit,
    on,
    off,
  }

  return (
    <EventBusContext.Provider value={value}>
      {children}
    </EventBusContext.Provider>
  )
}

/**
 * Hook para usar el event bus
 * 
 * Ejemplo:
 * 
 * function MyComponent() {
 *   const { emit, on } = useEventBus()
 * 
 *   // Escuchar eventos
 *   useEffect(() => {
 *     const unsubscribe = on('showLoginDialog', (data) => {
 *       console.log('Login dialog requested:', data)
 *     })
 *     
 *     // Limpiar al desmontar
 *     return unsubscribe
 *   }, [on])
 * 
 *   // Emitir eventos
 *   const handleClick = () => {
 *     emit('showLoginDialog', { url: '/account' })
 *   }
 * 
 *   return <button onClick={handleClick}>Login</button>
 * }
 */
export function useEventBus() {
  const context = useContext(EventBusContext)
  
  if (context === undefined) {
    throw new Error('useEventBus must be used within an EventBusProvider')
  }
  
  return context
}
