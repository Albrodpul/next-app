'use client'

/**
 * DetailPage - Componente compartido para páginas de detalle
 * 
 * Este componente se usa para mostrar el detalle de experiencias,
 * actividades, tours, accommodations, restaurants, y services.
 * 
 * Es configurable mediante props para adaptarse a cada tipo.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { getPriceFormat } from '@/utils/price'
import styles from './DetailPage.module.scss'

export interface DetailItem {
  uuid: string
  name: string
  short_description?: string
  description?: string
  main_image?: {
    url: string
    alt?: string
  }
  gallery?: Array<{
    url: string
    alt?: string
  }>
  location?: {
    name: string
    country?: string
    lat?: number
    lng?: number
  }
  duration?: string
  max_capacity?: number
  min_price?: number
  currency?: string
  is_exclusive?: boolean
  rating?: number
  reviews_count?: number
  included?: string[]
  not_included?: string[]
  highlights?: string[]
  requirements?: string[]
  cancellation_policy?: string
  package_types?: Array<{
    uuid: string
    name: string
    description?: string
    price: number
    duration?: string
  }>
}

interface DetailPageProps {
  item: DetailItem | null
  loading: boolean
  error?: Error | null
  type: 'experience' | 'activity' | 'tour' | 'accommodation' | 'restaurant' | 'service'
  categoryPath: string
  categoryLabel: string
}

export function DetailPage({
  item,
  loading,
  error,
  type,
  categoryPath,
  categoryLabel,
}: DetailPageProps) {
  const t = useTranslations()
  const router = useRouter()

  // Estado para galería
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)

  // Estado para booking
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !item) {
    const notFoundKey = `${type}_not_found`
    const notFoundDescKey = `${type}_not_found_description`
    const backKey = `back_to_${categoryPath.replace('/', '')}`

    return (
      <div className={styles.error}>
        <h1>{t(notFoundKey)}</h1>
        <p>{t(notFoundDescKey)}</p>
        <Button onClick={() => router.push(categoryPath)}>
          {t(backKey)}
        </Button>
      </div>
    )
  }

  const allImages = [
    item.main_image,
    ...(item.gallery || []),
  ].filter(Boolean)

  const handleBooking = () => {
    if (selectedPackage || !item.package_types?.length) {
      router.push(`${categoryPath}/${item.uuid}/confirm-booking${selectedPackage ? `?package=${selectedPackage}` : ''}`)
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          {item.main_image?.url && (
            <Image
              src={item.main_image.url}
              alt={item.main_image.alt || item.name}
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          )}
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">{t('home')}</Link>
            <span>/</span>
            <Link href={categoryPath}>{categoryLabel}</Link>
            <span>/</span>
            <span>{item.name}</span>
          </div>

          {item.is_exclusive && (
            <div className={styles.exclusiveBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/>
              </svg>
              {t('exclusive')}
            </div>
          )}

          <h1 className={styles.heroTitle}>{item.name}</h1>

          <div className={styles.heroMeta}>
            {item.location && (
              <div className={styles.metaItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{item.location.name}{item.location.country ? `, ${item.location.country}` : ''}</span>
              </div>
            )}

            {item.duration && (
              <div className={styles.metaItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>{item.duration}</span>
              </div>
            )}

            {item.rating !== undefined && (
              <div className={styles.metaItem}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/>
                </svg>
                <span>{item.rating.toFixed(1)} ({item.reviews_count || 0} {t('reviews')})</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          {/* Short Description */}
          {item.short_description && (
            <section className={styles.section}>
              <p className={styles.shortDescription}>{item.short_description}</p>
            </section>
          )}

          {/* Description */}
          {item.description && (
            <section className={styles.section}>
              <h2>{t('about_this_experience')}</h2>
              <div 
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </section>
          )}

          {/* Highlights */}
          {item.highlights && item.highlights.length > 0 && (
            <section className={styles.section}>
              <h2>{t('highlights')}</h2>
              <ul className={styles.list}>
                {item.highlights.map((text, index) => (
                  <li key={index}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What's Included */}
          {item.included && item.included.length > 0 && (
            <section className={styles.section}>
              <h2>{t('whats_included')}</h2>
              <ul className={styles.list}>
                {item.included.map((text, index) => (
                  <li key={index} className={styles.included}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What's Not Included */}
          {item.not_included && item.not_included.length > 0 && (
            <section className={styles.section}>
              <h2>{t('whats_not_included')}</h2>
              <ul className={styles.list}>
                {item.not_included.map((text, index) => (
                  <li key={index} className={styles.notIncluded}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {item.requirements && item.requirements.length > 0 && (
            <section className={styles.section}>
              <h2>{t('requirements')}</h2>
              <ul className={styles.list}>
                {item.requirements.map((text, index) => (
                  <li key={index}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Gallery */}
          {allImages.length > 1 && (
            <section className={styles.section}>
              <h2>{t('gallery')}</h2>
              <div className={styles.gallery}>
                {allImages.slice(0, 6).map((image: any, index: number) => (
                  <button
                    key={index}
                    className={styles.galleryItem}
                    onClick={() => {
                      setActiveImageIndex(index)
                      setShowGallery(true)
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Gallery ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Cancellation Policy */}
          {item.cancellation_policy && (
            <section className={styles.section}>
              <h2>{t('cancellation_policy')}</h2>
              <div 
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: item.cancellation_policy }}
              />
            </section>
          )}
        </div>

        {/* Booking Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            {item.min_price !== undefined && (
              <div className={styles.priceInfo}>
                <span className={styles.from}>{t('from')}</span>
                <span className={styles.price}>
                  {getPriceFormat(item.min_price, item.currency)}
                </span>
                <span className={styles.perPerson}>/{t('person')}</span>
              </div>
            )}

            {item.package_types && item.package_types.length > 0 && (
              <div className={styles.packages}>
                <label>{t('select_package')}</label>
                {item.package_types.map((pkg) => (
                  <button
                    key={pkg.uuid}
                    className={`${styles.packageOption} ${selectedPackage === pkg.uuid ? styles.selected : ''}`}
                    onClick={() => setSelectedPackage(pkg.uuid)}
                  >
                    <div className={styles.packageInfo}>
                      <span className={styles.packageName}>{pkg.name}</span>
                      {pkg.duration && (
                        <span className={styles.packageDuration}>{pkg.duration}</span>
                      )}
                    </div>
                    <span className={styles.packagePrice}>
                      {getPriceFormat(pkg.price, item.currency)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleBooking}
              disabled={item.package_types && item.package_types.length > 0 && !selectedPackage}
            >
              {t('book_now')}
            </Button>

            <p className={styles.bookingNote}>
              {t('no_payment_required_yet')}
            </p>
          </div>

          {/* Contact Card */}
          <div className={styles.contactCard}>
            <h3>{t('need_help')}</h3>
            <p>{t('contact_our_team')}</p>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => router.push('/contact-us')}
            >
              {t('contact_us')}
            </Button>
          </div>
        </aside>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className={styles.galleryModal} onClick={() => setShowGallery(false)}>
          <button className={styles.closeModal} onClick={() => setShowGallery(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            className={styles.navPrev}
            onClick={(e) => {
              e.stopPropagation()
              setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>

          <div className={styles.galleryModalContent}>
            {allImages[activeImageIndex] && (
              <Image
                src={allImages[activeImageIndex]!.url}
                alt={allImages[activeImageIndex]?.alt || 'Gallery'}
                fill
                style={{ objectFit: 'contain' }}
              />
            )}
          </div>

          <button
            className={styles.navNext}
            onClick={(e) => {
              e.stopPropagation()
              setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>

          <div className={styles.galleryCounter}>
            {activeImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailPage
