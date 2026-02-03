import type { Config } from 'tailwindcss'

/**
 * EXPLICACIÓN: tailwind.config.ts
 * 
 * Tailwind CSS es un framework de CSS "utility-first" que permite
 * crear diseños usando clases predefinidas directamente en el HTML/JSX.
 * 
 * Ejemplo Vue:  <div class="bg-blue-500 p-4 rounded">
 * Ejemplo React: <div className="bg-blue-500 p-4 rounded">
 * 
 * La diferencia es que en React usamos `className` en lugar de `class`.
 * 
 * Este archivo extiende los colores y fuentes del diseño original
 * para que estén disponibles como clases de Tailwind.
 */

const config: Config = {
  // Rutas donde Tailwind buscará clases para incluir
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Colores personalizados del proyecto
      // Uso: className="bg-brand-blue" o "text-brand-off-black"
      colors: {
        // Accent Gold
        gold: {
          1: '#99762C',
          2: '#D6B755',
          3: '#F7E470',
        },
        // Brand Palette
        brand: {
          'off-black': '#111111',
          'off-black-hover': '#3D3B3B',
          blue: '#2900BB',
          'blue-hover': '#200385',
          'blue-disabled': '#E9D7FE',
          'mid-grey': '#A8A7AA',
          'off-white': '#F7F7F7',
          white: '#FFFFFF',
        },
        // Validation
        validation: {
          positive: '#3CA30C',
          'positive-light': '#ECFDF3',
          error: '#ED1C24',
          'error-dark': '#97040A',
          'error-light': '#FFEAED',
        },
        // Primary
        primary: {
          main: '#2900BB',
          dark: '#1B007A',
          light: '#6F47FF',
          contrast: '#FFFFFF',
        },
        // Success
        success: {
          main: '#2E7D32',
          dark: '#1B5E20',
          'dark-mode': '#12B76A',
        },
        // Error
        error: {
          main: '#D32F2F',
          dark: '#C62828',
        },
        // Warning
        warning: {
          main: '#ED6C02',
          dark: '#E65100',
        },
        // Info
        info: {
          main: '#0288D1',
          dark: '#01579B',
        },
      },

      // Fuentes personalizadas
      // Uso: className="font-canela" o "font-graphic"
      fontFamily: {
        canela: ['canela-regular', 'serif'],
        'canela-light': ['canela-light', 'serif'],
        'canela-medium': ['canela-medium', 'serif'],
        'canela-bold': ['canela-bold', 'serif'],
        'canela-italic': ['canela-regular-italic', 'serif'],
        graphic: ['graphic-regular', 'sans-serif'],
        'graphic-light': ['graphic-light', 'sans-serif'],
        'graphic-medium': ['graphic-medium', 'sans-serif'],
        'graphic-semibold': ['graphic-semibold', 'sans-serif'],
        'graphic-bold': ['graphic-bold', 'sans-serif'],
      },

      // Breakpoints personalizados (igual que Nuxt)
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      // Gradientes
      backgroundImage: {
        'gradient-primary': 'linear-gradient(269deg, #99762C -8.84%, #D6B755 30.68%, #F7E470 51.01%, #D6B755 77.31%, #99762C 113.03%)',
      },

      // Animaciones
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  plugins: [],
}

export default config
