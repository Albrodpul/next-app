'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { ExperienceCard } from '@/components/cards'
import styles from './page.module.scss'

const DESTINATION_QUERY = gql`
  query Destination($uuid: String!) {
    destination(uuid: $uuid) {
      uuid
      name
      description
      main_image {
        url
        alt
      }
      gallery {
        url
        alt
      }
      country
      region
      weather
      best_time_to_visit
      experiences {
        uuid
        name
        short_description
        main_image {
          url
          alt
        }
        location {
          name
        }
        min_price
        currency
        is_exclusive
        rating
      }
    }
  }
`

export default function DestinationDetailPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const uuid = params.id as string

  const { data, loading, error } = useQuery(DESTINATION_QUERY, {
    variables: { uuid },
    skip: !uuid,
  })

  const destination = data?.destination

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className={styles.error}>
        <h1>Destination not found</h1>
        <p>The destination you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/destinations')}>
          Back to Destinations
        </Button>
      </div>
    )
  }

  const allImages = [
    destination.main_image,
    ...(destination.gallery || []),
  ].filter(Boolean)

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          {destination.main_image?.url && (
            <Image
              src={destination.main_image.url}
              alt={destination.main_image.alt || destination.name}
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
            <Link href="/destinations">{t('destinations')}</Link>
            <span>/</span>
            <span>{destination.name}</span>
          </div>

          <h1 className={styles.heroTitle}>{destination.name}</h1>

          {destination.country && (
            <div className={styles.heroMeta}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{destination.region ? `${destination.region}, ` : ''}{destination.country}</span>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className={styles.content}>
        {/* About */}
        {destination.description && (
          <section className={styles.section}>
            <h2>About {destination.name}</h2>
            <div 
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: destination.description }}
            />
          </section>
        )}

        {/* Info Cards */}
        <div className={styles.infoCards}>
          {destination.weather && (
            <div className={styles.infoCard}>
              <h3>Weather</h3>
              <p>{destination.weather}</p>
            </div>
          )}
          {destination.best_time_to_visit && (
            <div className={styles.infoCard}>
              <h3>Best Time to Visit</h3>
              <p>{destination.best_time_to_visit}</p>
            </div>
          )}
        </div>

        {/* Gallery */}
        {allImages.length > 1 && (
          <section className={styles.section}>
            <h2>{t('gallery')}</h2>
            <div className={styles.gallery}>
              {allImages.slice(0, 6).map((image: any, index: number) => (
                <div key={index} className={styles.galleryItem}>
                  <Image
                    src={image.url}
                    alt={image.alt || `Gallery ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experiences in this destination */}
        {destination.experiences?.length > 0 && (
          <section className={styles.section}>
            <h2>Experiences in {destination.name}</h2>
            <div className={styles.experiencesGrid}>
              {destination.experiences.map((exp: any) => (
                <ExperienceCard
                  key={exp.uuid}
                  uuid={exp.uuid}
                  name={exp.name}
                  shortDescription={exp.short_description}
                  mainImage={exp.main_image}
                  location={exp.location}
                  price={exp.min_price}
                  currency={exp.currency}
                  isExclusive={exp.is_exclusive}
                  rating={exp.rating}
                  type="experience"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
