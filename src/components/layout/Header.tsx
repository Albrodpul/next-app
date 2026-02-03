'use client'

/**
 * EXPLICACIÓN: Componente Header
 * 
 * Este es el header principal de la aplicación.
 * En Vue (Header.vue) tenía más de 1000 líneas.
 * En React lo simplificamos manteniendo la funcionalidad esencial.
 * 
 * DIFERENCIAS PRINCIPALES VUE → REACT:
 * 
 * 1. EVENTOS:
 *    Vue:   @click="router.push('/')"
 *    React: onClick={() => router.push('/')}
 * 
 * 2. CLASES CONDICIONALES:
 *    Vue:   :class="{ 'dark': isDark, 'scrolled': isScrolled }"
 *    React: className={clsx({ dark: isDark, scrolled: isScrolled })}
 *    (usamos la librería clsx para esto)
 * 
 * 3. RENDERIZADO CONDICIONAL:
 *    Vue:   v-if="isScrolled"
 *    React: {isScrolled && <Component />}
 * 
 * 4. MOSTRAR/OCULTAR:
 *    Vue:   v-show="condition" (CSS display:none)
 *    React: style={{ display: condition ? 'block' : 'none' }}
 *           o usar clases CSS
 * 
 * 5. ESTADO REACTIVO:
 *    Vue:   ref(false) → value.value = true
 *    React: useState(false) → setValue(true)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { useAuth } from '@/contexts/AuthContext'
import { useEventBus } from '@/contexts/EventBusContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'
import styles from './Header.module.scss'

interface HeaderProps {
  isDark?: boolean
  darkBackground?: boolean
  lightBackground?: boolean
}

export function Header({
  isDark = false,
  darkBackground = false,
  lightBackground = false,
}: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()
  const { user, isAuthenticated } = useAuth()
  const { emit, on } = useEventBus()
  const { width, isMobile } = useBreakpoint()

  // Estado local
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkCopy, setIsDarkCopy] = useState(isDark)
  const [darkBackgroundCopy, setDarkBackgroundCopy] = useState(darkBackground)
  const [darkBackgroundScrolled, setDarkBackgroundScrolled] = useState(false)
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Manejar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Escuchar eventos del bus
  useEffect(() => {
    const unsubscribe1 = on('darkBackgroundScrolled', (value) => {
      setDarkBackgroundScrolled(value)
    })

    const unsubscribe2 = on('showSearchInput', (value) => {
      setShowSearchInput(value)
    })

    return () => {
      unsubscribe1()
      unsubscribe2()
    }
  }, [on])

  // Actualizar estados cuando cambian las props
  useEffect(() => {
    setIsDarkCopy(isDark)
    setDarkBackgroundCopy(darkBackground)
  }, [isDark, darkBackground])

  // Handlers
  const handleGoToDonatella = useCallback(() => {
    if (isAuthenticated) {
      router.push('/donatella')
    } else {
      emit('showLoginDialog', { url: '/donatella' })
    }
  }, [isAuthenticated, router, emit])

  const handleShowLogin = useCallback(() => {
    emit('showLoginDialog', {})
  }, [emit])

  // Determinar el logo correcto según el estado
  const logoSrc = !isDarkCopy && !isScrolled
    ? '/logos/PALC_Black.svg'
    : '/logos/PALC_White.svg'

  const smallLogoSrc = !isDarkCopy && !isScrolled
    ? '/logos/PALC_Marque_Black.svg'
    : '/logos/PALC_Marque_White.svg'

  return (
    <header
      className={clsx(
        styles.header,
        {
          [styles.dark]: isDarkCopy,
          [styles.scrolled]: isScrolled,
          [styles.darkBackground]: darkBackgroundCopy,
          [styles.lightBackground]: lightBackground,
          [styles.darkBackgroundScrolled]: darkBackgroundScrolled,
        }
      )}
    >
      {/* Logo pequeño (solo móvil) */}
      <Link href="/" className={styles.smallLogo}>
        <Image
          src={smallLogoSrc}
          alt="Paradise a La Carte"
          width={40}
          height={40}
          priority
        />
      </Link>

      {/* Logo texto (desktop) */}
      <Link href="/" className={styles.logoText}>
        <Image
          src={logoSrc}
          alt="Paradise a La Carte"
          width={180}
          height={40}
          priority
        />
      </Link>

      {/* Acciones de usuario */}
      <div className={styles.userActions}>
        {isAuthenticated ? (
          // Usuario autenticado
          <button
            className={styles.userMenu}
            onClick={() => setShowMobileMenu(true)}
          >
            <Avatar
              src={user?.avatar}
              name={user?.first_name}
              size="sm"
            />
            <Icon
              name={isScrolled || darkBackgroundCopy ? '24px/menu' : '24px/menu'}
              color={isDarkCopy || isScrolled ? 'white' : 'black'}
            />
          </button>
        ) : (
          // Usuario no autenticado
          <>
            {!isMobile && (
              <Button
                variant={isScrolled || darkBackgroundCopy ? 'transparent' : 'dark'}
                size="sm"
                onClick={handleShowLogin}
              >
                {t('login')}
              </Button>
            )}
            <button
              className={styles.menuButton}
              onClick={() => setShowMobileMenu(true)}
            >
              <Icon
                name="24px/menu"
                color={isDarkCopy || isScrolled ? 'white' : 'black'}
              />
            </button>
          </>
        )}
      </div>

      {/* Mobile menu drawer - simplificado */}
      {showMobileMenu && (
        <div className={styles.mobileMenuOverlay} onClick={() => setShowMobileMenu(false)}>
          <nav className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setShowMobileMenu(false)}
            >
              <Icon name="24px/close" />
            </button>

            <div className={styles.menuLinks}>
              <Link href="/experiences" onClick={() => setShowMobileMenu(false)}>
                {t('experiences')}
              </Link>
              <Link href="/activities" onClick={() => setShowMobileMenu(false)}>
                {t('activities')}
              </Link>
              <Link href="/tours" onClick={() => setShowMobileMenu(false)}>
                {t('tours')}
              </Link>
              <Link href="/accommodations" onClick={() => setShowMobileMenu(false)}>
                {t('accommodations')}
              </Link>
              <Link href="/restaurants" onClick={() => setShowMobileMenu(false)}>
                {t('restaurants')}
              </Link>
              <Link href="/destinations" onClick={() => setShowMobileMenu(false)}>
                {t('destinations')}
              </Link>
            </div>

            <div className={styles.menuDivider} />

            {isAuthenticated ? (
              <div className={styles.menuLinks}>
                <Link href="/account" onClick={() => setShowMobileMenu(false)}>
                  {t('my_account')}
                </Link>
                <Link href="/your-itineraries" onClick={() => setShowMobileMenu(false)}>
                  {t('my_itineraries')}
                </Link>
                <Link href="/reservations" onClick={() => setShowMobileMenu(false)}>
                  {t('my_reservations')}
                </Link>
              </div>
            ) : (
              <div className={styles.menuActions}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setShowMobileMenu(false)
                    handleShowLogin()
                  }}
                >
                  {t('login')}
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setShowMobileMenu(false)
                    router.push('/register')
                  }}
                >
                  {t('register')}
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
