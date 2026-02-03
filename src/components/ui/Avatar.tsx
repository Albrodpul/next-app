'use client'

/**
 * EXPLICACIÓN: Componente Avatar
 * 
 * Muestra la imagen de perfil del usuario o sus iniciales.
 * Similar al componente UtilsAvatar.vue del proyecto original.
 */

import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './Avatar.module.scss'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  className?: string
}

// Tamaños en píxeles
const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
}

/**
 * Obtiene las iniciales de un nombre
 * "John Doe" → "JD"
 */
function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const pixelSize = sizeMap[size]
  const initials = getInitials(name)

  // Si hay imagen, mostrarla
  if (src) {
    return (
      <div 
        className={clsx(styles.avatar, styles[size], className)}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <Image
          src={src}
          alt={name || 'Avatar'}
          width={pixelSize}
          height={pixelSize}
          className={styles.image}
        />
      </div>
    )
  }

  // Si no hay imagen, mostrar iniciales
  return (
    <div
      className={clsx(styles.avatar, styles.initials, styles[size], className)}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <span>{initials}</span>
    </div>
  )
}

export default Avatar
