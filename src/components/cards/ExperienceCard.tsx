'use client'

/**
 * ExperienceCard - Tarjeta de experiencia
 * 
 * Este componente muestra una tarjeta con la información de una experiencia.
 * Es usado en las listas de experiencias, actividades, tours, etc.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getPriceFormat } from '@/utils/price'
import styles from './ExperienceCard.module.scss'
import clsx from 'clsx'

export interface ExperienceCardProps {
  uuid: string
  name: string
  shortDescription?: string
  mainImage?: {
    url: string
    alt?: string
  }
  location?: {
    name: string
    country?: string
  }
  price?: number
  currency?: string
  rating?: number
  isExclusive?: boolean
  isFavorite?: boolean
  variant?: 'default' | 'horizontal' | 'large' | 'compact'
  type?: 'experience' | 'activity' | 'tour' | 'accommodation' | 'restaurant' | 'service' | 'destination'
  onFavoriteToggle?: (uuid: string) => void
}

export function ExperienceCard({
  uuid,
  name,
  shortDescription,
  mainImage,
  location,
  price,
  currency = 'EUR',
  rating,
  isExclusive = false,
  isFavorite = false,
  variant = 'default',
  type = 'experience',
  onFavoriteToggle,
}: ExperienceCardProps) {
  const t = useTranslations()
  const router = useRouter()
  const [favorite, setFavorite] = useState(isFavorite)

  const handleClick = () => {
    const routes: Record<string, string> = {
      experience: '/experiences',
      activity: '/activities',
      tour: '/tours',
      accommodation: '/accommodations',
      restaurant: '/restaurants',
      service: '/services',
      destination: '/destinations',
    }
    router.push(`${routes[type]}/${uuid}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorite(!favorite)
    onFavoriteToggle?.(uuid)
  }

  return (
    <article 
      className={clsx(styles.card, styles[variant])}
      onClick={handleClick}
    >
      <div className={styles.image}>
        {mainImage?.url ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'var(--brand-light-grey)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-mid-grey)'
          }}>
            No Image
          </div>
        )}
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.content}>
        {/* Location */}
        {location && (
          <div className={styles.location}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{location.name}{location.country ? `, ${location.country}` : ''}</span>
          </div>
        )}

        {/* Title */}
        <h3 className={styles.title}>{name}</h3>

        {/* Description */}
        {shortDescription && variant !== 'compact' && (
          <p className={styles.description}>{shortDescription}</p>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          {price !== undefined && (
            <div className={styles.price}>
              <span className={styles.from}>From</span>
              {getPriceFormat(price, currency)}
            </div>
          )}

          {rating !== undefined && (
            <div className={styles.rating}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/>
              </svg>
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default ExperienceCard
