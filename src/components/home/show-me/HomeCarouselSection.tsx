'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ExperienceCard } from '@/components/cards'
import type { ExperienceCardProps } from '@/components/cards/ExperienceCard'
import styles from './HomeCarouselSection.module.scss'

export interface HomeCarouselItem {
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
}

interface HomeCarouselSectionProps {
  title: React.ReactNode
  onSeeAll?: () => void
  seeAllLabel: string
  items: HomeCarouselItem[]
  loading: boolean
  emptyMessage: string
  cardType: ExperienceCardProps['type']
  cardVariant?: ExperienceCardProps['variant']
  cardMinWidth?: number
  cardMaxWidth?: number
  gap?: number
  skeletonCount?: number
}

export function HomeCarouselSection({
  title,
  onSeeAll,
  seeAllLabel,
  items,
  loading,
  emptyMessage,
  cardType,
  cardVariant = 'default',
  cardMinWidth = 320,
  cardMaxWidth = 400,
  gap = 24,
  skeletonCount = 4,
}: HomeCarouselSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="heading3">{title}</h2>
        {onSeeAll && (
          <Button variant="link" onClick={onSeeAll}>
            {seeAllLabel}
          </Button>
        )}
      </div>

      <div
        className={styles.carousel}
        style={{ gap }}
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className={styles.skeleton}
                style={{ minWidth: cardMinWidth, flex: `0 0 ${cardMinWidth}px` }}
              >
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonLine} style={{ width: '60%' }} />
                  <div className={styles.skeletonLine} style={{ width: '80%' }} />
                  <div className={styles.skeletonLine} style={{ width: '40%' }} />
                </div>
              </div>
            ))
          : items.map((item) => (
              <div
                key={item.uuid}
                style={{
                  minWidth: cardMinWidth,
                  maxWidth: cardMaxWidth,
                  flex: `0 0 ${cardMinWidth}px`,
                }}
              >
                <ExperienceCard
                  uuid={item.uuid}
                  name={item.name}
                  shortDescription={item.shortDescription}
                  mainImage={item.mainImage}
                  location={item.location}
                  price={item.price}
                  currency={item.currency}
                  isExclusive={item.isExclusive}
                  rating={item.rating}
                  type={cardType}
                  variant={cardVariant}
                />
              </div>
            ))}

        {!loading && items.length === 0 && (
          <div style={{ minWidth: cardMinWidth, flex: `0 0 ${cardMinWidth}px` }}>
            <p className="body1" style={{ color: 'var(--brand-mid-grey)' }}>
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeCarouselSection
