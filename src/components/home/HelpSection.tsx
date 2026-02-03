'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { Button } from '@/components/ui/Button'
import styles from './HelpSection.module.scss'

interface HelpSectionProps {
  whiteBackground?: boolean
}

export function HelpSection({ whiteBackground = false }: HelpSectionProps) {
  const t = useTranslations()

  return (
    <section className={clsx(styles.section, { [styles.white]: whiteBackground })}>
      <div className={styles.content}>
        <h2 className="heading3">{t('need_help')}</h2>
        <p className="body1">
          Our concierge team is available 24/7 to assist you with any questions.
        </p>
        <div className={styles.actions}>
          <Button variant="primary">{t('contact_support')}</Button>
          <Button variant="secondary">{t('chat_with_us')}</Button>
        </div>
      </div>
    </section>
  )
}

export default HelpSection
