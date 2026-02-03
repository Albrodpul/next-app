'use client'

import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/Button'
import { GET_FEATURED_EXPERIENCES } from '@/graphql/experiencesFeatured'
import styles from './ParadiseExclusive.module.scss'
import { ExperienceCard } from '@/components/cards'

interface ParadiseExclusiveProps {
  onAllExperiences: () => void
}

export function ParadiseExclusive({ onAllExperiences }: ParadiseExclusiveProps) {
  const t = useTranslations()
  const locale = useLocale()

  const { data, loading } = useQuery(GET_FEATURED_EXPERIENCES, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
      featured: true,
      filterEnabled: true,
      dateGreaterThanToday: true,
    },
    fetchPolicy: 'cache-first',
  })

  const experiences = data?.getAllExperiences?.data || []

  const displayExperiences = useMemo(
    () =>
      experiences.map((exp: any) => {
        const localizedName =
          exp[`name_${locale}`] || exp.name
        const localizedShortDescription =
          exp[`short_description_${locale}`] || exp.short_description

        const country = exp.location?.address?.country?.name
        const location = exp.location?.name
          ? {
              name: exp.location.name,
              country,
            }
          : undefined

        return {
          uuid: exp.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: exp.mainImage
            ? { url: exp.mainImage.url, alt: localizedName }
            : undefined,
          location,
          currency: exp.currency,
          price: exp.price,
          isExclusive: !exp.user_can_purchase,
          rating: exp.rating,
        }
      }),
    [experiences, locale]
  )

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="heading3">{t('paradise_exclusive')}</h2>
        <Button variant="link" onClick={onAllExperiences}>
          {t('see_all')}
        </Button>
      </div>

      <div
        className={styles.carousel}
        style={{
          display: 'flex',
          gap: 56,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: 8,
          scrollbarWidth: 'thin',
        }}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={styles.skeleton}
                style={{
                  minWidth: 640,
                  maxWidth: 820,
                  flex: '0 0 640px',
                }}
              >
                <div
                  className={styles.skeletonImage}
                  style={{ aspectRatio: '16/9', height: 400 }}
                />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonLine} style={{ width: '60%' }} />
                  <div className={styles.skeletonLine} style={{ width: '80%' }} />
                  <div className={styles.skeletonLine} style={{ width: '40%' }} />
                </div>
              </div>
            ))
          : displayExperiences.map((exp: any) => (
              <div
                key={exp.uuid}
                style={{
                  minWidth: 640,
                  maxWidth: 820,
                  flex: '0 0 640px',
                }}
              >
                <ExperienceCard
                  uuid={exp.uuid}
                  name={exp.name}
                  shortDescription={exp.shortDescription}
                  mainImage={exp.mainImage}
                  location={exp.location}
                  price={exp.price}
                  currency={exp.currency}
                  isExclusive={exp.isExclusive}
                  rating={exp.rating}
                  type="experience"
                  variant="large" // <-- tamaño grande
                />
              </div>
            ))}

        {!loading && displayExperiences.length === 0 && (
          <div style={{ minWidth: 640, flex: '0 0 640px' }}>
            <p className="body1" style={{ color: 'var(--brand-mid-grey)' }}>
              {t('we_couldn_t_find_any_exact_matches_for_that_search')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ParadiseExclusive
