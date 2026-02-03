'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import styles from './AppSection.module.scss'

export function AppSection() {
  const t = useTranslations()

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2 className="heading3">{t('download_app')}</h2>
          <p className="body1">{t('download_app_subtitle')}</p>
          
          <div className={styles.stores}>
            <a
              href={process.env.NEXT_PUBLIC_IOS_APP_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeButton}
            >
              <Image
                src="/images/app-store-badge.svg"
                alt={t('app_store')}
                width={140}
                height={42}
              />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_ANDROID_APP_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeButton}
            >
              <Image
                src="/images/google-play-badge.svg"
                alt={t('google_play')}
                width={140}
                height={42}
              />
            </a>
          </div>
        </div>

        <div className={styles.phoneImage}>
          <div className={styles.phonePlaceholder}>
            <span>App Preview</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppSection
