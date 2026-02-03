'use client'

/**
 * EXPLICACIÓN: Componente Footer
 * 
 * El footer de la aplicación.
 * Similar a UtilsFooter.vue del proyecto original.
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { Icon } from '@/components/ui/Icon'
import styles from './Footer.module.scss'

interface FooterProps {
  darkBackground?: boolean
}

export function Footer({ darkBackground = false }: FooterProps) {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={clsx(styles.footer, { [styles.dark]: darkBackground })}>
      <div className={styles.container}>
        {/* Logo y descripción */}
        <div className={styles.brand}>
          <Link href="/">
            <Image
              src={darkBackground ? '/logos/PALC_White.svg' : '/logos/PALC_Black.svg'}
              alt="Paradise a La Carte"
              width={160}
              height={36}
            />
          </Link>
          <p className={styles.description}>
            {t('footer_description')}
          </p>
        </div>

        {/* Links de navegación */}
        <div className={styles.links}>
          <div className={styles.column}>
            <h4>{t('explore')}</h4>
            <nav>
              <Link href="/experiences">{t('experiences')}</Link>
              <Link href="/activities">{t('activities')}</Link>
              <Link href="/tours">{t('tours')}</Link>
              <Link href="/accommodations">{t('accommodations')}</Link>
              <Link href="/restaurants">{t('restaurants')}</Link>
              <Link href="/destinations">{t('destinations')}</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h4>{t('about_us')}</h4>
            <nav>
              <Link href="/about-us">{t('about_us')}</Link>
              <Link href="/press">{t('press')}</Link>
              <Link href="/contact-us">{t('contact_us')}</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h4>Legal</h4>
            <nav>
              <Link href="/terms-and-conditions">{t('terms_and_conditions')}</Link>
              <Link href="/privacy-policy">{t('privacy_policy')}</Link>
              <Link href="/cookies">{t('cookies_policy')}</Link>
            </nav>
          </div>
        </div>

        {/* Redes sociales */}
        <div className={styles.social}>
          <h4>{t('follow_us')}</h4>
          <div className={styles.socialLinks}>
            <a
              href="https://www.instagram.com/paradisealacarte/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Icon name="social/instagram" />
            </a>
            <a
              href="https://www.facebook.com/paradisealacarte"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Icon name="social/facebook" />
            </a>
            <a
              href="https://twitter.com/CarteParadise"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Icon name="social/twitter" />
            </a>
            <a
              href="https://www.linkedin.com/company/paradise-a-la-carte/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Icon name="social/linkedin" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>© {currentYear} Paradise a La Carte. {t('all_rights_reserved')}</p>
      </div>
    </footer>
  )
}

export default Footer
