'use client'

/**
 * EXPLICACIÓN: Componente Button
 * 
 * Este componente reemplaza a ElButton de Element Plus.
 * 
 * DIFERENCIAS VUE (Element Plus) vs REACT:
 * 
 * Vue:
 *   <ElButton type="primary" @click="handleClick">Click me</ElButton>
 * 
 * React:
 *   <Button variant="primary" onClick={handleClick}>Click me</Button>
 * 
 * NOMENCLATURA:
 * - En Element Plus se usa "type" para el estilo del botón
 * - En React, "type" se reserva para el tipo HTML (submit, button, reset)
 * - Por eso usamos "variant" para el estilo visual
 * 
 * VARIANTES DISPONIBLES:
 * - primary: Botón azul principal
 * - secondary: Botón gris secundario
 * - transparent: Botón transparente con borde
 * - icon: Botón solo con icono
 * - link: Botón que parece un enlace
 * - gold: Botón dorado (gradient)
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'transparent'
  | 'icon'
  | 'link'
  | 'gold'
  | 'dark'
  | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  withBlur?: boolean
}

/**
 * forwardRef permite pasar una referencia al elemento DOM interno.
 * Esto es útil para:
 * - Enfocar el botón programáticamente
 * - Medir su tamaño
 * - Integrarlo con librerías de animación
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      withBlur = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          styles.button,
          styles[variant],
          styles[size],
          {
            [styles.fullWidth]: fullWidth,
            [styles.loading]: loading,
            [styles.withBlur]: withBlur,
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.spinner}>
            <svg
              className={styles.spinnerIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
              />
            </svg>
          </span>
        )}
        <span className={clsx(styles.content, { [styles.hidden]: loading })}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
