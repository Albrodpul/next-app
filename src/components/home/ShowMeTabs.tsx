'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import styles from './ShowMeTabs.module.scss'

interface ShowMeTabsProps {
  isFixed: boolean
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

const tabs = [
  { id: 'experiences', label: 'experiences', route: '/experiences' },
  { id: 'activities', label: 'activities', route: '/activities' },
  { id: 'near-by', label: 'near_by', route: '/' },
  { id: 'tours', label: 'tours', route: '/tours' },
  { id: 'accommodations', label: 'accommodations', route: '/accommodations' },
  { id: 'restaurants', label: 'restaurants', route: '/restaurants' },
  { id: 'services', label: 'services', route: '/services' },
  { id: 'destinations', label: 'destinations', route: '/destinations' },
]

export function ShowMeTabs({ isFixed, activeTab, onTabChange }: ShowMeTabsProps) {
  const router = useRouter()
  const t = useTranslations()
  const [internalActiveTab, setInternalActiveTab] = useState('experiences')
  const currentTab = activeTab ?? internalActiveTab

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (onTabChange) {
      onTabChange(tab.id)
      return
    }

    setInternalActiveTab(tab.id)
    if (tab.route !== '/') {
      router.push(tab.route)
    }
  }

  return (
    <div className={clsx(styles.container, { [styles.fixed]: isFixed })}>
      {!isFixed && (
        <div className={styles.title}>
          <h2 className="heading3">{t('show_me')}...</h2>
        </div>
      )}

      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={clsx(styles.tab, { [styles.active]: currentTab === tab.id })}
            onClick={() => handleTabClick(tab)}
          >
            {t(tab.label)}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default ShowMeTabs
