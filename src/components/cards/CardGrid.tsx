'use client'

/**
 * CardGrid - Grid de tarjetas
 * 
 * Componente que muestra una grilla de tarjetas de experiencias,
 * actividades, tours, etc. con soporte para loading y estado vacío.
 */

import { ExperienceCard, type ExperienceCardProps } from './ExperienceCard'
import styles from './CardGrid.module.scss'

interface CardGridProps {
  items: ExperienceCardProps[]
  loading?: boolean
  emptyMessage?: string
  columns?: 2 | 3 | 4
  variant?: 'default' | 'horizontal' | 'large' | 'compact'
  onFavoriteToggle?: (uuid: string) => void
}

export function CardGrid({
  items,
  loading = false,
  emptyMessage = 'No items found',
  columns = 3,
  variant = 'default',
  onFavoriteToggle,
}: CardGridProps) {
  if (loading) {
    return (
      <div className={styles.grid} data-columns={columns}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine} style={{ width: '60%' }} />
              <div className={styles.skeletonLine} style={{ width: '80%' }} />
              <div className={styles.skeletonLine} style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={styles.grid} data-columns={columns}>
      {items.map((item) => (
        <ExperienceCard
          key={item.uuid}
          {...item}
          variant={variant}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  )
}

export default CardGrid
