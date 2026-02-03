/**
 * Barrel Export para Hooks
 * 
 * En React, es común tener un archivo index que re-exporta
 * todos los hooks para facilitar las importaciones.
 * 
 * En lugar de:
 * import { useDebounce } from '@/hooks/useDebounce'
 * import { useLocalStorage } from '@/hooks/useLocalStorage'
 * 
 * Podemos hacer:
 * import { useDebounce, useLocalStorage } from '@/hooks'
 * 
 * Este patrón es similar a cómo VueUse exporta todos sus composables.
 */

// Hooks de estado y ciclo de vida
export { useMounted, useIsMountedRef, useOnMounted, useOnUnmounted, useSafeState } from './useMounted';
export { usePrevious, usePreviousWithInitial, useHasChanged, useChangeDirection } from './usePrevious';

// Hooks de localStorage
export { useLocalStorage, useLocalStorageListener } from './useLocalStorage';

// Hooks de timing
export { useDebounce, useDebounceFn } from './useDebounce';

// Hooks de UI/DOM
export { useClickOutside, useClickOutsideRef, useClickOutsideMultiple } from './useClickOutside';
export { useWindowSize, useWindowSizeThrottled, useIsMobile, useOrientation } from './useWindowSize';
export { useMediaQuery, usePrefersDarkMode, usePrefersReducedMotion, useIsTouchDevice, usePrefersHighContrast, mediaQueries } from './useMediaQuery';
export { useBreakpoint, breakpoints, type BreakpointKey } from './useBreakpoint';

// Hooks de scroll
export { useScroll, useElementScroll, useScrollY, scrollTo, scrollToTop } from './useScroll';
export { useIntersectionObserver, useInView, useVisibleOnce, useRevealAnimation } from './useIntersectionObserver';
