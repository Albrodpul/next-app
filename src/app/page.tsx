'use client'

/**
 * EXPLICACIÓN: Página principal (Home)
 * 
 * Esta es la página principal de la aplicación.
 * Equivalente a pages/index.vue en Nuxt.
 * 
 * ESTRUCTURA DE PÁGINAS EN NEXT.JS:
 * 
 * Next.js usa un sistema de archivos para las rutas:
 * - app/page.tsx        → /
 * - app/about/page.tsx  → /about
 * - app/[id]/page.tsx   → /123, /abc (rutas dinámicas)
 * 
 * Nuxt:
 * - pages/index.vue     → /
 * - pages/about.vue     → /about
 * - pages/[id].vue      → /123, /abc
 * 
 * DIFERENCIAS EN EL COMPONENTE:
 * 
 * 1. ASYNC COMPONENTS:
 *    Vue:   defineAsyncComponent(() => import('@/components/Home.vue'))
 *    React: dynamic(() => import('@/components/Home'), { ssr: false })
 *           o usar React.lazy() con Suspense
 * 
 * 2. TEMPLATE vs JSX:
 *    Vue tiene <template> separado del <script>
 *    React mezcla lógica y markup en JSX dentro del return
 * 
 * 3. LIFECYCLE:
 *    Vue:   onMounted(), onUnmounted(), watch()
 *    React: useEffect()
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { useAuth } from '@/contexts/AuthContext'
import { useEventBus } from '@/contexts/EventBusContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ScrollDownAnimation } from '@/components/home/ScrollDownAnimation'
import styles from './page.module.scss'

// Lazy loading de componentes pesados
// Esto mejora el tiempo de carga inicial
const CuratedExperiences = dynamic(
  () => import('@/components/home/CuratedExperiences'),
  { 
    loading: () => <div className={styles.loading}>Loading...</div>,
    ssr: false 
  }
)

const ParadiseExclusive = dynamic(
  () => import('@/components/home/ParadiseExclusive'),
  { 
    loading: () => <div className={styles.loading}>Loading...</div>,
    ssr: false 
  }
)

const ShowMeTabs = dynamic(
  () => import('@/components/home/ShowMeTabs'),
  { 
    loading: () => <div className={styles.loading}>Loading...</div>,
    ssr: false 
  }
)

const LatestExperiencesSection = dynamic(
  () => import('@/components/home/show-me/LatestExperiencesSection'),
  { ssr: false }
)

const ActivitiesSection = dynamic(
  () => import('@/components/home/show-me/ActivitiesSection'),
  { ssr: false }
)

const ToursSection = dynamic(
  () => import('@/components/home/show-me/ToursSection'),
  { ssr: false }
)

const AccommodationsSection = dynamic(
  () => import('@/components/home/show-me/AccommodationsSection'),
  { ssr: false }
)

const RestaurantsSection = dynamic(
  () => import('@/components/home/show-me/RestaurantsSection'),
  { ssr: false }
)

const ServicesSection = dynamic(
  () => import('@/components/home/show-me/ServicesSection'),
  { ssr: false }
)

const DestinationsSection = dynamic(
  () => import('@/components/home/show-me/DestinationsSection'),
  { ssr: false }
)

const HelpSection = dynamic(
  () => import('@/components/home/HelpSection'),
  { ssr: false }
)

const AppSection = dynamic(
  () => import('@/components/home/AppSection'),
  { ssr: false }
)

const PressSection = dynamic(
  () => import('@/components/home/PressSection'),
  { ssr: false }
)

export default function HomePage() {
  const router = useRouter()
  const t = useTranslations()
  const { user, isAuthenticated } = useAuth()
  const { emit, on } = useEventBus()
  const { isMobile } = useBreakpoint()

  // Referencias a elementos DOM
  const headerRef = useRef<HTMLDivElement>(null)
  const curatedRef = useRef<HTMLDivElement>(null)

  // Estado local
  const [isFixed, setIsFixed] = useState(false)
  const [stickyOffset, setStickyOffset] = useState<number | null>(null)
  const [activeShowMeTab, setActiveShowMeTab] = useState('experiences')

  /**
   * Calcular el offset del header sticky
   * Equivalente al método calculateOffset() en Vue
   */
  const calculateOffset = useCallback(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect()
      setStickyOffset(rect.top + window.pageYOffset)
    }
  }, [])

  /**
   * Manejar el scroll para el header sticky
   * Equivalente al método handleScroll() en Vue
   */
  useEffect(() => {
    const handleScroll = () => {
      if (stickyOffset !== null) {
        setIsFixed(window.pageYOffset > stickyOffset)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', calculateOffset)

    // Calcular offset inicial
    calculateOffset()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateOffset)
    }
  }, [stickyOffset, calculateOffset])

  /**
   * Emitir evento cuando cambia isFixed
   * Equivalente al watch de Vue
   */
  useEffect(() => {
    emit('darkBackgroundScrolled', isFixed)
  }, [isFixed, emit])

  /**
   * Scroll suave a la sección de experiencias
   */
  const scrollToExperiences = useCallback(() => {
    if (curatedRef.current) {
      const offset = 50
      const topPosition =
        curatedRef.current.getBoundingClientRect().top + window.scrollY - offset

      window.scrollTo({
        top: topPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  return (
    <div className={styles.container}>
      {/* Header - se vuelve oscuro al hacer scroll */}
      <Header isDark={true} />

      {/* Hero Section - Video de fondo */}
      <section className={styles.hero}>
        <video
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/home-desktop.webm" type="video/webm" />
          {t('browser_not_support_tag')}
        </video>

        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>
            <h1 className="heading2">
              {t('welcome_to')}&nbsp;
              <span className="heading2-italic">Paradise</span>
              {isAuthenticated && `, ${user?.first_name}`}
            </h1>
          </div>

          <div className={styles.heroSubtitle}>
            <p className="heading3">
              {t('limitless_travel_one_place1')}{' '}
              <span className="heading3-italic">
                {t('limitless_travel_one_place2')}
              </span>{' '}
              {t('limitless_travel_one_place3')}
            </p>
          </div>
        </div>

        <ScrollDownAnimation onClick={scrollToExperiences} />
      </section>

      {/* Curated Experiences Section */}
      <div ref={curatedRef}>
        <CuratedExperiences
          onAllExperiences={() => router.push('/experiences')}
        />
      </div>

      {/* Paradise Exclusive Section */}
      <ParadiseExclusive
        onAllExperiences={() => router.push('/experiences')}
      />

      {/* Show Me Tabs Section */}
      <div ref={headerRef} className={clsx(styles.showMeWrapper)}>
        <ShowMeTabs
          isFixed={isFixed}
          activeTab={activeShowMeTab}
          onTabChange={setActiveShowMeTab}
        />
      </div>

      {/* Content Sections */}
      <div className={styles.showMeContent}>
        {activeShowMeTab === 'experiences' && <LatestExperiencesSection />}
        {activeShowMeTab === 'activities' && <ActivitiesSection />}
        {activeShowMeTab === 'tours' && <ToursSection />}
        {activeShowMeTab === 'accommodations' && <AccommodationsSection />}
        {activeShowMeTab === 'restaurants' && <RestaurantsSection />}
        {activeShowMeTab === 'services' && <ServicesSection />}
        {activeShowMeTab === 'destinations' && <DestinationsSection />}
      </div>

      {/* Help Section */}
      <HelpSection whiteBackground />

      {/* App Download Section */}
      <AppSection />

      {/* Press Section */}
      <PressSection onAllPress={() => router.push('/press')} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
