'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import styles from './PressSection.module.scss'

interface PressSectionProps {
  onAllPress: () => void
}

export function PressSection({ onAllPress }: PressSectionProps) {
  const t = useTranslations()

  // Placeholder press items
  const pressItems = [
    { id: 1, logo: 'Forbes', title: 'The Future of Luxury Travel' },
    { id: 2, logo: 'Condé Nast', title: 'Paradise a La Carte Redefines Travel' },
    { id: 3, logo: 'Travel+Leisure', title: 'Top 10 Travel Experiences of 2024' },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="heading3">{t('press')}</h2>
        <p className="body1">{t('press_subtitle')}</p>
      </div>

      <div className={styles.grid}>
        {pressItems.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.logo}>{item.logo}</div>
            <p className="body2">{item.title}</p>
          </div>
        ))}
      </div>

      <div className={styles.action}>
        <Button variant="secondary" onClick={onAllPress}>
          {t('view_all')}
        </Button>
      </div>
    </section>
  )
}

export default PressSection
