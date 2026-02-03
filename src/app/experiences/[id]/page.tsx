'use client'

/**
 * ExperienceDetailPage - Página de detalle de experiencia
 * 
 * Esta página muestra la información detallada de una experiencia.
 * Equivalente a pages/experiences/[id]/index.vue en el proyecto Vue.
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { getPriceFormat } from '@/utils/price'
import styles from './page.module.scss'

const EXPERIENCE_QUERY = gql`
  query Experience($uuid: String!) {
    experience(uuid: $uuid) {
      uuid
      name
      short_description
      description
      main_image {
        url
        alt
      }
      gallery {
        url
        alt
      }
      location {
        name
        country
        lat
        lng
      }
      duration
      max_capacity
      min_price
      currency
      is_exclusive
      rating
      reviews_count
      included
      not_included
      highlights
      requirements
      cancellation_policy
      package_types {
        uuid
        name
        description
        price
        duration
      }
    }
  }
`

export default function ExperienceDetailPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const uuid = params.id as string

  const { data, loading, error } = useQuery(EXPERIENCE_QUERY, {
    variables: { uuid },
    skip: !uuid,
  })

  const experience = data?.experience

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

  if (error || !experience) {
    return (
      <div className={styles.error}>
        <h1>{t('experience_not_found')}</h1>
        <p>{t('experience_not_found_description')}</p>
        <Button onClick={() => router.push('/experiences')}>
          {t('back_to_experiences')}
        </Button>
      </div>
    )
  }

  const allImages = [
    experience.main_image,
    ...(experience.gallery || []),
  ].filter(Boolean)

  const handleBooking = () => {
    if (selectedPackage) {
      router.push(`/experiences/${uuid}/confirm-booking?package=${selectedPackage}`)
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          {experience.main_image?.url && (
            <Image
              src={experience.main_image.url}
              alt={experience.main_image.alt || experience.name}
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
            <Link href="/experiences">{t('experiences')}</Link>
            <span>/</span>
            <span>{experience.name}</span>
          </div>

          {experience.is_exclusive && (
            <div className={styles.exclusiveBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/>
              </svg>
              {t('exclusive')}
            </div>
          )}

          <h1 className={styles.heroTitle}>{experience.name}</h1>

          <div className={styles.heroMeta}>
            {experience.location && (
              <div className={styles.metaItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{experience.location.name}, {experience.location.country}</span>
              </div>
            )}

            {experience.duration && (
              <div className={styles.metaItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>{experience.duration}</span>
              </div>
            )}

            {experience.rating && (
              <div className={styles.metaItem}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/>
                </svg>
                <span>{experience.rating} ({experience.reviews_count} {t('reviews')})</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          {/* Short Description */}
          {experience.short_description && (
            <section className={styles.section}>
              <p className={styles.shortDescription}>{experience.short_description}</p>
            </section>
          )}

          {/* Description */}
          {experience.description && (
            <section className={styles.section}>
              <h2>{t('about_this_experience')}</h2>
              <div 
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: experience.description }}
              />
            </section>
          )}

          {/* Highlights */}
          {experience.highlights?.length > 0 && (
            <section className={styles.section}>
              <h2>{t('highlights')}</h2>
              <ul className={styles.list}>
                {experience.highlights.map((item: string, index: number) => (
                  <li key={index}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What's Included */}
          {experience.included?.length > 0 && (
            <section className={styles.section}>
              <h2>{t('whats_included')}</h2>
              <ul className={styles.list}>
                {experience.included.map((item: string, index: number) => (
                  <li key={index} className={styles.included}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What's Not Included */}
          {experience.not_included?.length > 0 && (
            <section className={styles.section}>
              <h2>{t('whats_not_included')}</h2>
              <ul className={styles.list}>
                {experience.not_included.map((item: string, index: number) => (
                  <li key={index} className={styles.notIncluded}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {experience.requirements?.length > 0 && (
            <section className={styles.section}>
              <h2>{t('requirements')}</h2>
              <ul className={styles.list}>
                {experience.requirements.map((item: string, index: number) => (
                  <li key={index}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    {item}
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
          {experience.cancellation_policy && (
            <section className={styles.section}>
              <h2>{t('cancellation_policy')}</h2>
              <div 
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: experience.cancellation_policy }}
              />
            </section>
          )}
        </div>

        {/* Booking Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.priceInfo}>
              <span className={styles.from}>{t('from')}</span>
              <span className={styles.price}>
                {getPriceFormat(experience.min_price, experience.currency)}
              </span>
              <span className={styles.perPerson}>/{t('person')}</span>
            </div>

            {experience.package_types?.length > 0 && (
              <div className={styles.packages}>
                <label>{t('select_package')}</label>
                {experience.package_types.map((pkg: any) => (
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
                      {getPriceFormat(pkg.price, experience.currency)}
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
              disabled={!selectedPackage && experience.package_types?.length > 0}
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
            <Image
              src={allImages[activeImageIndex].url}
              alt={allImages[activeImageIndex].alt || 'Gallery'}
              fill
              style={{ objectFit: 'contain' }}
            />
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
