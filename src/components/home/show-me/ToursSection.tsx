'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { GET_ALL_TOURS } from '@/graphql/tours'
import { HomeCarouselSection } from './HomeCarouselSection'

export function ToursSection() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const { data, loading } = useQuery(GET_ALL_TOURS, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
    },
    fetchPolicy: 'cache-first',
  })

  const tours = data?.getAllTours?.data || []

  const items = useMemo(
    () =>
      tours.map((tour: any) => {
        const localizedName = tour[`name_${locale}`] || tour.name
        const localizedShortDescription =
          tour[`short_description_${locale}`] || tour.short_description

        const country = tour.location?.address?.country?.name
        const location = tour.location?.name
          ? {
              name: tour.location.name,
              country,
            }
          : undefined

        return {
          uuid: tour.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: tour.mainImage
            ? { url: tour.mainImage.url, alt: localizedName }
            : undefined,
          location,
          currency: undefined,
          price: undefined,
          isExclusive: false,
          rating: undefined,
        }
      }),
    [tours, locale]
  )

  return (
    <HomeCarouselSection
      title={t.rich('tours_h2', { em: (chunks) => <em>{chunks}</em> })}
      onSeeAll={() => router.push('/tours')}
      seeAllLabel={t('see_all')}
      items={items}
      loading={loading}
      emptyMessage={t('we_couldn_t_find_any_exact_matches_for_that_search')}
      cardType="tour"
    />
  )
}

export default ToursSection
