'use client'

/**
 * ItineraryPage - Página de itinerarios
 * 
 * Muestra los itinerarios del usuario.
 * Equivalente a pages/itineraries/index.vue
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui'
import styles from './page.module.scss'

const ITINERARIES_QUERY = gql`
  query MyItineraries($limit: Int, $page: Int) {
    myItineraries(limit: $limit, page: $page) {
      data {
        uuid
        name
        start_date
        end_date
        status
        destination {
          name
          country
        }
        experiences_count
        created_at
      }
      paginatorInfo {
        total
        currentPage
        lastPage
      }
    }
  }
`

export default function ItinerariesPage() {
  const t = useTranslations()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [page, setPage] = useState(1)

  const { data, loading, error } = useQuery(ITINERARIES_QUERY, {
    variables: { limit: 10, page },
    skip: !isAuthenticated,
  })

  // Redirigir si no está autenticado
  if (!authLoading && !isAuthenticated) {
    router.push('/login')
    return null
  }

  const itineraries = data?.myItineraries?.data || []
  const paginatorInfo = data?.myItineraries?.paginatorInfo

  return (
    <>
      <Header isDark={false} />
      
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className="heading2">{t('my_itineraries')}</h1>
            <Button
              variant="primary"
              onClick={() => router.push('/itineraries/create')}
            >
              Create Itinerary
            </Button>
          </div>

          {loading ? (
            <div className={styles.loading}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonText} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error loading itineraries. Please try again.</p>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : itineraries.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"/>
              </svg>
              <h3>No itineraries yet</h3>
              <p>Start planning your next adventure by creating an itinerary.</p>
              <Button
                variant="primary"
                onClick={() => router.push('/itineraries/create')}
              >
                Create your first itinerary
              </Button>
            </div>
          ) : (
            <>
              <div className={styles.list}>
                {itineraries.map((itinerary: any) => (
                  <div
                    key={itinerary.uuid}
                    className={styles.card}
                    onClick={() => router.push(`/itineraries/${itinerary.uuid}`)}
                  >
                    <div className={styles.cardHeader}>
                      <h3>{itinerary.name}</h3>
                      <span className={`${styles.status} ${styles[itinerary.status]}`}>
                        {itinerary.status}
                      </span>
                    </div>
                    
                    {itinerary.destination && (
                      <div className={styles.cardMeta}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>
                          {itinerary.destination.name}, {itinerary.destination.country}
                        </span>
                      </div>
                    )}

                    {(itinerary.start_date || itinerary.end_date) && (
                      <div className={styles.cardMeta}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>
                          {itinerary.start_date} - {itinerary.end_date}
                        </span>
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <span>{itinerary.experiences_count || 0} experiences</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {paginatorInfo && paginatorInfo.lastPage > 1 && (
                <div className={styles.pagination}>
                  <Button
                    variant="secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {paginatorInfo.currentPage} of {paginatorInfo.lastPage}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={page === paginatorInfo.lastPage}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
