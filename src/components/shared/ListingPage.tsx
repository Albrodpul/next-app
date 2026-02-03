'use client'

/**
 * ListingPage - Componente compartido para páginas de listado
 * 
 * Este componente encapsula la estructura común de las páginas
 * como experiences, activities, tours, etc.
 * 
 * Incluye:
 * - Video de intro
 * - Tabs de navegación
 * - Contenido principal
 */

import { useState, useEffect, useRef, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getExploreItems } from '@/utils/exploreItems'
import { useEventBus } from '@/contexts/EventBusContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import styles from './ListingPage.module.scss'
import clsx from 'clsx'

interface ListingPageProps {
  /** Título de la página */
  title: string
  /** Descripción opcional */
  description?: string
  /** URL del video de intro */
  videoUrl?: string
  /** Poster del video (fallback image) */
  videoPoster?: string
  /** Tab activa inicial */
  activeTab: string
  /** Contenido de la página */
  children: ReactNode
  /** Si mostrar tabs de navegación */
  showTabs?: boolean
}

export function ListingPage({
  title,
  description,
  videoUrl,
  videoPoster,
  activeTab,
  children,
  showTabs = true,
}: ListingPageProps) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const { emit } = useEventBus()
  const { isDesktop } = useBreakpoint()
  
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const exploreItems = getExploreItems()

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const threshold = isDesktop ? 330 : 150

    if (scrollTop > 0) {
      emit('showSearchInput', true)
    } else {
      emit('showSearchInput', false)
    }

    if (scrollTop >= threshold) {
      setIsScrolled(true)
      emit('darkBackgroundScrolled', true)
    } else {
      setIsScrolled(false)
      emit('darkBackgroundScrolled', false)
    }
  }

  const handleTabChange = (tab: string) => {
    const item = exploreItems.find((item) => item.tab === tab)
    if (item && item.route !== pathname) {
      router.push(item.route)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={styles.pageContainer}
      onScroll={handleScroll}
    >
      {/* Intro con video */}
      {videoUrl && (
        <div className={clsx(styles.introContainer, isScrolled && styles.hidden)}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={videoPoster}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className={styles.introOverlay} />
          <div className={styles.introTitle}>
            <h1 
              className="heading2"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {description && <p className="body1">{description}</p>}
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      {showTabs && (
        <div className={clsx(styles.tabsContainer, isScrolled && styles.scrolled)}>
          <div className={styles.tabsInner}>
            <div className={styles.tabs}>
              {exploreItems.map((item) => (
                <button
                  key={item.tab}
                  className={clsx(
                    styles.tab,
                    activeTab === item.tab && styles.active
                  )}
                  onClick={() => handleTabChange(item.tab)}
                >
                  {t(item.label)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className={clsx(styles.content, isScrolled && styles.scrolled)}>
        {children}
      </div>
    </div>
  )
}

export default ListingPage
