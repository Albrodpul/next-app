'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { GET_ALL_EXPERIENCES } from '@/graphql/experiences'
import { HomeCarouselSection } from './HomeCarouselSection'

export function LatestExperiencesSection() {
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

  const items = useMemo(
    () =>
      experiences.map((exp: any) => {
        const localizedName = exp[`name_${locale}`] || exp.name
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

  return (
    <HomeCarouselSection
      title={t('our_latest_experiences')}
      onSeeAll={() => router.push('/experiences')}
      seeAllLabel={t('see_all')}
      items={items}
      loading={loading}
      emptyMessage={t('we_couldn_t_find_any_exact_matches_for_that_search')}
      cardType="experience"
    />
  )
}

export default LatestExperiencesSection
