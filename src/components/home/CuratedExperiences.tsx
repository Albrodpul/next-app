'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/Button'
import { ExperienceCard } from '@/components/cards'
import { GET_ALL_EXPERIENCES } from '@/graphql/experiences'
import styles from './CuratedExperiences.module.scss'

interface CuratedExperiencesProps {
  onAllExperiences?: () => void
}

export function CuratedExperiences({ onAllExperiences }: CuratedExperiencesProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const { data, loading } = useQuery(GET_ALL_EXPERIENCES, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
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
          currency: undefined,
          price: undefined,
          isExclusive: !exp.user_can_purchase,
          rating: undefined,
        }
      }),
    [experiences, locale]
  )

  const handleSeeAll = () => {
    if (onAllExperiences) {
      onAllExperiences()
    } else {
      router.push('/experiences')
    }
  }

  // --- NUEVO: Carousel horizontal en vez de grid ---
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="heading3">
          {t.rich('curated_experiences_h2', {
            em: (chunks) => <em>{chunks}</em>
          })}
        </h2>
        <Button variant="link" onClick={handleSeeAll}>
          {t('see_all')}
        </Button>
      </div>

      <div
        className={styles.carousel}
        style={{
          display: 'flex',
          gap: 24,
          overflowX: 'auto',
          paddingBottom: 8,
          scrollbarWidth: 'thin',
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={styles.skeleton}
                style={{ minWidth: 320, flex: '0 0 320px' }}
              >
                <div className={styles.skeletonImage} />
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
                style={{ minWidth: 320, flex: '0 0 320px', maxWidth: 400 }}
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
                />
              </div>
            ))}

        {!loading && displayExperiences.length === 0 && (
          <div style={{ minWidth: 320, flex: '0 0 320px' }}>
            <p className="body1" style={{ color: 'var(--brand-mid-grey)' }}>
              {t('we_couldn_t_find_any_exact_matches_for_that_search')}.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CuratedExperiences
